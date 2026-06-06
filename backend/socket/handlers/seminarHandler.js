const E = require('../events');
const roomManager = require('../roomManager');
const logger = require('../../utils/logger');

/**
 * Seminer / Guest Speaker yönetim handler'ı.
 *
 * Seminer modu mantığı:
 *   - Yalnızca `host` ve `guest_speaker` rolleri ses/video/ekran yayını yapabilir.
 *   - `attendee` rolündekiler yalnızca izler; sahneye çıkmak için talep gönderir.
 *   - Host, bir katılımcıyı guest_speaker'a yükseltebilir (promote) veya
 *     izleyiciye indirebilir (demote).
 *   - Rol değişiklikleri tüm odaya yayılır → istemciler UI'larını günceller ve
 *     yeni yayıncı için WebRTC offer akışını başlatır.
 */
module.exports = function registerSeminarHandlers(io, socket) {
  const userId = socket.user.id;

  // Host bir katılımcıyı sahneye çıkarır (guest_speaker)
  socket.on(E.SEMINAR_PROMOTE, ({ roomId, targetUserId } = {}) => {
    if (!roomId || !targetUserId) return;

    if (!roomManager.isHost(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'seminar:promote' });
      return;
    }

    const updated = roomManager.setRole(roomId, targetUserId, 'guest_speaker');
    if (!updated) return;

    roomManager.setActiveSpeaker(roomId, targetUserId);

    io.to(roomId).emit(E.SEMINAR_ROLE_CHANGED, {
      roomId,
      userId: String(targetUserId),
      role: 'guest_speaker',
      canPublishAudio: true,
      canPublishVideo: true,
      canShareScreen: true,
      by: userId,
    });

    logger.info('Participant promoted to guest_speaker', { roomId, targetUserId, by: userId });
  });

  // Host bir konuşmacıyı izleyiciye indirir
  socket.on(E.SEMINAR_DEMOTE, ({ roomId, targetUserId } = {}) => {
    if (!roomId || !targetUserId) return;

    if (!roomManager.isHost(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'seminar:demote' });
      return;
    }

    const updated = roomManager.setRole(roomId, targetUserId, 'attendee');
    if (!updated) return;

    const room = roomManager.getRoom(roomId);
    if (room && room.activeSpeakerId === String(targetUserId)) {
      roomManager.setActiveSpeaker(roomId, null);
    }

    io.to(roomId).emit(E.SEMINAR_ROLE_CHANGED, {
      roomId,
      userId: String(targetUserId),
      role: 'attendee',
      canPublishAudio: false,
      canPublishVideo: false,
      canShareScreen: false,
      by: userId,
    });

    logger.info('Participant demoted to attendee', { roomId, targetUserId, by: userId });
  });

  // Attendee sahneye çıkmak için el kaldırır / talep gönderir
  socket.on(E.SEMINAR_REQUEST_STAGE, ({ roomId } = {}) => {
    if (!roomId) return;
    const room = roomManager.getRoom(roomId);
    if (!room || !room.hostId) return;

    const host = roomManager.getParticipant(roomId, room.hostId);
    if (host?.socketId) {
      io.to(host.socketId).emit(E.SEMINAR_STAGE_REQUESTED, {
        roomId,
        requesterId: userId,
        at: Date.now(),
      });
    }
  });
};
