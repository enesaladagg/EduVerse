import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Button Component
 * Versatile button component with multiple variants and sizes
 * 
 * @component
 * @example
 * <Button variant="primary" size="md">Click Me</Button>
 * <Button variant="secondary" disabled>Disabled</Button>
 * <Button variant="outline" icon={<IconComponent />}>With Icon</Button>
 */
const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon = null,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, spacing, typography, borderRadius, transitions } = designTokens;

    // Variant styles
    const variantStyles = {
      primary: {
        background: colors.primary[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.primary[500]}`,
        hover: {
          background: colors.primary[600],
          boxShadow: shadows.md,
        },
        active: {
          background: colors.primary[700],
        },
      },
      secondary: {
        background: colors.secondary[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.secondary[500]}`,
        hover: {
          background: colors.secondary[600],
          boxShadow: shadows.md,
        },
        active: {
          background: colors.secondary[700],
        },
      },
      outline: {
        background: 'transparent',
        color: colors.primary[500],
        border: `2px solid ${colors.primary[500]}`,
        hover: {
          background: colors.primary[50],
        },
        active: {
          background: colors.primary[100],
        },
      },
      ghost: {
        background: 'transparent',
        color: colors.primary[500],
        border: 'none',
        hover: {
          background: colors.primary[50],
        },
        active: {
          background: colors.primary[100],
        },
      },
      danger: {
        background: colors.error[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.error[500]}`,
        hover: {
          background: colors.error[600],
          boxShadow: shadows.md,
        },
        active: {
          background: colors.error[700],
        },
      },
      success: {
        background: colors.success[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.success[500]}`,
        hover: {
          background: colors.success[600],
          boxShadow: shadows.md,
        },
        active: {
          background: colors.success[700],
        },
      },
    };

    // Size styles
    const sizeStyles = {
      sm: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.sm,
        height: designTokens.sizes.button.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: typography.fontSize.base,
        height: designTokens.sizes.button.md,
        borderRadius: borderRadius.lg,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[8]}`,
        fontSize: typography.fontSize.lg,
        height: designTokens.sizes.button.lg,
        borderRadius: borderRadius.lg,
      },
    };

    const style = {
      ...variantStyles[variant],
      ...sizeStyles[size],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      fontWeight: typography.fontWeight.semibold,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: transitions.base,
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : 'auto',
      ...(disabled && { pointerEvents: 'none' }),
    };

    return (
      <button
        ref={ref}
        style={style}
        disabled={disabled || loading}
        className={`button button--${variant} button--${size} ${className}`}
        {...rest}
      >
        {loading && <span>⏳</span>}
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
