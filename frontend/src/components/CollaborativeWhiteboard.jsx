import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { designTokens as t } from '../design-system/tokens';
import { useWhiteboardSync } from '../hooks/useWhiteboardSync';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TOOLS = [
  { id: 'pen',      icon: '✏️', label: 'Kalem'   },
  { id: 'line',     icon: '╱',  label: 'Çizgi'   },
  { id: 'rect',     icon: '▭',  label: 'Dikdörtgen' },
  { id: 'circle',   icon: '○',  label: 'Daire'   },
  { id: 'text',     icon: 'T',  label: 'Metin'   },
  { id: 'eraser',   icon: '⌫',  label: 'Silgi'   },
];

const PALETTE = [
  '#1a1a1a', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ffffff',
];

const SIZES = [2, 4, 8, 14];

// ---------------------------------------------------------------------------
// Helper: get pointer position relative to canvas
// ---------------------------------------------------------------------------
function getPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------
const ToolBtn = memo(function ToolBtn({ tool, active, onClick }) {
  return (
    <button
      title={tool.label}
      onClick={() => onClick(tool.id)}
      style={{
        width: '36px', height: '36px',
        borderRadius: t.borderRadius.md,
        border: active
          ? `2px solid ${t.colors.primary[500]}`
          : `1px solid ${t.colors.border.light}`,
        background: active ? t.colors.primary[50] : t.colors.background.primary,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px',
        fontWeight: t.typography.fontWeight.bold,
        color: active ? t.colors.primary[700] : t.colors.text.secondary,
        transition: t.transitions.fast,
        flexShrink: 0,
      }}
    >
      {tool.icon}
    </button>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
function CollaborativeWhiteboard({ className = '', sessionLabel = 'Canlı Tahta', roomId = null }) {
  const canvasRef  = useRef(null);
  const overlayRef = useRef(null); // temp overlay for shape preview

  const [tool, setTool]         = useState('pen');
  const [color, setColor]       = useState('#1a1a1a');
  const [size, setSize]         = useState(4);
  const [bgColor, setBgColor]   = useState('#ffffff');
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos]   = useState(null);
  const [history, setHistory]   = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [connCount]             = useState(3); // simulated participant count

  const startPt = useRef(null);
  const lastPt = useRef(null); // pen/eraser için önceki nokta (segment yayını)

  // Uzak snapshot'ı tuvale uygulayan yardımcı
  const applySnapshot = useCallback((dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas || !dataUrl) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = dataUrl;
  }, []);

  // Gerçek zamanlı senkronizasyon (roomId verilmezse pasif kalır)
  const { emitSegment, emitShape, emitClear, syncSnapshot, enabled: syncEnabled } =
    useWhiteboardSync({ roomId, canvasRef, onRemoteSnapshot: applySnapshot });

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw background color when it changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    // re-apply last history snapshot
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = history[history.length - 1];
  }, [bgColor, history]);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snap = canvas.toDataURL();
    setHistory((h) => [...h.slice(-30), snap]);
    setRedoStack([]);
  }, []);

  const restoreSnapshot = useCallback((snap) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = snap;
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length < 2) return h;
      const prev = h[h.length - 2];
      restoreSnapshot(prev);
      setRedoStack((r) => [...r, h[h.length - 1]]);
      return h.slice(0, -1);
    });
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[r.length - 1];
      restoreSnapshot(next);
      setHistory((h) => [...h, next]);
      return r.slice(0, -1);
    });
  }, [restoreSnapshot]);

  const clearBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
    if (syncEnabled) emitClear();
  }, [bgColor, saveSnapshot, syncEnabled, emitClear]);

  // --- pointer handlers ---

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(canvas, e);

    if (tool === 'text') {
      setTextPos(pos);
      setTextInput('');
      return;
    }

    setIsDrawing(true);
    startPt.current = pos;
    lastPt.current = pos;

    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, [tool]);

  const onPointerMove = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(canvas, e);
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      // Çizim parçasını odaya yayınla
      if (syncEnabled && lastPt.current) {
        emitSegment({ from: lastPt.current, to: pos, color, size, tool: 'pen' });
      }
      lastPt.current = pos;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 4;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      if (syncEnabled && lastPt.current) {
        emitSegment({ from: lastPt.current, to: pos, color, size, tool: 'eraser' });
      }
      lastPt.current = pos;
    } else {
      // Shape preview on overlay
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.width = canvas.width;
      overlay.height = canvas.height;
      const octx = overlay.getContext('2d');
      octx.clearRect(0, 0, overlay.width, overlay.height);
      octx.strokeStyle = color;
      octx.lineWidth = size;
      const { x: sx, y: sy } = startPt.current;
      octx.beginPath();
      if (tool === 'line') {
        octx.moveTo(sx, sy);
        octx.lineTo(pos.x, pos.y);
      } else if (tool === 'rect') {
        octx.rect(sx, sy, pos.x - sx, pos.y - sy);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - sx) / 2;
        const ry = Math.abs(pos.y - sy) / 2;
        octx.ellipse(sx + (pos.x - sx) / 2, sy + (pos.y - sy) / 2, rx, ry, 0, 0, Math.PI * 2);
      }
      octx.stroke();
      lastPt.current = pos; // şekil yayını için son konumu sakla (dokunmatik güvenli)
    }
  }, [isDrawing, tool, color, size, syncEnabled, emitSegment]);

  const onPointerUp = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas) return;

    if (overlay && (tool === 'line' || tool === 'rect' || tool === 'circle')) {
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(overlay, 0, 0);
      const octx = overlay.getContext('2d');
      octx.clearRect(0, 0, overlay.width, overlay.height);
      // Tamamlanan şekli odaya yayınla (son bilinen konum — dokunmatik güvenli)
      if (syncEnabled && startPt.current && lastPt.current) {
        emitShape({ shape: tool, from: startPt.current, to: lastPt.current, color, size });
      }
    }

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    setIsDrawing(false);
    lastPt.current = null;
    saveSnapshot();
    // Periyodik tam senkron (geç katılanlar için)
    if (syncEnabled) syncSnapshot();
  }, [isDrawing, tool, saveSnapshot, syncEnabled, emitShape, color, size, syncSnapshot]);

  const commitText = useCallback(() => {
    if (!textInput.trim() || !textPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const font = `${size * 4 + 12}px ${t.typography.fontFamily.primary}`;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPos.x, textPos.y);
    if (syncEnabled) {
      emitShape({ shape: 'text', from: textPos, to: textPos, color, size, text: textInput, font });
    }
    setTextPos(null);
    setTextInput('');
    saveSnapshot();
  }, [textInput, textPos, color, size, saveSnapshot, syncEnabled, emitShape]);

  const canUndo = history.length > 1;
  const canRedo = redoStack.length > 0;

  const toolbarStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing[2],
    padding: `${t.spacing[2]} ${t.spacing[3]}`,
    background: t.colors.background.primary,
    borderBottom: `1px solid ${t.colors.border.light}`,
    flexWrap: 'wrap',
  }), []);

  return (
    <div
      className={`whiteboard-root ${className}`}
      style={{
        borderRadius: t.borderRadius.xl,
        border: `1px solid ${t.colors.border.light}`,
        overflow: 'hidden',
        background: t.colors.background.primary,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: t.shadows[2],
      }}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${t.spacing[2]} ${t.spacing[4]}`,
        background: t.colors.primary[700],
        color: '#fff',
        gap: t.spacing[3],
      }}>
        <span style={{ fontSize: '18px' }}>🖊️</span>
        <span style={{ fontWeight: t.typography.fontWeight.semibold, fontSize: t.typography.fontSize.base }}>
          {sessionLabel}
        </span>
        <span style={{
          marginLeft: 'auto',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: t.borderRadius.full,
          padding: `2px ${t.spacing[3]}`,
          fontSize: t.typography.fontSize.xs,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          {connCount} katılımcı
        </span>
      </div>

      {/* Toolbar */}
      <div style={toolbarStyle}>
        {/* Drawing tools */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {TOOLS.map((tl) => (
            <ToolBtn key={tl.id} tool={tl} active={tool === tl.id} onClick={setTool} />
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: t.colors.border.light, margin: `0 ${t.spacing[1]}` }} />

        {/* Color palette */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PALETTE.map((c) => (
            <button
              key={c}
              title={c}
              onClick={() => setColor(c)}
              style={{
                width: '22px', height: '22px',
                borderRadius: t.borderRadius.sm,
                background: c,
                border: color === c ? `3px solid ${t.colors.primary[500]}` : `2px solid ${t.colors.border.light}`,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: t.colors.border.light, margin: `0 ${t.spacing[1]}` }} />

        {/* Brush size */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {SIZES.map((s) => (
            <button
              key={s}
              title={`Boyut ${s}`}
              onClick={() => setSize(s)}
              style={{
                width: '30px', height: '30px',
                borderRadius: t.borderRadius.md,
                border: size === s
                  ? `2px solid ${t.colors.primary[500]}`
                  : `1px solid ${t.colors.border.light}`,
                background: size === s ? t.colors.primary[50] : t.colors.background.primary,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{
                width: `${s + 4}px`, height: `${s + 4}px`,
                borderRadius: '50%', background: color,
              }} />
            </button>
          ))}
        </div>

        <span style={{ flex: 1 }} />

        {/* Undo / Redo */}
        <button onClick={undo} disabled={!canUndo} title="Geri Al (Ctrl+Z)"
          style={{ ...iconBtnStyle, opacity: canUndo ? 1 : 0.4 }}>↩</button>
        <button onClick={redo} disabled={!canRedo} title="Yinele"
          style={{ ...iconBtnStyle, opacity: canRedo ? 1 : 0.4 }}>↪</button>

        {/* BG color */}
        <label title="Arkaplan rengi" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <span style={{ fontSize: '12px', color: t.colors.text.secondary }}>BG</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: '28px', height: '28px', border: 'none', borderRadius: t.borderRadius.sm, cursor: 'pointer' }}
          />
        </label>

        {/* Clear */}
        <button onClick={clearBoard} title="Tahtayı temizle"
          style={{ ...iconBtnStyle, color: t.colors.error[500] }}>
          🗑
        </button>
      </div>

      {/* Canvas area */}
      <div style={{ position: 'relative', flex: 1, overflow: 'auto', background: '#f8f8f8' }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            cursor: tool === 'eraser' ? 'cell'
              : tool === 'text' ? 'text'
              : 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        />
        {/* Overlay canvas for shape preview */}
        <canvas
          ref={overlayRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            maxWidth: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Text input popup */}
      {textPos && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: t.colors.background.primary,
          border: `2px solid ${t.colors.primary[400]}`,
          borderRadius: t.borderRadius.lg,
          padding: t.spacing[4],
          zIndex: t.zIndex.popover,
          boxShadow: t.shadows[4],
          display: 'flex',
          flexDirection: 'column',
          gap: t.spacing[3],
          minWidth: '240px',
        }}>
          <input
            autoFocus
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') setTextPos(null); }}
            placeholder="Metin girin…"
            style={{
              padding: `${t.spacing[2]} ${t.spacing[3]}`,
              border: `1px solid ${t.colors.border.light}`,
              borderRadius: t.borderRadius.md,
              fontSize: t.typography.fontSize.base,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: t.spacing[2] }}>
            <button onClick={commitText} style={{ ...iconBtnStyle, flex: 1, background: t.colors.primary[500], color: '#fff', border: 'none' }}>
              Ekle
            </button>
            <button onClick={() => setTextPos(null)} style={{ ...iconBtnStyle, flex: 1 }}>
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtnStyle = {
  width: '32px', height: '32px',
  borderRadius: t.borderRadius.md,
  border: `1px solid ${t.colors.border.light}`,
  background: t.colors.background.primary,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '16px',
  color: t.colors.text.secondary,
  transition: t.transitions.fast,
  padding: 0,
};

export default memo(CollaborativeWhiteboard);
