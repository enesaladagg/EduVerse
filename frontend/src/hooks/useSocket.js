import { useEffect, useRef, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { SOCKET_EVENTS as E } from '../services/socketEvents';

export function useSocket(roomId, {
  token,
  displayName,
  autoJoin = true,
} = {}) {
  const [connected, setConnected] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [self, setSelf] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const listenersRef = useRef([]);

  useEffect(() => {
    disconnectSocket();
    const socket = connectSocket(token);
    setSocketInstance(socket);

    const joinRoom = () => {
      if (autoJoin && roomId) {
        socket.emit(E.ROOM_JOIN, { roomId, displayName });
      }
    };

    const onConnect = () => {
      setConnected(true);
      setConnectError(null);
      joinRoom();
    };

    const onDisconnect = () => setConnected(false);

    const onConnectError = (err) => {
      setConnected(false);
      setConnectError(err?.message || 'Bağlantı hatası');
    };

    const onJoined = (data) => {
      if (data.roomId !== roomId) return;
      setSelf(data.self);
      setParticipants(data.participants || []);
    };

    const onParticipants = (data) => {
      if (data.roomId !== roomId) return;
      setParticipants(data.participants || []);
    };

    const onRoleChanged = (data) => {
      if (data.roomId !== roomId) return;
      setSelf((prev) => (prev && prev.userId === data.userId
        ? {
          ...prev,
          role: data.role,
          canPublishAudio: data.canPublishAudio,
          canPublishVideo: data.canPublishVideo,
          canShareScreen: data.canShareScreen,
        }
        : prev));
    };

    const onPresence = (data) => {
      if (data.roomId !== roomId) return;
      setParticipants((prev) => prev.map((p) => (
        p.userId === data.userId
          ? { ...p, mic: data.mic, cam: data.cam, hand: data.hand }
          : p
      )));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on(E.ROOM_JOINED, onJoined);
    socket.on(E.ROOM_PARTICIPANTS, onParticipants);
    socket.on(E.SEMINAR_ROLE_CHANGED, onRoleChanged);
    socket.on(E.PRESENCE_UPDATE, onPresence);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off(E.ROOM_JOINED, onJoined);
      socket.off(E.ROOM_PARTICIPANTS, onParticipants);
      socket.off(E.SEMINAR_ROLE_CHANGED, onRoleChanged);
      socket.off(E.PRESENCE_UPDATE, onPresence);
      if (roomId) socket.emit(E.ROOM_LEAVE, { roomId });
    };
  }, [roomId, token, displayName, autoJoin]);

  const emit = useCallback((event, payload) => {
    const socket = getSocket();
    socket.emit(event, payload);
  }, []);

  const on = useCallback((event, handler) => {
    const socket = getSocket();
    socket.on(event, handler);
    listenersRef.current.push([event, handler]);
    return () => socket.off(event, handler);
  }, []);

  useEffect(() => () => {
    const socket = getSocket();
    listenersRef.current.forEach(([event, handler]) => socket.off(event, handler));
    listenersRef.current = [];
  }, []);

  return {
    socket: socketInstance,
    connected,
    connectError,
    self,
    participants,
    emit,
    on,
  };
}

export default useSocket;
