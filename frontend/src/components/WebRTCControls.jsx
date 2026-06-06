import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  memo,
} from 'react';
import { designTokens as t } from '../design-system/tokens';
import { BackgroundProcessor } from '../utils/backgroundProcessor';

// ---------------------------------------------------------------------------
// Virtual background options
// ---------------------------------------------------------------------------
const VIRTUAL_BACKGROUNDS = [
  { id: 'none',      label: 'Yok',          preview: null,      icon: '⊘'  },
  { id: 'blur_low',  label: 'Hafif Bulanık', preview: null,     icon: '💧' },
  { id: 'blur_high', label: 'Güçlü Bulanık', preview: null,     icon: '🌫️' },
  { id: 'classroom', label: 'Sınıf',         preview: '#EFF6FF', icon: '🏫' },
  { id: 'office',    label: 'Ofis',          preview: '#F0FDF4', icon: '🏢' },
  { id: 'space',     label: 'Uzay',          preview: '#0f0f1a', icon: '🚀' },
];

// ---------------------------------------------------------------------------
// Small toggle control
// ---------------------------------------------------------------------------
const ToggleSwitch = memo(function ToggleSwitch({ on, onChange, label, disabled = false }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      gap: t.spacing[3],
    }}>
      <span style={{ fontSize: t.typography.fontSize.sm, color: t.colors.text.primary }}>
        {label}
      </span>
      <div
        onClick={() => !disabled && onChange(!on)}
        style={{
          width: '44px', height: '24px',
          borderRadius: t.borderRadius.full,
          background: on ? t.colors.primary[500] : t.colors.neutral[300],
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: on ? '22px' : '3px',
          width: '18px', height: '18px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: t.shadows[1],
          transition: 'left 0.2s',
        }} />
      </div>
    </label>
  );
});

