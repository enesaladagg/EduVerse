import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { designTokens as t } from '../design-system/tokens';

const ThemeContext = createContext(null);

/** EduFlow paleti — mevcut design token'larından türetilir, referans mockup ile uyumlu */
export function getEduFlowPalette(isDark) {
  if (isDark) {
    return {
      shell: '#0f1117',
      panel: '#1a1d2e',
      panelElevated: '#232738',
      border: '#2a2d3e',
      text: t.colors.neutral[0],
      textMuted: t.colors.neutral[400],
      textSubtle: t.colors.neutral[500],
      accent: t.colors.primary[500],
      accentHover: t.colors.primary[600],
      live: t.colors.error[500],
      success: t.colors.success[500],
      stage: t.colors.neutral[0],
      chatBubble: '#2a3145',
      chatBubbleSelf: t.colors.primary[900],
      pillInactive: '#2a2d3e',
      dock: '#151821',
    };
  }
  return {
    shell: t.colors.background.secondary,
    panel: t.colors.background.primary,
    panelElevated: t.colors.neutral[50],
    border: t.colors.border.light,
    text: t.colors.text.primary,
    textMuted: t.colors.text.secondary,
    textSubtle: t.colors.neutral[400],
    accent: t.colors.primary[500],
    accentHover: t.colors.primary[600],
    live: t.colors.error[500],
    success: t.colors.success[500],
    stage: t.colors.neutral[0],
    chatBubble: t.colors.neutral[100],
    chatBubbleSelf: t.colors.primary[50],
    pillInactive: t.colors.neutral[200],
    dock: t.colors.neutral[800],
  };
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('eduflow-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('eduflow-theme', isDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const palette = useMemo(() => getEduFlowPalette(isDark), [isDark]);
  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const value = useMemo(
    () => ({ isDark, palette, toggleTheme, tokens: t }),
    [isDark, palette, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;
