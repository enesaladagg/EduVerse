const E = require('../events');
const roomManager = require('../roomManager');

module.exports = function registerPollHandlers(io, socket) {
  const userId = socket.user.id;

  socket.on(E.POLL_CREATE, ({ roomId, question, options } = {}) => {
    if (!roomId || !roomManager.isHost(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'poll:create' });
      return;
    }
    if (!question || !Array.isArray(options) || options.length < 2) return;

    const poll = roomManager.createPoll(roomId, {
      question: String(question).slice(0, 500),
      options: options.slice(0, 6).map((o) => String(o).slice(0, 120)),
      createdBy: userId,
    });
    io.to(roomId).emit(E.POLL_UPDATE, { roomId, poll });
  });

  socket.on(E.POLL_VOTE, ({ roomId, optionIndex } = {}) => {
    if (!roomId || typeof optionIndex !== 'number') return;
    const poll = roomManager.votePoll(roomId, userId, optionIndex);
    if (poll) io.to(roomId).emit(E.POLL_UPDATE, { roomId, poll });
  });

  socket.on(E.POLL_END, ({ roomId } = {}) => {
    if (!roomId || !roomManager.isHost(roomId, userId)) {
      socket.emit(E.SEMINAR_PERMISSION_DENIED, { action: 'poll:end' });
      return;
    }
    const poll = roomManager.endPoll(roomId);
    io.to(roomId).emit(E.POLL_UPDATE, { roomId, poll });
  });
};
