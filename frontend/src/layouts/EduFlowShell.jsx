import React, { memo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { XPBar } from '../components/GamificationBadges';
import { useAuth } from '../context/AuthContext';

import GlobalNavbar from '../components/GlobalNavbar';

const EduFlowShell = memo(function EduFlowShell({
  activePage,
  onNavigate,
  user,
  isAuthenticated,
  children,
}) {
  const { palette: p, tokens: t, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: p.shell,
      color: p.text,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <GlobalNavbar activePage={activePage} onNavigate={onNavigate} />

      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
});

export default EduFlowShell;
