/**
 * Backend `backend/socket/events.js` ile birebir eşleşen olay adları.
 * İki taraf da aynı sabitleri kullanır.
 */
export const SOCKET_EVENTS = Object.freeze({
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_JOINED: 'room:joined',
  ROOM_PARTICIPANTS: 'room:participants',
  ROOM_PEER_JOINED: 'room:peer-joined',
  ROOM_PEER_LEFT: 'room:peer-left',
  ROOM_ERROR: 'room:error',

  WB_DRAW: 'whiteboard:draw',
  WB_DRAW_BATCH: 'whiteboard:draw-batch',
  WB_SHAPE: 'whiteboard:shape',
  WB_CLEAR: 'whiteboard:clear',
  WB_UNDO: 'whiteboard:undo',
  WB_SNAPSHOT_REQUEST: 'whiteboard:snapshot-request',
  WB_SNAPSHOT_SYNC: 'whiteboard:snapshot-sync',

  CODE_UPDATE: 'code:update',
  CODE_SUBMIT: 'code:submit',
  CODE_RECEIVED: 'code:received',
  CODE_RUN_RESULT: 'code:run-result',
  CODE_FEEDBACK: 'code:feedback',

  RTC_OFFER: 'rtc:offer',
  RTC_ANSWER: 'rtc:answer',
  RTC_ICE_CANDIDATE: 'rtc:ice-candidate',
  RTC_RENEGOTIATE: 'rtc:renegotiate',
  RTC_PEER_DISCONNECTED: 'rtc:peer-disconnected',

  SEMINAR_PROMOTE: 'seminar:promote',
  SEMINAR_DEMOTE: 'seminar:demote',
  SEMINAR_REQUEST_STAGE: 'seminar:request-stage',
  SEMINAR_ROLE_CHANGED: 'seminar:role-changed',
  SEMINAR_STAGE_REQUESTED: 'seminar:stage-requested',
  SEMINAR_PERMISSION_DENIED: 'seminar:permission-denied',

  CONN_HEARTBEAT: 'conn:heartbeat',
  CONN_RESYNC: 'conn:resync',

  CHAT_MESSAGE: 'chat:message',
  CHAT_HISTORY: 'chat:history',

  POLL_CREATE: 'poll:create',
  POLL_VOTE: 'poll:vote',
  POLL_UPDATE: 'poll:update',
  POLL_END: 'poll:end',

  PRESENCE_UPDATE: 'presence:update',
});
