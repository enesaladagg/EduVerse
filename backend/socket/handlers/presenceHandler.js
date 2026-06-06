const E = require('../events');
const roomManager = require('../roomManager');

module.exports = function registerPresenceHandlers(io, socket) {
  const userId = socket.user.id;

  socket.on(E.PRESENCE_UPDATE, ({ roomId, mic, cam, hand } = {}) => {
    if (!roomId) return;
    const participant = roomManager.updatePresence(roomId, userId, {
      mic: typeof mic === 'boolean' ? mic : undefined,
      cam: typeof cam === 'boolean' ? cam : undefined,
      hand: typeof hand === 'boolean' ? hand : undefined,
    });
    if (!participant) return;
    io.to(roomId).emit(E.PRESENCE_UPDATE, {
      roomId,
      userId,
      mic: participant.mic,
      cam: participant.cam,
      hand: participant.hand,
    });
  });
};
