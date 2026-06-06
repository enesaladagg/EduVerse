const E = require('../events');
const roomManager = require('../roomManager');
const logger = require('../../utils/logger');

/**
 * Gelişmiş Beyaz Tahta senkronizasyon handler'ı.
 *
 * Çizim koordinatları odadaki diğer katılımcılara gerçek zamanlı yayılır.
 * `socket.to(roomId)` kullanılır → gönderen istemciye geri yansıtılmaz
 * (echo önlenir, yerel çizim zaten anında görünür).
 *
 * Geç katılan / yeniden bağlanan istemciler için son snapshot saklanır ve
 * talep üzerine (WB_SNAPSHOT_REQUEST) geri gönderilir.
 */
const MAX_POINTS_PER_BATCH = 2000;

function isValidStroke(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (typeof payload.roomId !== 'string') return false;
  return true;
}

module.exports = function registerWhiteboardHandlers(io, socket) {
  const userId = socket.user.id;

  // Tek nokta / serbest çizgi parçası
  socket.on(E.WB_DRAW, (payload) => {
    if (!isValidStroke(payload)) return;
    const { roomId } = payload;

    // Seminer modunda yalnızca yayın yetkisi olanlar tahtaya çizebilir
    if (!roomManager.canPublish(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'whiteboard:draw' });
      return;
    }

    roomManager.appendWhiteboardOp(roomId, { t: 'draw', d: payload });
    socket.to(roomId).emit(E.WB_DRAW, { ...payload, authorId: userId });
  });

  // Performans için: birden çok noktayı tek mesajda gönder (throttle/batch)
  socket.on(E.WB_DRAW_BATCH, (payload) => {
    if (!isValidStroke(payload) || !Array.isArray(payload.points)) return;
    if (payload.points.length > MAX_POINTS_PER_BATCH) {
      payload.points = payload.points.slice(0, MAX_POINTS_PER_BATCH);
    }
    roomManager.appendWhiteboardOp(payload.roomId, { t: 'batch', d: payload });
    socket.to(payload.roomId).emit(E.WB_DRAW_BATCH, { ...payload, authorId: userId });
  });

  // Şekil (çizgi, dikdörtgen, daire, metin)
  socket.on(E.WB_SHAPE, (payload) => {
    if (!isValidStroke(payload)) return;
    if (!roomManager.canPublish(payload.roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'whiteboard:shape' });
      return;
    }
    roomManager.appendWhiteboardOp(payload.roomId, { t: 'shape', d: payload });
    socket.to(payload.roomId).emit(E.WB_SHAPE, { ...payload, authorId: userId });
  });

  // Tahtayı temizle (yalnızca host veya yayıncı)
  socket.on(E.WB_CLEAR, ({ roomId } = {}) => {
    if (!roomId) return;
    if (!roomManager.canPublish(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'whiteboard:clear' });
      return;
    }
    roomManager.clearWhiteboard(roomId);
    socket.to(roomId).emit(E.WB_CLEAR, { authorId: userId });
  });

  // İstemci periyodik olarak tüm tuval snapshot'ını (dataURL) gönderir.
  // Bu, geç katılanların hızlıca güncel duruma gelmesini sağlar.
  socket.on(E.WB_SNAPSHOT_SYNC, ({ roomId, snapshot } = {}) => {
    if (!roomId || typeof snapshot !== 'string') return;
    // Çok büyük snapshot'ları reddet (~8MB üstü) — bellek koruması
    if (snapshot.length > 8 * 1024 * 1024) return;
    roomManager.saveWhiteboardSnapshot(roomId, snapshot);
  });

  // Geç katılan istemci güncel tahtayı ister
  socket.on(E.WB_SNAPSHOT_REQUEST, ({ roomId } = {}) => {
    if (!roomId) return;
    const snapshot = roomManager.getWhiteboardSnapshot(roomId);
    if (snapshot) {
      socket.emit(E.WB_SNAPSHOT_SYNC, { roomId, snapshot });
    }
    logger.info('Whiteboard snapshot served', { roomId, hasSnapshot: !!snapshot });
  });
};
