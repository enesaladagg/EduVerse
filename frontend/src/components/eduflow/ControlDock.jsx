import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const DOCK_ITEMS = [
  { id: 'mic', icon: '🎤', label: 'Mikrofon' },
  { id: 'cam', icon: '📹', label: 'Kamera' },
  { id: 'share', icon: '🖥️', label: 'Paylaş' },
  { id: 'whiteboard', icon: '✏️', label: 'Tahta' },
  { id: 'sandbox', icon: '💻', label: 'Kod' },
  { id: 'slide', icon: '📊', label: 'Slayt' },
  { id: 'reactions', icon: '👍', label: 'Tepki' },
  { id: 'record', icon: '⏺', label: 'Kayıt' },
  { id: 'ai', icon: '🤖', label: 'AI' },
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

      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2], flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {DOCK_ITEMS.map(({ id, icon, label }) => {
          const active = isActive(id);
          const disabled = viewRole === 'student' && id === 'share';

          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onAction(id)}
              title={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: `${t.spacing[2]} ${t.spacing[3]}`,
                borderRadius: t.borderRadius.lg,
                border: active ? `2px solid ${p.accent}` : `1px solid ${p.border}`,
                background: active ? `${p.accent}25` : p.panelElevated,
                color: disabled ? p.textSubtle : p.text,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                minWidth: 56,
                transition: t.transitions.fast,
              }}
            >
              <span style={{ fontSize: '18px' }}>{icon}</span>
              <span style={{ fontSize: t.typography.fontSize.xs, color: p.textMuted }}>{label}</span>
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
