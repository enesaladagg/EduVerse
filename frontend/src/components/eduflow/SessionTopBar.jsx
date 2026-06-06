import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { XPBar } from '../GamificationBadges';
import { Sun, Moon, ChevronLeft } from 'lucide-react';

const SessionTopBar = memo(function SessionTopBar({
  courseTitle,
  moduleTitle,
  sessionTimer,
  viewRole,
  onViewRoleChange,
  participantCount,
  user,
  connected,
  onNavigateHome,
  recording,
}) {
  const { palette: p, tokens: t, isDark, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: t.spacing[3],
        padding: `${t.spacing[3]} ${t.spacing[5]}`,
        background: p.panel,
        borderBottom: `1px solid ${p.border}`,
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        onClick={onNavigateHome}
        title="Geri Dön"
        style={{
          width: 40,
          height: 40,
          borderRadius: t.borderRadius.lg,
          border: `1px solid ${p.border}`,
          background: isDark ? 'rgba(255,255,255,0.05)' : p.panelElevated,
          cursor: 'pointer',
          color: p.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: t.shadows.sm,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#fff'; e.currentTarget.style.transform = 'translateX(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : p.panelElevated; e.currentTarget.style.transform = 'translateX(0)'; }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={onNavigateHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#00d4aa',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 18, color: 'white'
        }}>E</div>
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          <span style={{ color: isDark ? '#fff' : '#1e293b' }}>Edu</span>
          <span style={{ color: '#00d4aa' }}>Verse</span>
        </span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1, paddingLeft: t.spacing[4], borderLeft: `2px solid ${p.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: p.text, letterSpacing: '-0.3px' }}>
            {courseTitle}
          </span>
          <span style={{ color: p.textMuted, fontSize: '10px' }}>●</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: p.accent }}>
            Modül 4
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', color: p.textMuted, fontWeight: 500 }}>
            {moduleTitle}
          </span>
        </div>
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.spacing[2],
        background: `${p.live}18`,
        color: p.live,
        padding: `${t.spacing[1]} ${t.spacing[3]}`,
        borderRadius: t.borderRadius.full,
        fontSize: t.typography.fontSize.xs,
        fontWeight: t.typography.fontWeight.bold,
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: p.live,
          boxShadow: connected ? `0 0 6px ${p.live}` : 'none',
          animation: connected ? 'eduflow-pulse 1.5s infinite' : 'none',
        }} />
        CANLI {sessionTimer}
      </div>

      {recording && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.spacing[2],
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          padding: `${t.spacing[1]} ${t.spacing[3]}`,
          borderRadius: t.borderRadius.full,
          fontSize: t.typography.fontSize.xs,
          fontWeight: t.typography.fontWeight.bold,
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
            animation: 'eduflow-pulse 1.5s infinite',
          }} />
          KAYDEDİLİYOR
        </div>
      )}

      {user?.role === 'admin' && (
        <div style={{
          display: 'inline-flex',
          background: p.pillInactive,
          borderRadius: t.borderRadius.full,
          padding: '3px',
          gap: '2px',
        }}>
          {['teacher', 'student'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onViewRoleChange(role)}
              style={{
                padding: `${t.spacing[1]} ${t.spacing[3]}`,
                borderRadius: t.borderRadius.full,
                border: 'none',
                cursor: 'pointer',
                fontSize: t.typography.fontSize.xs,
                fontWeight: t.typography.fontWeight.semibold,
                background: viewRole === role ? p.accent : 'transparent',
                color: viewRole === role ? '#fff' : p.textMuted,
              }}
            >
              {role === 'teacher' ? 'Eğitmen' : 'Öğrenci'}
            </button>
          ))}
        </div>
      )}

      {user && <XPBar xp={user.points || user.xp || 0} compact />}

      <span style={{ fontSize: t.typography.fontSize.sm, color: p.textMuted }}>
        👥 {participantCount}
      </span>

      <button
        type="button"
        onClick={toggleTheme}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: '50%',
          border: 'none',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          color: isDark ? '#fff' : '#1e293b',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
});

export default SessionTopBar;
