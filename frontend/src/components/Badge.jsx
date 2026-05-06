import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Badge Component
 * Small label/status indicator component
 * 
 * @component
 * @example
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success">Approved</Badge>
 * <Badge variant="warning">Pending</Badge>
 */
const Badge = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      rounded = true,
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, spacing, typography, borderRadius } = designTokens;

    const variantStyles = {
      primary: {
        background: colors.primary[100],
        color: colors.primary[700],
        border: `1px solid ${colors.primary[300]}`,
      },
      secondary: {
        background: colors.secondary[100],
        color: colors.secondary[700],
        border: `1px solid ${colors.secondary[300]}`,
      },
      success: {
        background: colors.success[100],
        color: colors.success[700],
        border: `1px solid ${colors.success[300]}`,
      },
      warning: {
        background: colors.warning[100],
        color: colors.warning[700],
        border: `1px solid ${colors.warning[300]}`,
      },
      error: {
        background: colors.error[100],
        color: colors.error[700],
        border: `1px solid ${colors.error[300]}`,
      },
      info: {
        background: colors.info[100],
        color: colors.info[700],
        border: `1px solid ${colors.info[300]}`,
      },
      neutral: {
        background: colors.neutral[100],
        color: colors.neutral[700],
        border: `1px solid ${colors.neutral[300]}`,
      },
    };

    const sizeStyles = {
      sm: {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        height: '20px',
        lineHeight: '20px',
      },
      md: {
        padding: `${spacing[1]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        height: '24px',
        lineHeight: '24px',
      },
      lg: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        height: '28px',
        lineHeight: '28px',
      },
    };

    const style = {
      ...variantStyles[variant],
      ...sizeStyles[size],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1],
      borderRadius: rounded ? borderRadius.full : borderRadius.md,
      whiteSpace: 'nowrap',
    };

    return (
      <span
        ref={ref}
        style={style}
        className={`badge badge--${variant} badge--${size} ${className}`}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
