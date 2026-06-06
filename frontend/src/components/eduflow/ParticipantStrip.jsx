import React, { memo } from 'react';
import { MicOff, Hand } from 'lucide-react';
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
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length]} 0%, ${AVATAR_COLORS[(i+1) % AVATAR_COLORS.length]}80 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '18px',
            border: p_.userId === selfId || p_.role === 'host'
              ? `2px solid ${p.accent}`
              : `2px solid transparent`,
            boxShadow: `0 4px 12px ${AVATAR_COLORS[i % AVATAR_COLORS.length]}40`,
            position: 'relative',
          }}>
            {initials(p_.displayName)}
            <div style={{ position: 'absolute', top: -2, right: -2, display: 'flex', gap: 2 }}>
              {!p_.mic && <div style={{background: '#ef4444', borderRadius: '50%', padding: 3, display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}><MicOff size={10} color="#fff" strokeWidth={3} /></div>}
              {p_.hand && <div style={{background: '#f59e0b', borderRadius: '50%', padding: 3, display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}><Hand size={10} color="#fff" strokeWidth={3} /></div>}
            </div>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: p.text, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p_.displayName?.split(' ')[0] || 'Katılımcı'}
          </span>
        </div>
      ))}
    </div>
  );
});

export default ParticipantStrip;
