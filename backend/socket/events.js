/**
 * Merkezi Socket.io olay adı sabitleri.
 * İstemci ve sunucu aynı adları kullanmalı; yazım hatalarını önlemek için
 * tüm event isimleri tek yerden yönetilir.
 */
module.exports = Object.freeze({
  // Bağlantı / oda yaşam döngüsü
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_JOINED: 'room:joined',
  ROOM_PARTICIPANTS: 'room:participants',
  ROOM_PEER_JOINED: 'room:peer-joined',
  ROOM_PEER_LEFT: 'room:peer-left',
  ROOM_ERROR: 'room:error',

  // Beyaz tahta (gerçek zamanlı çizim)
  WB_DRAW: 'whiteboard:draw',
  WB_DRAW_BATCH: 'whiteboard:draw-batch',
  WB_SHAPE: 'whiteboard:shape',
  WB_CLEAR: 'whiteboard:clear',
  WB_UNDO: 'whiteboard:undo',
  WB_SNAPSHOT_REQUEST: 'whiteboard:snapshot-request',
  WB_SNAPSHOT_SYNC: 'whiteboard:snapshot-sync',

  // Code Sandbox (öğrenci kodunu eğitmene düşürme)
  CODE_UPDATE: 'code:update',
  CODE_SUBMIT: 'code:submit',
  CODE_RECEIVED: 'code:received',
  CODE_RUN_RESULT: 'code:run-result',
  CODE_FEEDBACK: 'code:feedback',

  // WebRTC sinyalleşme
  RTC_OFFER: 'rtc:offer',
  RTC_ANSWER: 'rtc:answer',
  RTC_ICE_CANDIDATE: 'rtc:ice-candidate',
  RTC_RENEGOTIATE: 'rtc:renegotiate',
  RTC_PEER_DISCONNECTED: 'rtc:peer-disconnected',

  // Seminer / Guest Speaker yönetimi
  SEMINAR_PROMOTE: 'seminar:promote',        // host -> bir katılımcıyı konuşmacı yapar
  SEMINAR_DEMOTE: 'seminar:demote',          // host -> konuşmacıyı izleyiciye indirir
  SEMINAR_REQUEST_STAGE: 'seminar:request-stage', // attendee sahne ister
  SEMINAR_ROLE_CHANGED: 'seminar:role-changed',
  SEMINAR_STAGE_REQUESTED: 'seminar:stage-requested',
  SEMINAR_PERMISSION_DENIED: 'seminar:permission-denied',

  // Dayanıklılık / yeniden bağlanma
  CONN_HEARTBEAT: 'conn:heartbeat',
  CONN_RESYNC: 'conn:resync',

  // Canlı ders sohbet
  CHAT_MESSAGE: 'chat:message',
  CHAT_HISTORY: 'chat:history',

  // Canlı anket
  POLL_CREATE: 'poll:create',
  POLL_VOTE: 'poll:vote',
  POLL_UPDATE: 'poll:update',
  POLL_END: 'poll:end',

  // Katılımcı durumu (mikrofon/kamera/el)
  PRESENCE_UPDATE: 'presence:update',
});
