import { io } from 'socket.io-client';

/**
 * Tekil (singleton) Socket.io istemcisi.
 *
 * Dayanıklılık ayarları:
 *   - reconnection: otomatik yeniden bağlanma
 *   - reconnectionAttempts: sonsuz deneme (0 = sınırsız)
 *   - exponential backoff: 1s → 5s arası artan gecikme
 *   - JWT token handshake.auth ile gönderilir; logout/yeni login'de güncellenir.
 *
 * Kullanım:
 *   import { getSocket, connectSocket, disconnectSocket } from './services/socket';
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

function createSocket(token) {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });
}

/**
 * Soketi verilen token ile bağlar. Zaten bağlıysa mevcut örneği döndürür.
 */
export function connectSocket(token) {
  const authToken = token || localStorage.getItem('token');
  if (socket && socket.connected) return socket;

  if (socket) {
    // Token değişmiş olabilir — auth güncelle ve yeniden bağlan
    socket.auth = { token: authToken };
    socket.connect();
    return socket;
  }

  socket = createSocket(authToken);
  return socket;
}

/** Mevcut socket örneğini döndürür (yoksa bağlanmadan oluşturur). */
export function getSocket() {
  if (!socket) {
    socket = createSocket(localStorage.getItem('token'));
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export { SOCKET_URL };
