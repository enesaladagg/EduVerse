import { useEffect, useRef, useState, useCallback } from 'react';
import { SOCKET_EVENTS as E } from '../services/socketEvents';

/**
 * Dayanıklı (resilient) WebRTC mesh bağlantı yöneticisi.
 *
 * Her uzak peer için bir RTCPeerConnection tutar. Sinyalleşme (offer/answer/ice)
 * verilen socket üzerinden yapılır. Kopmalara karşı:
 *   - ICE bağlantısı 'disconnected'/'failed' olduğunda ICE restart ile renegotiate.
 *   - Peer disconnect bildiriminde ilgili bağlantı temizlenir.
 *   - "Polite peer" deseni ile offer çakışması (glare) güvenli çözülür.
 *
 * @param {object} params
 * @param {import('socket.io-client').Socket} params.socket
 * @param {string} params.roomId
 * @param {MediaStream|null} params.localStream - Yayınlanacak yerel akış (yoksa yalnızca izleyici)
 * @param {boolean} params.canPublish - Seminer modunda yayın yetkisi
 */
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useWebRTC({ socket, roomId, localStream, canPublish = true }) {
  const [remoteStreams, setRemoteStreams] = useState({}); // socketId -> MediaStream
  const peersRef = useRef(new Map());      // socketId -> RTCPeerConnection
  const politeRef = useRef(new Map());     // socketId -> boolean
  const makingOfferRef = useRef(new Map());

  const cleanupPeer = useCallback((socketId) => {
    const pc = peersRef.current.get(socketId);
    if (pc) {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.oniceconnectionstatechange = null;
      pc.close();
      peersRef.current.delete(socketId);
    }
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[socketId];
      return next;
    });
  }, []);

  const createPeer = useCallback((remoteSocketId, polite) => {
    if (peersRef.current.has(remoteSocketId)) {
      return peersRef.current.get(remoteSocketId);
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    politeRef.current.set(remoteSocketId, polite);
    makingOfferRef.current.set(remoteSocketId, false);

    // Yerel yayın akışını ekle (yayın yetkisi varsa)
    if (localStream && canPublish) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStreams((prev) => ({ ...prev, [remoteSocketId]: stream }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit(E.RTC_ICE_CANDIDATE, {
          roomId,
          targetSocketId: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    // Dayanıklılık: ICE koparsa restart ile yeniden müzakere
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        try {
          pc.restartIce?.();
          socket.emit(E.RTC_RENEGOTIATE, {
            roomId,
            targetSocketId: remoteSocketId,
            iceRestart: true,
          });
        } catch {
          cleanupPeer(remoteSocketId);
        }
      }
    };

    // Negotiation gerektiğinde offer üret (perfect negotiation deseni)
    pc.onnegotiationneeded = async () => {
      try {
        makingOfferRef.current.set(remoteSocketId, true);
        await pc.setLocalDescription();
        socket.emit(E.RTC_OFFER, {
          roomId,
          targetSocketId: remoteSocketId,
          sdp: pc.localDescription,
        });
      } catch {
        /* offer üretilemezse bir sonraki tetiklemede tekrar denenir */
      } finally {
        makingOfferRef.current.set(remoteSocketId, false);
      }
    };

    peersRef.current.set(remoteSocketId, pc);
    return pc;
  }, [socket, roomId, localStream, canPublish, cleanupPeer]);

  useEffect(() => {
    if (!socket || !roomId) return undefined;

    // Yeni peer katıldı → bağlantı kur. Daha küçük socketId "impolite" başlatır.
    const onPeerJoined = ({ socketId }) => {
      if (!socketId || socketId === socket.id) return;
      const polite = socket.id < socketId;
      createPeer(socketId, polite);
    };

    const onOffer = async ({ fromSocketId, sdp }) => {
      const polite = socket.id < fromSocketId;
      const pc = createPeer(fromSocketId, polite);

      const makingOffer = makingOfferRef.current.get(fromSocketId);
      const offerCollision = makingOffer || pc.signalingState !== 'stable';

      // Glare çözümü: impolite taraf çakışan offer'ı yok sayar
      if (offerCollision && !polite) return;

      await pc.setRemoteDescription(sdp);
      await pc.setLocalDescription();
      socket.emit(E.RTC_ANSWER, {
        roomId,
        targetSocketId: fromSocketId,
        sdp: pc.localDescription,
      });
    };

    const onAnswer = async ({ fromSocketId, sdp }) => {
      const pc = peersRef.current.get(fromSocketId);
      if (pc && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(sdp);
      } else if (pc) {
        try { await pc.setRemoteDescription(sdp); } catch { /* yoksay */ }
      }
    };

    const onIce = async ({ fromSocketId, candidate }) => {
      const pc = peersRef.current.get(fromSocketId);
      if (pc && candidate) {
        try { await pc.addIceCandidate(candidate); } catch { /* aday düşebilir */ }
      }
    };

    const onRenegotiate = async ({ fromSocketId, iceRestart }) => {
      const pc = peersRef.current.get(fromSocketId);
      if (!pc) return;
      try {
        await pc.setLocalDescription(await pc.createOffer({ iceRestart: !!iceRestart }));
        socket.emit(E.RTC_OFFER, {
          roomId,
          targetSocketId: fromSocketId,
          sdp: pc.localDescription,
        });
      } catch { /* sonraki denemede tekrar */ }
    };

    const onPeerGone = ({ socketId }) => {
      if (socketId) cleanupPeer(socketId);
    };

    socket.on(E.ROOM_PEER_JOINED, onPeerJoined);
    socket.on(E.RTC_OFFER, onOffer);
    socket.on(E.RTC_ANSWER, onAnswer);
    socket.on(E.RTC_ICE_CANDIDATE, onIce);
    socket.on(E.RTC_RENEGOTIATE, onRenegotiate);
    socket.on(E.RTC_PEER_DISCONNECTED, onPeerGone);
    socket.on(E.ROOM_PEER_LEFT, onPeerGone);

    return () => {
      socket.off(E.ROOM_PEER_JOINED, onPeerJoined);
      socket.off(E.RTC_OFFER, onOffer);
      socket.off(E.RTC_ANSWER, onAnswer);
      socket.off(E.RTC_ICE_CANDIDATE, onIce);
      socket.off(E.RTC_RENEGOTIATE, onRenegotiate);
      socket.off(E.RTC_PEER_DISCONNECTED, onPeerGone);
      socket.off(E.ROOM_PEER_LEFT, onPeerGone);
      // Tüm peer bağlantılarını kapat (bellek sızıntısı önleme)
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, [socket, roomId, createPeer, cleanupPeer]);

  return { remoteStreams };
}

export default useWebRTC;
