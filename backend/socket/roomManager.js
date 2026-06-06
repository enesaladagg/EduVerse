/**
 * Bellek-içi (in-memory) oda durum yöneticisi.
 *
 * Her oda için katılımcıları, rollerini, aktif konuşmacıyı ve son beyaz tahta
 * snapshot'ını tutar. Yeniden bağlanan istemcilerin (reconnect) state'i
 * kaybetmemesi için katılımcı verisi userId bazlı tutulur; socketId güncellenir.
 *
 * Not: Tek sunucu örneği için uygundur. Yatay ölçeklemede Redis adapter
 * (socket.io-redis) ile değiştirilebilir — projeakisi.md'de belirtilmiştir.
 */

class RoomManager {
  constructor() {
    /** @type {Map<string, RoomState>} */
    this.rooms = new Map();
  }

  _ensureRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        roomId,
        sessionType: 'lecture',
        hostId: null,
        // userId -> participant
        participants: new Map(),
        activeSpeakerId: null,
        whiteboardSnapshot: null,
        // Geçmiş çizim operasyonları (geç katılan için tekrar oynatma — sınırlı)
        whiteboardOps: [],
        chatMessages: [],
        poll: null,
      });
    }
    return this.rooms.get(roomId);
  }

  configureRoom(roomId, { sessionType, hostId, guestSpeakerIds = [] } = {}) {
    const room = this._ensureRoom(roomId);
    if (sessionType) room.sessionType = sessionType;
    if (hostId) room.hostId = String(hostId);
    room.guestSpeakerIds = new Set(guestSpeakerIds.map(String));
    return room;
  }

  /**
   * Katılımcı ekler veya (reconnect durumunda) socketId'sini günceller.
   * Aynı userId zaten varsa rolü ve yayın izinleri korunur.
   */
  addParticipant(roomId, { userId, socketId, role, displayName }) {
    const room = this._ensureRoom(roomId);
    const uid = String(userId);
    const existing = room.participants.get(uid);

    if (existing) {
      existing.socketId = socketId;
      existing.connected = true;
      existing.lastSeen = Date.now();
      if (displayName) existing.displayName = displayName;
      return existing;
    }

    const resolvedRole = role || this._defaultRole(room, uid);
    const canPublish = this._canPublish(room, uid, resolvedRole);

    const participant = {
      userId: uid,
      socketId,
      displayName: displayName || `Katılımcı ${uid.slice(-4)}`,
      role: resolvedRole,
      canPublishAudio: canPublish,
      canPublishVideo: canPublish,
      canShareScreen: canPublish,
      mic: true,
      cam: true,
      hand: false,
      connected: true,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
    };
    room.participants.set(uid, participant);
    return participant;
  }

  _defaultRole(room, uid) {
    if (room.hostId === uid) return 'host';
    if (room.guestSpeakerIds?.has(uid)) return 'guest_speaker';
    return 'attendee';
  }

  _canPublish(room, uid, role) {
    if (room.sessionType !== 'seminar') return true;
    return role === 'host' || role === 'guest_speaker';
  }

  /** socketId ile katılımcı bulur (disconnect anında userId bilinmeyebilir). */
  findBySocketId(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    for (const p of room.participants.values()) {
      if (p.socketId === socketId) return p;
    }
    return null;
  }

  getParticipant(roomId, userId) {
    const room = this.rooms.get(roomId);
    return room ? room.participants.get(String(userId)) : null;
  }

  /**
   * Bağlantı koptuğunda katılımcıyı hemen silmek yerine "disconnected"
   * işaretler — kısa süreli reconnect için state korunur.
   */
  markDisconnected(roomId, socketId) {
    const participant = this.findBySocketId(roomId, socketId);
    if (participant) {
      participant.connected = false;
      participant.lastSeen = Date.now();
    }
    return participant;
  }

  removeParticipant(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.participants.delete(String(userId));
    if (room.activeSpeakerId === String(userId)) {
      room.activeSpeakerId = null;
    }
    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  listParticipants(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.participants.values()).map((p) => ({
      userId: p.userId,
      displayName: p.displayName,
      role: p.role,
      socketId: p.socketId,
      connected: p.connected,
      canPublishAudio: p.canPublishAudio,
      canPublishVideo: p.canPublishVideo,
      canShareScreen: p.canShareScreen,
      mic: p.mic,
      cam: p.cam,
      hand: p.hand,
    }));
  }

  updatePresence(roomId, userId, { mic, cam, hand } = {}) {
    const p = this.getParticipant(roomId, userId);
    if (!p) return null;
    if (typeof mic === 'boolean') p.mic = mic;
    if (typeof cam === 'boolean') p.cam = cam;
    if (typeof hand === 'boolean') p.hand = hand;
    p.lastSeen = Date.now();
    return p;
  }

  addChatMessage(roomId, message) {
    const room = this._ensureRoom(roomId);
    room.chatMessages.push(message);
    if (room.chatMessages.length > 200) room.chatMessages.shift();
    return message;
  }

  getChatHistory(roomId) {
    const room = this.rooms.get(roomId);
    return room ? [...room.chatMessages] : [];
  }

  createPoll(roomId, { question, options, createdBy }) {
    const room = this._ensureRoom(roomId);
    room.poll = {
      active: true,
      question,
      options: options.map((label, index) => ({
        index,
        label,
        votes: 0,
      })),
      voters: new Map(),
      totalVotes: 0,
      createdBy,
      createdAt: Date.now(),
    };
    return this.serializePoll(room.poll);
  }

  votePoll(roomId, userId, optionIndex) {
    const room = this.rooms.get(roomId);
    if (!room?.poll?.active) return null;
    const uid = String(userId);
    const prev = room.poll.voters.get(uid);
    if (prev != null && room.poll.options[prev]) {
      room.poll.options[prev].votes = Math.max(0, room.poll.options[prev].votes - 1);
      room.poll.totalVotes = Math.max(0, room.poll.totalVotes - 1);
    }
    const opt = room.poll.options[optionIndex];
    if (!opt) return null;
    opt.votes += 1;
    room.poll.totalVotes += 1;
    room.poll.voters.set(uid, optionIndex);
    return this.serializePoll(room.poll);
  }

  endPoll(roomId) {
    const room = this.rooms.get(roomId);
    if (!room?.poll) return null;
    room.poll.active = false;
    return this.serializePoll(room.poll);
  }

  getPoll(roomId) {
    const room = this.rooms.get(roomId);
    return room?.poll ? this.serializePoll(room.poll) : null;
  }

  serializePoll(poll) {
    if (!poll) return null;
    return {
      active: poll.active,
      question: poll.question,
      options: poll.options.map((o) => ({ index: o.index, label: o.label, votes: o.votes })),
      totalVotes: poll.totalVotes,
      createdAt: poll.createdAt,
    };
  }

  /** Seminer modunda yayın izni kontrolü. */
  canPublish(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    if (room.sessionType !== 'seminar') return true;
    const p = room.participants.get(String(userId));
    return !!(p && (p.role === 'host' || p.role === 'guest_speaker'));
  }

  isHost(roomId, userId) {
    const room = this.rooms.get(roomId);
    return !!room && room.hostId === String(userId);
  }

  /** host bir katılımcıyı guest_speaker yapar / geri indirir. */
  setRole(roomId, targetUserId, role) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const p = room.participants.get(String(targetUserId));
    if (!p) return null;
    p.role = role;
    const canPublish = role === 'host' || role === 'guest_speaker';
    p.canPublishAudio = canPublish;
    p.canPublishVideo = canPublish;
    p.canShareScreen = canPublish;
    if (role === 'guest_speaker') {
      room.guestSpeakerIds = room.guestSpeakerIds || new Set();
      room.guestSpeakerIds.add(String(targetUserId));
    } else {
      room.guestSpeakerIds?.delete(String(targetUserId));
    }
    return p;
  }

  setActiveSpeaker(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room) room.activeSpeakerId = userId ? String(userId) : null;
  }

  // --- Beyaz tahta state ---
  saveWhiteboardSnapshot(roomId, snapshot) {
    const room = this._ensureRoom(roomId);
    room.whiteboardSnapshot = snapshot;
    room.whiteboardOps = []; // snapshot sonrası op geçmişi sıfırlanır
  }

  getWhiteboardSnapshot(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.whiteboardSnapshot : null;
  }

  appendWhiteboardOp(roomId, op) {
    const room = this._ensureRoom(roomId);
    room.whiteboardOps.push(op);
    // Bellek koruması: en fazla 500 op tut
    if (room.whiteboardOps.length > 500) {
      room.whiteboardOps.shift();
    }
  }

  clearWhiteboard(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.whiteboardSnapshot = null;
      room.whiteboardOps = [];
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }
}

module.exports = new RoomManager();