// ---------------------------------------------------------------------------
// Circular control button (cam / mic / screen share)
// ---------------------------------------------------------------------------
const CircleBtn = memo(function CircleBtn({ icon, label, active, danger = false, onClick, size = 52 }) {
  const bg = useMemo(() => {
    if (!active) return danger ? t.colors.error[500] : t.colors.neutral[700];
    return t.colors.neutral[800];
  }, [active, danger]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <button
        onClick={onClick}
        title={label}
        style={{
          width: `${size}px`, height: `${size}px`,
          borderRadius: t.borderRadius.full,
          border: 'none',
          background: bg,
          color: active ? '#fff' : 'rgba(255,255,255,0.5)',
          fontSize: '22px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: active ? 'none' : `0 0 0 2px ${t.colors.error[400]}`,
          transition: t.transitions.base,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!active && (
          <div style={{
            position: 'absolute',
            top: 0, left: '50%',
            width: '2px', height: '100%',
            background: t.colors.error[400],
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
          }} />
        )}
        {icon}
      </button>
      <span style={{
        fontSize: '10px',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        maxWidth: '60px',
        lineHeight: 1.2,
      }}>
        {active ? label : `${label} kapalı`}
      </span>
    </div>
  );
});

// ---------------------------------------------------------------------------
// AI Badge
// ---------------------------------------------------------------------------
const AIBadge = memo(function AIBadge() {
  return (
    <span style={{
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      color: '#fff',
      fontSize: '10px',
      fontWeight: t.typography.fontWeight.bold,
      padding: '2px 6px',
      borderRadius: t.borderRadius.full,
      letterSpacing: '0.05em',
    }}>
      AI
    </span>
  );
});

// ---------------------------------------------------------------------------
// Mock participant tile
// ---------------------------------------------------------------------------
const ParticipantTile = memo(function ParticipantTile({ name, status, isSelf = false }) {
  return (
    <div style={{
      borderRadius: t.borderRadius.lg,
      background: '#1a1d2e',
      overflow: 'hidden',
      aspectRatio: '16/9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: isSelf ? `2px solid ${t.colors.primary[500]}` : `1px solid ${t.colors.neutral[700]}`,
    }}>
      {/* Avatar */}
      <div style={{
        width: '48px', height: '48px',
        borderRadius: t.borderRadius.full,
        background: isSelf
          ? `linear-gradient(135deg, ${t.colors.primary[500]}, ${t.colors.secondary[500]})`
          : `linear-gradient(135deg, ${t.colors.neutral[600]}, ${t.colors.neutral[700]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', color: '#fff', fontWeight: t.typography.fontWeight.bold,
        marginBottom: t.spacing[2],
      }}>
        {name.charAt(0).toUpperCase()}
      </div>

      <span style={{ color: '#fff', fontSize: '12px' }}>{name}</span>

      {/* Status indicators */}
      <div style={{
        position: 'absolute', bottom: '8px', left: '8px',
        display: 'flex', gap: '4px',
      }}>
        {status.mic  && <span title="Mikrofon açık" style={{ fontSize: '12px' }}>🎤</span>}
        {status.cam  && <span title="Kamera açık"   style={{ fontSize: '12px' }}>📷</span>}
        {status.hand && <span title="El kaldırdı"   style={{ fontSize: '12px' }}>✋</span>}
      </div>

      {isSelf && (
        <span style={{
          position: 'absolute', top: '8px', right: '8px',
          background: t.colors.primary[500], color: '#fff',
          fontSize: '9px', padding: '1px 6px', borderRadius: t.borderRadius.full,
        }}>
          Sen
        </span>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Main WebRTCControls
// ---------------------------------------------------------------------------
function WebRTCControls({ className = '', localStream = null, onProcessedStream = null }) {
  const [mic,        setMic]       = useState(true);
  const [cam,        setCam]       = useState(true);
  const [screen,     setScreen]    = useState(false);
  const [hand,       setHand]      = useState(false);
  const [recording,  setRecording] = useState(false);
  const [bgRemoval,  setBgRemoval] = useState(false);
  const [bgBlur,     setBgBlur]    = useState(false);
  const [virtualBg,  setVirtualBg] = useState('none');
  const [aiNoise,    setAiNoise]   = useState(true);
  const [showPanel,  setShowPanel] = useState(false);

  // AI arka plan işleyici örneği (gerçek localStream verildiğinde aktif)
  const processorRef = useRef(null);

  // Seçili AI moduna göre Canvas/MediaStreamTrack işleyiciyi başlat/güncelle
  useEffect(() => {
    if (!localStream) return undefined;

    const mode = bgRemoval ? 'remove' : bgBlur ? 'blur' : 'none';

    if (mode === 'none') {
      // İşleme kapalı: orijinal akışa dön ve işleyiciyi serbest bırak
      if (processorRef.current) {
        processorRef.current.stop();
        processorRef.current = null;
      }
      onProcessedStream?.(localStream);
      return undefined;
    }

    let cancelled = false;
    const processor = new BackgroundProcessor({
      mode,
      blurAmount: bgBlur ? 14 : 0,
      backgroundColor: virtualBg === 'space' ? '#0f0f1a' : '#0f1117',
    });
    processor.start(localStream).then((stream) => {
      if (cancelled) { processor.stop(); return; }
      processorRef.current = processor;
      onProcessedStream?.(stream);
    });

    return () => {
      cancelled = true;
      processor.stop();
      if (processorRef.current === processor) processorRef.current = null;
    };
  }, [localStream, bgRemoval, bgBlur, virtualBg, onProcessedStream]);

  // Unmount'ta işleyiciyi temizle (bellek sızıntısı önleme)
  useEffect(() => () => {
    if (processorRef.current) {
      processorRef.current.stop();
      processorRef.current = null;
    }
  }, []);

  const togglePanel  = useCallback(() => setShowPanel((s) => !s), []);
  const toggleMic    = useCallback(() => setMic((v) => !v), []);
  const toggleCam    = useCallback(() => setCam((v) => !v), []);
  const toggleScreen = useCallback(() => setScreen((v) => !v), []);
  const toggleHand   = useCallback(() => setHand((v) => !v), []);
  const toggleRecord = useCallback(() => setRecording((v) => !v), []);

  const participants = useMemo(() => [
    { name: 'Enes A.',  status: { mic: true,  cam: true,  hand: false }, isSelf: true  },
    { name: 'Ayşe K.',  status: { mic: true,  cam: false, hand: false }                },
    { name: 'Mehmet Y.', status: { mic: false, cam: true, hand: true  }                },
    { name: 'Zeynep T.', status: { mic: true,  cam: true, hand: false }                },
  ], []);

  return (
    <div
      className={`webrtc-root ${className}`}
      style={{
        borderRadius: t.borderRadius.xl,
        overflow: 'hidden',
        background: '#0f1117',
        border: `1px solid ${t.colors.neutral[700]}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: t.shadows[3],
      }}
    >
      {/* Session header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: t.spacing[3],
        padding: `${t.spacing[3]} ${t.spacing[4]}`,
        background: '#1a1d2e',
        borderBottom: `1px solid ${t.colors.neutral[700]}`,
        flexWrap: 'wrap',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: recording ? t.colors.error[500] : t.colors.success[500],
          display: 'inline-block',
          boxShadow: recording ? `0 0 6px ${t.colors.error[400]}` : 'none',
        }} />
        <span style={{ color: '#fff', fontWeight: t.typography.fontWeight.semibold, fontSize: t.typography.fontSize.sm }}>
          {recording ? '● KAYIT YAPILIYOR' : 'React.js — Canlı Ders'} &nbsp;
          <span style={{ color: t.colors.neutral[400], fontWeight: 'normal' }}>Ders #12</span>
        </span>
        <span style={{ marginLeft: 'auto', color: t.colors.neutral[400], fontSize: '12px' }}>
          👥 {participants.length} katılımcı
        </span>
        <button
          onClick={togglePanel}
          style={{
            padding: `${t.spacing[1]} ${t.spacing[3]}`,
            borderRadius: t.borderRadius.md,
            border: `1px solid ${t.colors.neutral[600]}`,
            background: showPanel ? t.colors.primary[600] : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <AIBadge /> AI Kontrolleri
        </button>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* Video grid */}
        <div style={{ flex: 1, padding: t.spacing[4] }}>
          <div
            className="webrtc-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: t.spacing[3],
            }}
          >
            {participants.map((p, i) => (
              <ParticipantTile key={i} {...p} />
            ))}
          </div>
        </div>

        {/* AI Side Panel */}
        {showPanel && (
          <div style={{
            width: '240px',
            background: '#1a1d2e',
            borderLeft: `1px solid ${t.colors.neutral[700]}`,
            padding: t.spacing[4],
            display: 'flex',
            flexDirection: 'column',
            gap: t.spacing[5],
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <div style={{
              color: '#fff',
              fontWeight: t.typography.fontWeight.bold,
              fontSize: t.typography.fontSize.sm,
              display: 'flex', alignItems: 'center', gap: t.spacing[2],
            }}>
              <AIBadge /> Yapay Zeka Kontrolleri
            </div>

            {/* Background removal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
              <p style={{ margin: 0, color: t.colors.neutral[400], fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Arka Plan
              </p>
              <ToggleSwitch
                label="Arka Plan Kaldırma (AI)"
                on={bgRemoval}
                onChange={(v) => { setBgRemoval(v); if (v) setBgBlur(false); }}
              />
              <ToggleSwitch
                label="Arka Plan Bulanıklaştırma"
                on={bgBlur}
                onChange={(v) => { setBgBlur(v); if (v) setBgRemoval(false); }}
              />

              {/* Virtual background selector */}
              <p style={{ margin: `${t.spacing[2]} 0 0`, color: t.colors.neutral[400], fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sanal Arka Plan
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: t.spacing[2] }}>
                {VIRTUAL_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setVirtualBg(bg.id)}
                    style={{
                      padding: `${t.spacing[2]} ${t.spacing[1]}`,
                      borderRadius: t.borderRadius.md,
                      border: `2px solid ${virtualBg === bg.id ? t.colors.primary[500] : t.colors.neutral[600]}`,
                      background: bg.preview ?? '#2a2d3e',
                      color: bg.preview === '#0f0f1a' ? '#fff' : (virtualBg === bg.id ? t.colors.primary[700] : t.colors.neutral[300]),
                      cursor: 'pointer',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{bg.icon}</span>
                    <span>{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio AI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
              <p style={{ margin: 0, color: t.colors.neutral[400], fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ses İşleme
              </p>
              <ToggleSwitch
                label="Gürültü Engelleme (AI)"
                on={aiNoise}
                onChange={setAiNoise}
              />
            </div>

            {/* Recording */}
            <div>
              <button
                onClick={toggleRecord}
                style={{
                  width: '100%',
                  padding: t.spacing[3],
                  borderRadius: t.borderRadius.md,
                  border: 'none',
                  background: recording ? t.colors.error[600] : t.colors.neutral[700],
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: t.typography.fontSize.sm,
                  fontWeight: t.typography.fontWeight.semibold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: t.spacing[2],
                }}
              >
                {recording ? '⏹ Kaydı Durdur' : '⏺ Dersi Kaydet'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.spacing[5],
        padding: `${t.spacing[4]} ${t.spacing[6]}`,
        background: '#1a1d2e',
        borderTop: `1px solid ${t.colors.neutral[700]}`,
        flexWrap: 'wrap',
      }}>
        <CircleBtn icon="🎤" label="Mikrofon" active={mic}    onClick={toggleMic}    danger />
        <CircleBtn icon="📷" label="Kamera"   active={cam}    onClick={toggleCam}    danger />
        <CircleBtn icon="🖥️" label="Ekran Paylaş" active={!screen} onClick={toggleScreen} />
        <CircleBtn icon="✋" label="El Kaldır" active={!hand} onClick={toggleHand}  />

        <div style={{ width: 1, height: 40, background: t.colors.neutral[700] }} />

        {/* End call */}
        <button onClick={() => alert('Dersten ayrılındı')} style={{
          padding: `${t.spacing[3]} ${t.spacing[6]}`,
          borderRadius: t.borderRadius.full,
          border: 'none',
          background: t.colors.error[600],
          color: '#fff',
          cursor: 'pointer',
          fontWeight: t.typography.fontWeight.semibold,
          fontSize: t.typography.fontSize.sm,
          transition: t.transitions.base,
        }}>
          📞 Dersten Ayrıl
        </button>
      </div>
    </div>
  );
}

export default memo(WebRTCControls);
