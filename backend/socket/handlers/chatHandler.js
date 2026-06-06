const E = require('../events');
const roomManager = require('../roomManager');

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CHAT_HISTORY = 200;

module.exports = function registerChatHandlers(io, socket) {
  const userId = socket.user.id;
  const userName = socket.user.name || `Kullanıcı ${String(userId).slice(-4)}`;

  socket.on(E.CHAT_MESSAGE, ({ roomId, text } = {}) => {
    if (!roomId || typeof text !== 'string') return;
    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) return;

    const message = {
      id: `${Date.now()}-${userId}`,
      userId,
      userName,
      role: socket.user.role,
      text: trimmed,
      at: Date.now(),
    };

    roomManager.addChatMessage(roomId, message);
    io.to(roomId).emit(E.CHAT_MESSAGE, { roomId, message });
  });

  socket.on(E.CHAT_HISTORY, ({ roomId } = {}) => {
    if (!roomId) return;
    const messages = roomManager.getChatHistory(roomId);
    socket.emit(E.CHAT_HISTORY, { roomId, messages });
  });
};
