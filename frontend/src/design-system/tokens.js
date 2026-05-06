/**
 * Unified Design Tokens
 * Central export point for all design system values
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';

export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,

  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Border radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Transitions/Animations
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',

    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
    },
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
    notification: 1300,
  },

  // Component-specific sizes
  sizes: {
    // Icon sizes
    icon: {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },

    // Button sizes (height)
    button: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },

    // Input sizes (height)
    input: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },

    // Container sizes
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },

  // Opacity scale
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },
};

export default designTokens;
