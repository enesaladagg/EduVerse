import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { XPBar } from '../GamificationBadges';

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
        title="Geri"
        style={{
          width: 36,
          height: 36,
          borderRadius: t.borderRadius.md,
          border: `1px solid ${p.border}`,
          background: p.panelElevated,
          cursor: 'pointer',
          color: p.text,
        }}
      >
        ←
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
        <span style={{ fontWeight: t.typography.fontWeight.bold, fontSize: t.typography.fontSize.lg, color: p.text }}>
          EduFlow
        </span>
        <span style={{ fontWeight: t.typography.fontWeight.bold, fontSize: t.typography.fontSize.lg, color: p.accent }}>
          Pro
        </span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: t.typography.fontSize.sm, fontWeight: t.typography.fontWeight.semibold, color: p.text }}>
          {courseTitle}
        </span>
        <span style={{ fontSize: t.typography.fontSize.xs, color: p.textMuted }}>{moduleTitle}</span>
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

      {user && <XPBar xp={user.points || user.xp || 0} compact />}

      <span style={{ fontSize: t.typography.fontSize.sm, color: p.textMuted }}>
        👥 {participantCount}
      </span>

      <button
        type="button"
        onClick={toggleTheme}
        style={{
          width: 36,
          height: 36,
          borderRadius: t.borderRadius.md,
          border: `1px solid ${p.border}`,
          background: p.panelElevated,
          cursor: 'pointer',
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
});

export default SessionTopBar;
