const E = require('../events');
const roomManager = require('../roomManager');
const logger = require('../../utils/logger');

/**
 * WebRTC sinyalleşme handler'ı (mesh / SFU-agnostik).
 *
 * Offer / Answer / ICE-candidate mesajları hedef peer'a yönlendirilir.
 * Her mesaj `targetSocketId` veya `targetUserId` içerir; sunucu yalnızca
 * ilgili peer'a iletir (1:1 yönlendirme, gereksiz yayını önler).
 *
 * Dayanıklılık (kopmalara karşı):
 *   - Seminer modunda yalnızca yayın yetkisi olanların offer göndermesine izin verilir.
 *   - Hedef peer disconnected ise gönderene RTC_PEER_DISCONNECTED bilgisi döner,
 *     böylece istemci yeniden müzakere (renegotiation) deneyebilir.
 *   - RTC_RENEGOTIATE: ICE restart / yeniden bağlanma sonrası bağlantı tazeleme.
 */

function resolveTarget(roomId, payload) {
  if (payload.targetSocketId) return payload.targetSocketId;
  if (payload.targetUserId) {
    const p = roomManager.getParticipant(roomId, payload.targetUserId);
    return p?.socketId || null;
  }
  return null;
}

function validSignal(payload) {
  return payload && typeof payload === 'object' && typeof payload.roomId === 'string';
}

module.exports = function registerWebRTCHandlers(io, socket) {
  const userId = socket.user.id;

  // --- OFFER ---
  socket.on(E.RTC_OFFER, (payload) => {
    if (!validSignal(payload) || !payload.sdp) return;
    const { roomId } = payload;

    // Seminer modunda yalnızca host / guest_speaker yayın (offer) başlatabilir
    if (!roomManager.canPublish(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'rtc:offer' });
      logger.warn('Blocked RTC offer from non-publisher', { roomId, userId });
      return;
    }

    const targetSocketId = resolveTarget(roomId, payload);
    if (!targetSocketId) {
      socket.emit(E.RTC_PEER_DISCONNECTED, { roomId, reason: 'TARGET_NOT_FOUND' });
      return;
    }

    io.to(targetSocketId).emit(E.RTC_OFFER, {
      roomId,
      sdp: payload.sdp,
      fromSocketId: socket.id,
      fromUserId: userId,
    });
  });

  // --- ANSWER ---
  socket.on(E.RTC_ANSWER, (payload) => {
    if (!validSignal(payload) || !payload.sdp) return;
    const targetSocketId = resolveTarget(payload.roomId, payload);
    if (!targetSocketId) {
      socket.emit(E.RTC_PEER_DISCONNECTED, { roomId: payload.roomId, reason: 'TARGET_NOT_FOUND' });
      return;
    }
    io.to(targetSocketId).emit(E.RTC_ANSWER, {
      roomId: payload.roomId,
      sdp: payload.sdp,
      fromSocketId: socket.id,
      fromUserId: userId,
    });
  });

  // --- ICE CANDIDATE ---
  socket.on(E.RTC_ICE_CANDIDATE, (payload) => {
    if (!validSignal(payload) || !payload.candidate) return;
    const targetSocketId = resolveTarget(payload.roomId, payload);
    if (!targetSocketId) return; // ICE adayları kaybolabilir; sessizce yut
    io.to(targetSocketId).emit(E.RTC_ICE_CANDIDATE, {
      roomId: payload.roomId,
      candidate: payload.candidate,
      fromSocketId: socket.id,
      fromUserId: userId,
    });
  });

  // --- RENEGOTIATION (ICE restart / reconnect sonrası) ---
  socket.on(E.RTC_RENEGOTIATE, (payload) => {
    if (!validSignal(payload)) return;
    const targetSocketId = resolveTarget(payload.roomId, payload);
    if (!targetSocketId) {
      socket.emit(E.RTC_PEER_DISCONNECTED, { roomId: payload.roomId, reason: 'TARGET_NOT_FOUND' });
      return;
    }
    io.to(targetSocketId).emit(E.RTC_RENEGOTIATE, {
      roomId: payload.roomId,
      fromSocketId: socket.id,
      fromUserId: userId,
      iceRestart: !!payload.iceRestart,
    });
  });
};
