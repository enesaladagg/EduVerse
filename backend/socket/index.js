const { Server } = require('socket.io');

const logger = require('../utils/logger');
const { isOriginAllowed } = require('../utils/corsOrigins');
const socketAuth = require('./auth');
const roomManager = require('./roomManager');
const E = require('./events');

const registerWhiteboardHandlers = require('./handlers/whiteboardHandler');
const registerCodeSandboxHandlers = require('./handlers/codeSandboxHandler');
const registerWebRTCHandlers = require('./handlers/webrtcHandler');
const registerSeminarHandlers = require('./handlers/seminarHandler');
const registerChatHandlers = require('./handlers/chatHandler');
const registerPollHandlers = require('./handlers/pollHandler');
const registerPresenceHandlers = require('./handlers/presenceHandler');

let LiveSession;
try {
  // Model yüklenemezse (ör. test ortamı) socket yine de çalışır.
  LiveSession = require('../models/LiveSession');
} catch (err) {
  LiveSession = null;
}

/**
 * Verilen bir odanın seminer konfigürasyonunu DB'den yükleyip roomManager'a
 * uygular. DB erişilemezse lecture moduna güvenli şekilde düşer.
 */
async function hydrateRoomConfig(roomId) {
  if (!LiveSession) return;
  try {
    const session = await LiveSession.findOne({ roomId }).lean();
    if (session) {
      roomManager.configureRoom(roomId, {
        sessionType: session.sessionType,
        hostId: session.hostId,
        guestSpeakerIds: session.guestSpeakerIds || [],
      });
    }
  } catch (err) {
    logger.warn('Room config hydrate failed; defaulting to lecture', {
      roomId,
      message: err.message,
    });
  }
}

/**
 * Socket.io sunucusunu HTTP sunucusuna bağlar ve tüm event handler'ları kaydeder.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
    // Dayanıklılık: koptuğunda istemci buffer'ı korunur, ping ile ölü bağlantı tespiti
    pingInterval: 25000,
    pingTimeout: 20000,
    connectionStateRecovery: {
      // Kısa kopmalarda (ör. tünel/ağ değişimi) oturum state'ini kurtar
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: false,
    },
  });

  // Handshake kimlik doğrulama
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    logger.info('Socket connected', { socketId: socket.id, userId, recovered: socket.recovered });

    // --- Odaya katılma ---
    socket.on(E.ROOM_JOIN, async ({ roomId, displayName } = {}) => {
      if (!roomId || typeof roomId !== 'string') {
        socket.emit(E.ROOM_ERROR, { code: 'ROOM_ID_REQUIRED' });
        return;
      }

      await hydrateRoomConfig(roomId);

      const existingRoom = roomManager.getRoom(roomId);
      if (socket.user.role === 'teacher') {
        roomManager.configureRoom(roomId, { hostId: userId, sessionType: 'lecture' });
      } else if (!existingRoom?.hostId) {
        roomManager.configureRoom(roomId, { hostId: userId, sessionType: 'lecture' });
      }

      if (!roomManager.getPoll(roomId)) {
        roomManager.createPoll(roomId, {
          question: "React'te global state için en çok hangisini tercih edersiniz?",
          options: ['useState + Context', 'useReducer', 'Redux Toolkit', 'Zustand'],
          createdBy: userId,
        });
      }

      socket.join(roomId);
      socket.data.roomId = roomId;

      const participant = roomManager.addParticipant(roomId, {
        userId,
        socketId: socket.id,
        displayName: displayName || socket.user.name,
      });

      socket.emit(E.ROOM_JOINED, {
        roomId,
        self: {
          userId,
          displayName: participant.displayName,
          role: participant.role,
          canPublishAudio: participant.canPublishAudio,
          canPublishVideo: participant.canPublishVideo,
          canShareScreen: participant.canShareScreen,
          mic: participant.mic,
          cam: participant.cam,
          hand: participant.hand,
        },
        participants: roomManager.listParticipants(roomId),
        poll: roomManager.getPoll(roomId),
      });

      socket.emit(E.CHAT_HISTORY, {
        roomId,
        messages: roomManager.getChatHistory(roomId),
      });

      // Geç katılan için tahta snapshot'ını otomatik gönder
      const snapshot = roomManager.getWhiteboardSnapshot(roomId);
      if (snapshot) {
        socket.emit(E.WB_SNAPSHOT_SYNC, { roomId, snapshot });
      }

      // Odadaki diğerlerine yeni peer'ı haber ver (WebRTC offer akışını tetikler)
      socket.to(roomId).emit(E.ROOM_PEER_JOINED, {
        roomId,
        userId,
        socketId: socket.id,
        role: participant.role,
      });

      // Güncel katılımcı listesini herkese yayınla
      io.to(roomId).emit(E.ROOM_PARTICIPANTS, {
        roomId,
        participants: roomManager.listParticipants(roomId),
      });
    });

    // --- Odadan ayrılma (gönüllü) ---
    socket.on(E.ROOM_LEAVE, ({ roomId } = {}) => {
      const targetRoom = roomId || socket.data.roomId;
      if (!targetRoom) return;
      handleLeave(io, socket, targetRoom, userId, { permanent: true });
    });

    // --- Özellik handler'larını kaydet ---
    registerWhiteboardHandlers(io, socket);
    registerCodeSandboxHandlers(io, socket);
    registerWebRTCHandlers(io, socket);
    registerSeminarHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerPollHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    // Bağlantı sağlığı (istemci ölü bağlantı tespiti için)
    socket.on(E.CONN_HEARTBEAT, () => socket.emit(E.CONN_HEARTBEAT, { at: Date.now() }));

    // --- Bağlantı kopması ---
    socket.on('disconnect', (reason) => {
      const roomId = socket.data.roomId;
      logger.info('Socket disconnected', { socketId: socket.id, userId, reason });
      if (!roomId) return;

      // Kısa süreli kopma için katılımcıyı hemen silme — disconnected işaretle
      roomManager.markDisconnected(roomId, socket.id);

      // Diğer peer'lara WebRTC bağlantısını tazelemeleri için bildir
      socket.to(roomId).emit(E.RTC_PEER_DISCONNECTED, { roomId, userId, socketId: socket.id });

      // connectionStateRecovery penceresi dolarsa kalıcı çıkış uygula
      setTimeout(() => {
        const current = roomManager.getParticipant(roomId, userId);
        if (current && current.connected === false) {
          handleLeave(io, socket, roomId, userId, { permanent: true });
        }
      }, 2 * 60 * 1000);
    });
  });

  logger.info('Socket.io initialized');
  return io;
}

function handleLeave(io, socket, roomId, userId, { permanent } = {}) {
  socket.leave(roomId);
  if (permanent) {
    roomManager.removeParticipant(roomId, userId);
  }
  socket.to(roomId).emit(E.ROOM_PEER_LEFT, { roomId, userId, socketId: socket.id });
  io.to(roomId).emit(E.ROOM_PARTICIPANTS, {
    roomId,
    participants: roomManager.listParticipants(roomId),
  });
}

module.exports = { initSocket };
