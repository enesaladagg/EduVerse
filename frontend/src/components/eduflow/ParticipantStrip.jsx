import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#22C55E'];

function initials(name = '?') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

const ParticipantStrip = memo(function ParticipantStrip({ participants = [], selfId }) {
  const { palette: p, tokens: t } = useTheme();
  const visible = participants.filter((p_) => p_.connected !== false).slice(0, 8);

  if (!visible.length) return null;

  return (
    <div
      className="eduflow-participant-strip"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: t.spacing[3],
        padding: `${t.spacing[2]} ${t.spacing[4]}`,
        background: p.panel,
        borderTop: `1px solid ${p.border}`,
        overflowX: 'auto',
      }}
    >
      {visible.map((p_, i) => (
        <div
          key={p_.userId}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: t.borderRadius.lg,
            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: t.typography.fontWeight.bold,
            fontSize: t.typography.fontSize.sm,
            border: p_.userId === selfId || p_.role === 'host'
              ? `2px solid ${p.accent}`
              : `2px solid ${p.border}`,
            position: 'relative',
          }}>
            {initials(p_.displayName)}
            <div style={{ position: 'absolute', top: 2, right: 2, fontSize: '10px' }}>
              {!p_.mic && '🔇'}
              {p_.hand && '✋'}
            </div>
          </div>
          <span style={{ fontSize: t.typography.fontSize.xs, color: p.textMuted, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p_.displayName?.split(' ')[0] || 'Katılımcı'}
          </span>
        </div>
      ))}
    </div>
  );
});

export default ParticipantStrip;
