import { useState, useEffect, useCallback, useRef } from 'react';
import { ensureDemoSession } from '../services/demoAuth';
import { useSocket } from './useSocket';
import { useWebRTC } from './useWebRTC';
import { SOCKET_EVENTS as E } from '../services/socketEvents';
import { BackgroundProcessor } from '../utils/backgroundProcessor';

const ROOM_ID = 'react-101-live';
const DEFAULT_POLL = {
  active: true,
  question: "React'te global state için en çok hangisini tercih edersiniz?",
  options: [
    { index: 0, label: 'useState + Context', votes: 8 },
    { index: 1, label: 'useReducer', votes: 5 },
    { index: 2, label: 'Redux Toolkit', votes: 11 },
    { index: 3, label: 'Zustand', votes: 6 },
  ],
  totalVotes: 30,
};

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useLiveSession({ user, viewRole, onLeave }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [token, setToken] = useState(null);
  const [activeMode, setActiveMode] = useState('slide');
  const [messages, setMessages] = useState([]);
  const [poll, setPoll] = useState(DEFAULT_POLL);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);
  const [hand, setHand] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [bgRemoval, setBgRemoval] = useState(false);
  const [bgBlur, setBgBlur] = useState(false);
  const [aiNoise, setAiNoise] = useState(true);
  const [elapsed, setElapsed] = useState(2545);
  const [localStream, setLocalStream] = useState(null);
  const [processedStream, setProcessedStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [studentCode, setStudentCode] = useState(null);
  const processorRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const displayName = user?.name || 'Demo Kullanıcı';
  const apiRole = viewRole === 'teacher' ? 'teacher' : 'student';

  useEffect(() => {
    let cancelled = false;
    setSessionReady(false);
    setSessionError(null);

    const existingToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (existingToken && storedUser && !storedUser.demo) {
      setToken(existingToken);
      setSessionReady(true);
      return () => { cancelled = true; };
    }

    ensureDemoSession({ name: displayName, role: apiRole })
      .then((data) => {
        if (cancelled) return;
        setToken(data.token);
        setSessionReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setSessionError(err.message);
      });

    return () => { cancelled = true; };
  }, [displayName, apiRole]);

  const {
    socket, connected, connectError, self, participants, emit, on,
  } = useSocket(ROOM_ID, {
    token,
    displayName,
    autoJoin: sessionReady,
  });

  const canPublish = self?.canPublishAudio !== false;
  const publishStream = processedStream || localStream;

  const { remoteStreams } = useWebRTC({
    socket,
    roomId: ROOM_ID,
    localStream: canPublish ? publishStream : null,
    canPublish: canPublish && (mic || cam),
  });

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!sessionReady) return undefined;

    let stream;
    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch {
        setLocalStream(null);
      }
    };
    startMedia();

    return () => {
      stream?.getTracks().forEach((tr) => tr.stop());
      screenStream?.getTracks().forEach((tr) => tr.stop());
      processorRef.current?.stop();
    };
  }, [sessionReady, screenStream]);

  useEffect(() => {
    if (!localStream) {
      setProcessedStream(null);
      return undefined;
    }

    const mode = bgRemoval ? 'remove' : bgBlur ? 'blur' : 'none';
    if (mode === 'none') {
      processorRef.current?.stop();
      processorRef.current = null;
      setProcessedStream(localStream);
      return undefined;
    }

    let cancelled = false;
    const processor = new BackgroundProcessor({ mode, blurAmount: 14 });
    processor.start(localStream).then((stream) => {
      if (cancelled) {
        processor.stop();
        return;
      }
      processorRef.current = processor;
      setProcessedStream(stream);
    });

    return () => {
      cancelled = true;
      processor.stop();
    };
  }, [localStream, bgRemoval, bgBlur]);

  useEffect(() => {
    localStream?.getAudioTracks().forEach((tr) => { tr.enabled = mic; });
  }, [localStream, mic]);

  useEffect(() => {
    localStream?.getVideoTracks().forEach((tr) => { tr.enabled = cam; });
  }, [localStream, cam]);

  const syncPresence = useCallback((next) => {
    emit(E.PRESENCE_UPDATE, { roomId: ROOM_ID, ...next });
  }, [emit]);

  useEffect(() => {
    if (connected) syncPresence({ mic, cam, hand });
  }, [connected, mic, cam, hand, syncPresence]);

  useEffect(() => {
    if (!socket) return;

    const onChat = ({ message }) => {
      if (message) setMessages((prev) => [...prev, message]);
    };
    const onHistory = ({ messages: history }) => {
      if (Array.isArray(history)) setMessages(history);
    };
    const onPollUpdate = ({ poll: nextPoll }) => {
      if (nextPoll) setPoll(nextPoll);
    };
    const onCodeUpdate = (payload) => {
      setStudentCode(payload);
    };
    const onCodeSubmit = (payload) => {
      setStudentCode({ ...payload, submitted: true });
    };

    socket.on(E.CHAT_MESSAGE, onChat);
    socket.on(E.CHAT_HISTORY, onHistory);
    socket.on(E.POLL_UPDATE, onPollUpdate);
    socket.on(E.CODE_UPDATE, onCodeUpdate);
    socket.on(E.CODE_SUBMIT, onCodeSubmit);

    return () => {
      socket.off(E.CHAT_MESSAGE, onChat);
      socket.off(E.CHAT_HISTORY, onHistory);
      socket.off(E.POLL_UPDATE, onPollUpdate);
      socket.off(E.CODE_UPDATE, onCodeUpdate);
      socket.off(E.CODE_SUBMIT, onCodeSubmit);
    };
  }, [socket]);

  const sendMessage = useCallback((text) => {
    emit(E.CHAT_MESSAGE, { roomId: ROOM_ID, text });
  }, [emit]);

  const votePoll = useCallback((optionIndex) => {
    emit(E.POLL_VOTE, { roomId: ROOM_ID, optionIndex });
  }, [emit]);

  const endPoll = useCallback(() => {
    emit(E.POLL_END, { roomId: ROOM_ID });
  }, [emit]);

  const createPoll = useCallback((question, options) => {
    emit(E.POLL_CREATE, { roomId: ROOM_ID, question, options });
  }, [emit]);

  const toggleMic = useCallback(() => setMic((v) => !v), []);
  const toggleCam = useCallback(() => setCam((v) => !v), []);
  const toggleHand = useCallback(() => setHand((v) => !v), []);
  const toggleAiPanel = useCallback(() => setShowAiPanel((v) => !v), []);

  const toggleRecord = useCallback(() => {
    if (recording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setRecording(false);
    } else {
      const streamToRecord = screenStream || localStream;
      if (!streamToRecord) {
         alert("Kaydedilecek bir akış bulunamadı. Lütfen önce ekran paylaşımını veya kameranızı açın.");
         return;
      }
      try {
        recordedChunksRef.current = [];
        let options = { mimeType: 'video/webm; codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
        }
        const mediaRecorder = new MediaRecorder(streamToRecord, options);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `ders_kayit_${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
          recordedChunksRef.current = [];
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
      } catch (e) {
        console.error("Kayıt başlatılamadı:", e);
        alert("Tarayıcınız video kaydını desteklemiyor olabilir.");
      }
    }
  }, [recording, screenStream, localStream]);

  const toggleScreen = useCallback(async () => {
    if (screen) {
      screenStream?.getTracks().forEach((tr) => tr.stop());
      setScreenStream(null);
      setScreen(false);
      return;
    }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(displayStream);
      setScreen(true);
      setActiveMode('slide');
      displayStream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setScreen(false);
      };
    } catch {
      setScreen(false);
    }
  }, [screen, screenStream]);

  const handleModeChange = useCallback((mode) => {
    if (['slide', 'whiteboard', 'sandbox', 'video'].includes(mode)) {
      setActiveMode(mode);
    }
  }, []);

  const handleDockAction = useCallback((id) => {
    switch (id) {
      case 'mic': toggleMic(); break;
      case 'cam': toggleCam(); break;
      case 'share': toggleScreen(); break;
      case 'whiteboard': setActiveMode(prev => prev === 'whiteboard' ? 'video' : 'whiteboard'); break;
      case 'sandbox': setActiveMode(prev => prev === 'sandbox' ? 'video' : 'sandbox'); break;
      case 'slide': setActiveMode(prev => prev === 'slide' ? 'video' : 'slide'); break;
      case 'reactions': toggleHand(); break;
      case 'record': toggleRecord(); break;
      case 'ai': toggleAiPanel(); break;
      default: break;
    }
  }, [toggleMic, toggleCam, toggleScreen, toggleHand, toggleRecord, toggleAiPanel]);

  const endSession = useCallback(() => {
    emit(E.ROOM_LEAVE, { roomId: ROOM_ID });
    onLeave?.();
  }, [emit, onLeave]);

  return {
    roomId: ROOM_ID,
    sessionReady,
    sessionError,
    connected,
    connectError,
    self,
    participants,
    messages,
    poll,
    activeMode,
    mic,
    cam,
    screen,
    hand,
    recording,
    showAiPanel,
    bgRemoval,
    bgBlur,
    aiNoise,
    setBgRemoval,
    setBgBlur,
    setAiNoise,
    elapsed,
    timerLabel: formatTimer(elapsed || 2545),
    localStream: publishStream,
    remoteStreams,
    screenStream,
    studentCode,
    sendMessage,
    votePoll,
    endPoll,
    createPoll,
    handleModeChange,
    handleDockAction,
    endSession,
    isHost: self?.role === 'host',
  };
}

export default useLiveSession;
