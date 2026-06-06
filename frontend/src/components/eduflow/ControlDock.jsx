import React, { memo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Mic, Video, MonitorUp, PenTool, Code, Presentation, SmilePlus, CircleDot, Bot, Hand, Signal, Loader } from 'lucide-react';


const DOCK_ITEMS = [
  { id: 'mic', Icon: Mic, label: 'Mikrofon' },
  { id: 'cam', Icon: Video, label: 'Kamera' },
  { id: 'share', Icon: MonitorUp, label: 'Paylaş' },
  { id: 'whiteboard', Icon: PenTool, label: 'Tahta' },
  { id: 'sandbox', Icon: Code, label: 'Kod' },
  { id: 'slide', Icon: Presentation, label: 'Slayt' },
  { id: 'reactions', Icon: SmilePlus, label: 'Tepki' },
  { id: 'record', Icon: CircleDot, label: 'Kayıt' },
  { id: 'ai', Icon: Bot, label: 'AI' },
];

const ControlDock = memo(function ControlDock({
  activeMode,
  mic,
  cam,
  screen,
  hand,
  recording,
  showAiPanel,
  viewRole,
  connected,
  onAction,
  onEndSession,
}) {
  const { palette: p, tokens: t } = useTheme();
  const [showReactions, setShowReactions] = useState(false);

  const isActive = (id) => {
    if (id === 'mic') return mic;
    if (id === 'cam') return cam;
    if (id === 'share') return screen;
    if (id === 'reactions') return hand;
    if (id === 'record') return recording;
    if (id === 'ai') return showAiPanel;
    if (['whiteboard', 'sandbox', 'slide'].includes(id)) return activeMode === id;
    return false;
  };

  const handleReactionClick = (emoji) => {
    // Burada ileride socket ile emoji gönderilebilir. Şimdilik sadece menüyü kapatıyoruz.
    setShowReactions(false);
  };

  return (
    <div
      className="eduflow-control-dock"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.spacing[2],
        padding: `${t.spacing[3]} ${t.spacing[4]}`,
        background: p.dock,
        borderTop: `1px solid ${p.border}`,
        flexWrap: 'wrap',
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.spacing[2],
        color: connected ? p.success : p.live,
        fontSize: t.typography.fontSize.xs,
        minWidth: 120,
      }}>
        {connected ? <Signal size={16} color={p.success} /> : <Loader size={16} color={p.live} className="eduflow-spin" />}
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .eduflow-spin { animation: spin 2s linear infinite; }`}</style>
        {connected ? 'Bağlantı İyi' : 'Bağlanıyor…'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        <style>{`
          .eduflow-dock-btn { transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
          .eduflow-dock-btn:hover:not(:disabled) { transform: translateY(-4px); background: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
          .eduflow-dock-btn.active { box-shadow: 0 8px 24px var(--c-accent-rgb, rgba(0,212,170,0.25)); }
        `}</style>
        {DOCK_ITEMS.map(({ id, Icon, label }) => {
          const active = isActive(id);
          const disabled = viewRole === 'student' && id === 'share';

          // Special red color for record button when active
          const isRecordActive = id === 'record' && active;
          const activeColor = isRecordActive ? '#ef4444' : p.accent;

          return (
            <div key={id} style={{ position: 'relative' }}>
              {id === 'reactions' && showReactions && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px',
                  background: p.panel, borderRadius: '16px', padding: '8px', border: `1px solid ${p.border}`,
                  display: 'flex', gap: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 50,
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <button onClick={() => { onAction('reactions'); setShowReactions(false); }} title="El Kaldır" style={{
                    width: 40, height: 40, borderRadius: '10px', border: 'none', background: hand ? `${p.accent}30` : p.panelElevated, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: hand ? `inset 0 0 0 1px ${p.accent}` : 'none'
                  }}>
                    <Hand size={20} color={hand ? p.accent : p.text} />
                  </button>
                  <div style={{ width: 1, background: p.border, margin: '0 4px' }} />
                  {['👏', '🚀', '❤️', '😂', '🤔'].map(emoji => (
                    <button key={emoji} onClick={() => handleReactionClick(emoji)} style={{
                      width: 40, height: 40, borderRadius: '10px', border: 'none', background: 'transparent', 
                      fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.background = p.panelElevated} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (id === 'reactions') {
                    setShowReactions(!showReactions);
                  } else {
                    onAction(id);
                    setShowReactions(false);
                  }
                }}
                title={label}
                className={`eduflow-dock-btn ${active ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '72px',
                  height: '68px',
                  borderRadius: '16px',
                  border: active ? `1px solid ${activeColor}` : `1px solid ${p.border}`,
                  background: active ? (isRecordActive ? 'rgba(239,68,68,0.15)' : `${p.accent}15`) : (p.isDark ? 'rgba(255,255,255,0.03)' : p.panelElevated),
                  color: disabled ? p.textSubtle : p.text,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <Icon size={22} color={active ? activeColor : p.textMuted} strokeWidth={active ? 2.5 : 2} style={{ transition: 'all 0.3s ease' }} />
                <span style={{ fontSize: '12px', fontWeight: active ? 700 : 500, color: active ? activeColor : p.textMuted, transition: 'all 0.3s ease' }}>{label}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: t.spacing[2], minWidth: 120, justifyContent: 'flex-end' }}>
        {viewRole === 'teacher' && (
          <button
            type="button"
            onClick={onEndSession}
            style={{
              padding: `${t.spacing[2]} ${t.spacing[4]}`,
              borderRadius: t.borderRadius.full,
              background: p.live,
              color: '#fff',
              border: 'none',
              fontWeight: t.typography.fontWeight.bold,
              fontSize: t.typography.fontSize.sm,
              cursor: 'pointer',
            }}
          >
            Dersi Bitir
          </button>
        )}
      </div>
    </div>
  );
});

export default ControlDock;
