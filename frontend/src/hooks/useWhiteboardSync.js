import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../services/socket';
import { SOCKET_EVENTS as E } from '../services/socketEvents';

/**
 * Beyaz tahta gerçek zamanlı senkronizasyon hook'u.
 *
 * `roomId` verilmezse hiçbir şey yapmaz (tek kullanıcı / offline mod) —
 * böylece bileşen sokete bağımlı olmadan da çalışır (mevcut davranış korunur).
 *
 * @param {object} params
 * @param {string|null} params.roomId
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef
 * @param {Function} [params.onRemoteSnapshot] - (dataURL) => void
 *
 * @returns {{ emitSegment, emitShape, emitClear, syncSnapshot, enabled }}
 */
export function useWhiteboardSync({ roomId, canvasRef, onRemoteSnapshot }) {
  const enabled = !!roomId;
  const socketRef = useRef(null);

  // Uzaktan gelen çizim parçasını yerel tuvale uygular
  const applyRemoteSegment = useCallback((seg) => {
    const canvas = canvasRef.current;
    if (!canvas || !seg) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    if (seg.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = seg.size * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = seg.size;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(seg.from.x, seg.from.y);
    ctx.lineTo(seg.to.x, seg.to.y);
    ctx.stroke();
    ctx.restore();
  }, [canvasRef]);

  const applyRemoteShape = useCallback((sh) => {
    const canvas = canvasRef.current;
    if (!canvas || !sh) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = sh.color;
    ctx.fillStyle = sh.color;
    ctx.lineWidth = sh.size;
    ctx.beginPath();
    const { from: s, to: p } = sh;
    if (sh.shape === 'line') {
      ctx.moveTo(s.x, s.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    } else if (sh.shape === 'rect') {
      ctx.strokeRect(s.x, s.y, p.x - s.x, p.y - s.y);
    } else if (sh.shape === 'circle') {
      const rx = Math.abs(p.x - s.x) / 2;
      const ry = Math.abs(p.y - s.y) / 2;
      ctx.ellipse(s.x + (p.x - s.x) / 2, s.y + (p.y - s.y) / 2, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (sh.shape === 'text' && sh.text) {
      ctx.font = sh.font || '24px sans-serif';
      ctx.fillText(sh.text, s.x, s.y);
    }
    ctx.restore();
  }, [canvasRef]);

  useEffect(() => {
    if (!enabled) return undefined;
    const socket = getSocket();
    socketRef.current = socket;

    const onDraw = (seg) => applyRemoteSegment(seg);
    const onShape = (sh) => applyRemoteShape(sh);
    const onClear = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    const onSnapshot = ({ snapshot } = {}) => {
      if (snapshot && onRemoteSnapshot) onRemoteSnapshot(snapshot);
    };

    socket.on(E.WB_DRAW, onDraw);
    socket.on(E.WB_SHAPE, onShape);
    socket.on(E.WB_CLEAR, onClear);
    socket.on(E.WB_SNAPSHOT_SYNC, onSnapshot);

    // Geç katılan: güncel tahtayı iste
    socket.emit(E.WB_SNAPSHOT_REQUEST, { roomId });

    return () => {
      socket.off(E.WB_DRAW, onDraw);
      socket.off(E.WB_SHAPE, onShape);
      socket.off(E.WB_CLEAR, onClear);
      socket.off(E.WB_SNAPSHOT_SYNC, onSnapshot);
    };
  }, [enabled, roomId, applyRemoteSegment, applyRemoteShape, onRemoteSnapshot, canvasRef]);

  const emitSegment = useCallback((seg) => {
    if (!enabled) return;
    socketRef.current?.emit(E.WB_DRAW, { roomId, ...seg });
  }, [enabled, roomId]);

  const emitShape = useCallback((sh) => {
    if (!enabled) return;
    socketRef.current?.emit(E.WB_SHAPE, { roomId, ...sh });
  }, [enabled, roomId]);

  const emitClear = useCallback(() => {
    if (!enabled) return;
    socketRef.current?.emit(E.WB_CLEAR, { roomId });
  }, [enabled, roomId]);

  // Periyodik tam snapshot yayını (geç katılanlar için)
  const syncSnapshot = useCallback(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    socketRef.current?.emit(E.WB_SNAPSHOT_SYNC, {
      roomId,
      snapshot: canvas.toDataURL('image/webp', 0.6),
    });
  }, [enabled, roomId, canvasRef]);

  return { emitSegment, emitShape, emitClear, syncSnapshot, enabled };
}

export default useWhiteboardSync;
