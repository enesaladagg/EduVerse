const E = require('../events');
const roomManager = require('../roomManager');
const logger = require('../../utils/logger');

/**
 * Code Sandbox handler'ı.
 *
 * Öğrencilerin yazdığı kod blokları eğitmenin (host) ekranına anlık düşürülür.
 *   - CODE_UPDATE : Canlı yazım (debounce'lu, host'a stream edilir)
 *   - CODE_SUBMIT : Öğrenci kodu teslim eder → host'a "yeni teslim" olarak düşer
 *   - CODE_FEEDBACK: Host -> öğrenciye geri bildirim / not gönderir
 *
 * Öğrenci kodu yalnızca host'a (ve istenirse diğer eğitmenlere) gider;
 * tüm odaya broadcast EDİLMEZ (gizlilik + gürültü önleme).
 */
const MAX_CODE_LENGTH = 100 * 1024; // 100 KB

function findHostSocketId(roomId) {
  const participants = roomManager.listParticipants(roomId);
  const host = participants.find((p) => p.role === 'host' && p.connected);
  return host ? host.socketId : null;
}

function sanitizeCodePayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const { roomId, code, language } = payload;
  if (typeof roomId !== 'string' || typeof code !== 'string') return null;
  return {
    roomId,
    language: typeof language === 'string' ? language : 'javascript',
    code: code.slice(0, MAX_CODE_LENGTH),
  };
}

module.exports = function registerCodeSandboxHandlers(io, socket) {
  const userId = socket.user.id;

  // Canlı yazım — öğrencinin editöründeki değişiklikleri host'a stream eder
  socket.on(E.CODE_UPDATE, (payload) => {
    const data = sanitizeCodePayload(payload);
    if (!data) return;

    const hostSocketId = findHostSocketId(data.roomId);
    if (!hostSocketId || hostSocketId === socket.id) return; // host kendi kodunu görmeye gerek yok

    io.to(hostSocketId).emit(E.CODE_UPDATE, {
      ...data,
      studentId: userId,
      at: Date.now(),
    });
  });

  // Kesin teslim — host'a belirgin bir "teslim alındı" olayı
  socket.on(E.CODE_SUBMIT, (payload) => {
    const data = sanitizeCodePayload(payload);
    if (!data) return;

    const hostSocketId = findHostSocketId(data.roomId);
    if (hostSocketId) {
      io.to(hostSocketId).emit(E.CODE_SUBMIT, {
        ...data,
        studentId: userId,
        submittedAt: Date.now(),
      });
    }

    // Öğrenciye teslimin alındığına dair onay
    socket.emit(E.CODE_RECEIVED, { roomId: data.roomId, ok: true });
    logger.info('Code submitted to host', {
      roomId: data.roomId,
      studentId: userId,
      hasHost: !!hostSocketId,
    });
  });

  // Host -> öğrenciye geri bildirim
  socket.on(E.CODE_FEEDBACK, ({ roomId, studentId, message, score } = {}) => {
    if (!roomId || !studentId) return;
    if (!roomManager.isHost(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'code:feedback' });
      return;
    }
    const target = roomManager.getParticipant(roomId, studentId);
    if (target?.socketId) {
      io.to(target.socketId).emit(E.CODE_FEEDBACK, {
        roomId,
        message: typeof message === 'string' ? message.slice(0, 2000) : '',
        score: typeof score === 'number' ? score : null,
        at: Date.now(),
      });
    }
  });
};
