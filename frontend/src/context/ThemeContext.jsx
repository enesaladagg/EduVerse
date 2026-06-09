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
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('eduflow-theme', isDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const palette = useMemo(() => getEduFlowPalette(isDark), [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--c-shell', palette.shell);
    root.style.setProperty('--c-panel', palette.panel);
    root.style.setProperty('--c-panelElevated', palette.panelElevated);
    root.style.setProperty('--c-border', palette.border);
    root.style.setProperty('--c-text', palette.text);
    root.style.setProperty('--c-textMuted', palette.textMuted);
    root.style.setProperty('--c-textSubtle', palette.textSubtle);
    root.style.setProperty('--c-accent', palette.accent);
    root.style.setProperty('--c-accentHover', palette.accentHover);
    root.style.setProperty('--c-success', palette.success);
    
    // Convert hex accent to rgb for rgba() usage
    try {
      const hex = palette.accent;
      if (hex.startsWith('#')) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        root.style.setProperty('--c-accent-rgb', `${r}, ${g}, ${b}`);
      }
    } catch(e){}
  }, [palette]);

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
