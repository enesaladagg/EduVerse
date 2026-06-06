import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Mic, Video, MonitorUp, PenTool, Code, Presentation, SmilePlus, CircleDot, Bot } from 'lucide-react';

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
        <span>{connected ? '📶' : '⏳'}</span>
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
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onAction(id)}
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
