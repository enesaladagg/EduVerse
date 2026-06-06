const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Socket.io handshake kimlik doğrulama middleware'i.
 * Token üç kaynaktan da kabul edilir:
 *   1. socket.handshake.auth.token   (önerilen — io(url, { auth: { token } }))
 *   2. Authorization: Bearer <token>  header'ı
 *   3. handshake.query.token          (geri uyumluluk)
 *
 * Başarılı olursa socket.user = { id, role } olarak set edilir.
 */
const socketAuth = (socket, next) => {
  try {
    const { token: authToken } = socket.handshake.auth || {};
    const headerToken = socket.handshake.headers?.authorization?.startsWith('Bearer ')
      ? socket.handshake.headers.authorization.slice(7)
      : null;
    const queryToken = socket.handshake.query?.token || null;

    const token = authToken || headerToken || queryToken;

    if (!token) {
      return next(new Error('AUTH_TOKEN_MISSING'));
    }

    const payload = jwt.verify(token, env.jwtSecret);
    socket.user = {
      id: String(payload.sub),
      role: payload.role,
      name: payload.name || null,
      demo: !!payload.demo,
    };
    return next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'AUTH_TOKEN_EXPIRED' : 'AUTH_TOKEN_INVALID';
    logger.warn('Socket authentication failed', { code, socketId: socket.id });
    return next(new Error(code));
  }
};

module.exports = socketAuth;
