/** @type {import('tailwindcss').Config} */

import { designTokens } from './src/design-system/tokens';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // Colors from design system
      colors: {
        primary: {
          50: designTokens.colors.primary[50],
          100: designTokens.colors.primary[100],
          200: designTokens.colors.primary[200],
          300: designTokens.colors.primary[300],
          400: designTokens.colors.primary[400],
          500: designTokens.colors.primary[500],
          600: designTokens.colors.primary[600],
          700: designTokens.colors.primary[700],
          800: designTokens.colors.primary[800],
          900: designTokens.colors.primary[900],
        },
        secondary: {
          50: designTokens.colors.secondary[50],
          100: designTokens.colors.secondary[100],
          200: designTokens.colors.secondary[200],
          300: designTokens.colors.secondary[300],
          400: designTokens.colors.secondary[400],
          500: designTokens.colors.secondary[500],
          600: designTokens.colors.secondary[600],
          700: designTokens.colors.secondary[700],
          800: designTokens.colors.secondary[800],
          900: designTokens.colors.secondary[900],
        },
        success: {
          50: designTokens.colors.success[50],
          100: designTokens.colors.success[100],
          200: designTokens.colors.success[200],
          300: designTokens.colors.success[300],
          400: designTokens.colors.success[400],
          500: designTokens.colors.success[500],
          600: designTokens.colors.success[600],
          700: designTokens.colors.success[700],
          800: designTokens.colors.success[800],
          900: designTokens.colors.success[900],
        },
        warning: {
          50: designTokens.colors.warning[50],
          100: designTokens.colors.warning[100],
          200: designTokens.colors.warning[200],
          300: designTokens.colors.warning[300],
          400: designTokens.colors.warning[400],
          500: designTokens.colors.warning[500],
          600: designTokens.colors.warning[600],
          700: designTokens.colors.warning[700],
          800: designTokens.colors.warning[800],
          900: designTokens.colors.warning[900],
        },
        error: {
          50: designTokens.colors.error[50],
          100: designTokens.colors.error[100],
          200: designTokens.colors.error[200],
          300: designTokens.colors.error[300],
          400: designTokens.colors.error[400],
          500: designTokens.colors.error[500],
          600: designTokens.colors.error[600],
          700: designTokens.colors.error[700],
          800: designTokens.colors.error[800],
          900: designTokens.colors.error[900],
        },
        info: {
          50: designTokens.colors.info[50],
          100: designTokens.colors.info[100],
          200: designTokens.colors.info[200],
          300: designTokens.colors.info[300],
          400: designTokens.colors.info[400],
          500: designTokens.colors.info[500],
          600: designTokens.colors.info[600],
          700: designTokens.colors.info[700],
          800: designTokens.colors.info[800],
          900: designTokens.colors.info[900],
        },
        neutral: {
          0: designTokens.colors.neutral[0],
          50: designTokens.colors.neutral[50],
          100: designTokens.colors.neutral[100],
          200: designTokens.colors.neutral[200],
          300: designTokens.colors.neutral[300],
          400: designTokens.colors.neutral[400],
          500: designTokens.colors.neutral[500],
          600: designTokens.colors.neutral[600],
          700: designTokens.colors.neutral[700],
          800: designTokens.colors.neutral[800],
          900: designTokens.colors.neutral[900],
        },
        text: {
          primary: designTokens.colors.text.primary,
          secondary: designTokens.colors.text.secondary,
          disabled: designTokens.colors.text.disabled,
          inverse: designTokens.colors.text.inverse,
        },
        bg: {
          primary: designTokens.colors.background.primary,
          secondary: designTokens.colors.background.secondary,
          tertiary: designTokens.colors.background.tertiary,
        },
        border: {
          light: designTokens.colors.border.light,
          medium: designTokens.colors.border.medium,
          dark: designTokens.colors.border.dark,
        },
      },

      // Spacing from design system
      spacing: {
        0: designTokens.spacing[0],
        1: designTokens.spacing[1],
        2: designTokens.spacing[2],
        3: designTokens.spacing[3],
        4: designTokens.spacing[4],
        5: designTokens.spacing[5],
        6: designTokens.spacing[6],
        7: designTokens.spacing[7],
        8: designTokens.spacing[8],
        9: designTokens.spacing[9],
        10: designTokens.spacing[10],
        12: designTokens.spacing[12],
        14: designTokens.spacing[14],
        16: designTokens.spacing[16],
        20: designTokens.spacing[20],
        24: designTokens.spacing[24],
        28: designTokens.spacing[28],
        32: designTokens.spacing[32],
        36: designTokens.spacing[36],
        40: designTokens.spacing[40],
        44: designTokens.spacing[44],
        48: designTokens.spacing[48],
        52: designTokens.spacing[52],
        56: designTokens.spacing[56],
        60: designTokens.spacing[60],
        64: designTokens.spacing[64],
        72: designTokens.spacing[72],
        80: designTokens.spacing[80],
        96: designTokens.spacing[96],
      },

      // Font sizes from design system
      fontSize: {
        xs: designTokens.typography.fontSize.xs,
        sm: designTokens.typography.fontSize.sm,
        base: designTokens.typography.fontSize.base,
        lg: designTokens.typography.fontSize.lg,
        xl: designTokens.typography.fontSize.xl,
        '2xl': designTokens.typography.fontSize['2xl'],
        '3xl': designTokens.typography.fontSize['3xl'],
        '4xl': designTokens.typography.fontSize['4xl'],
        '5xl': designTokens.typography.fontSize['5xl'],
      },

      // Font weights from design system
      fontWeight: {
        light: designTokens.typography.fontWeight.light,
        normal: designTokens.typography.fontWeight.normal,
        medium: designTokens.typography.fontWeight.medium,
        semibold: designTokens.typography.fontWeight.semibold,
        bold: designTokens.typography.fontWeight.bold,
        extrabold: designTokens.typography.fontWeight.extrabold,
      },

      // Border radius from design system
      borderRadius: {
        none: designTokens.borderRadius.none,
        sm: designTokens.borderRadius.sm,
        md: designTokens.borderRadius.md,
        lg: designTokens.borderRadius.lg,
        xl: designTokens.borderRadius.xl,
        '2xl': designTokens.borderRadius['2xl'],
        '3xl': designTokens.borderRadius['3xl'],
        full: designTokens.borderRadius.full,
      },

      // Shadows from design system
      boxShadow: {
        none: designTokens.shadows.none,
        0: designTokens.shadows[0],
        1: designTokens.shadows[1],
        2: designTokens.shadows[2],
        3: designTokens.shadows[3],
        4: designTokens.shadows[4],
        5: designTokens.shadows[5],
        sm: designTokens.shadows.sm,
        md: designTokens.shadows.md,
        lg: designTokens.shadows.lg,
        xl: designTokens.shadows.xl,
        '2xl': designTokens.shadows['2xl'],
        focus: designTokens.shadows.focus,
        inset: designTokens.shadows.inset,
      },

      // Breakpoints from design system
      screens: {
        xs: designTokens.breakpoints.xs,
        sm: designTokens.breakpoints.sm,
        md: designTokens.breakpoints.md,
        lg: designTokens.breakpoints.lg,
        xl: designTokens.breakpoints.xl,
        '2xl': designTokens.breakpoints['2xl'],
      },

      // Transitions from design system
      transitionDuration: {
        fast: designTokens.transitions.fast,
        base: designTokens.transitions.base,
        slow: designTokens.transitions.slow,
      },

      // Z-index from design system
      zIndex: {
        hide: designTokens.zIndex.hide,
        auto: designTokens.zIndex.auto,
        0: designTokens.zIndex[0],
        10: designTokens.zIndex[10],
        20: designTokens.zIndex[20],
        30: designTokens.zIndex[30],
        40: designTokens.zIndex[40],
        50: designTokens.zIndex[50],
        modal: designTokens.zIndex.modal,
        popover: designTokens.zIndex.popover,
        tooltip: designTokens.zIndex.tooltip,
        notification: designTokens.zIndex.notification,
      },

      // Opacity from design system
      opacity: {
        0: designTokens.opacity[0],
        5: designTokens.opacity[5],
        10: designTokens.opacity[10],
        20: designTokens.opacity[20],
        25: designTokens.opacity[25],
        30: designTokens.opacity[30],
        40: designTokens.opacity[40],
        50: designTokens.opacity[50],
        60: designTokens.opacity[60],
        70: designTokens.opacity[70],
        75: designTokens.opacity[75],
        80: designTokens.opacity[80],
        90: designTokens.opacity[90],
        95: designTokens.opacity[95],
        100: designTokens.opacity[100],
      },

      // Font families
      fontFamily: {
        primary: designTokens.typography.fontFamily.primary,
        mono: designTokens.typography.fontFamily.mono,
      },
    },
  },

  plugins: [],
};
