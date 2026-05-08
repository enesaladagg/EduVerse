/**
 * Typography System
 * Based on Material Design 3 typography scale
 */

export const typography = {
  // Font families
  fontFamily: {
    primary: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font sizes (in pixels)
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
    '5xl': '36px',
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Heading styles
  heading: {
    h1: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.015em',
    },
    medium: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.04em',
    },
  },

  // Label styles
  label: {
    large: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    medium: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.015em',
    },
    small: {
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
    },
  },

  // Display styles (for hero sections)
  display: {
    large: {
      fontSize: '57px',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    medium: {
      fontSize: '45px',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    small: {
      fontSize: '36px',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
  },
};

export default typography;
