import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Alert Component
 * Display messages with different severity levels
 * 
 * @component
 * @example
 * <Alert variant="success">Operation completed successfully!</Alert>
 * <Alert variant="error">An error occurred!</Alert>
 * <Alert variant="warning">Please review this information</Alert>
 */
const Alert = React.forwardRef(
  (
    {
      children,
      variant = 'info',
      title,
      closeable = false,
      onClose,
      icon = null,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const { colors, spacing, typography, borderRadius, transitions } = designTokens;

    const variantConfig = {
      success: {
        background: colors.success[50],
        border: `1px solid ${colors.success[300]}`,
        title: colors.success[800],
        text: colors.success[700],
        icon: '✓',
      },
      error: {
        background: colors.error[50],
        border: `1px solid ${colors.error[300]}`,
        title: colors.error[800],
        text: colors.error[700],
        icon: '✕',
      },
      warning: {
        background: colors.warning[50],
        border: `1px solid ${colors.warning[300]}`,
        title: colors.warning[800],
        text: colors.warning[700],
        icon: '⚠',
      },
      info: {
        background: colors.info[50],
        border: `1px solid ${colors.info[300]}`,
        title: colors.info[800],
        text: colors.info[700],
        icon: 'ⓘ',
      },
    };

    const config = variantConfig[variant];

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const alertStyle = {
      background: config.background,
      border: config.border,
      borderRadius: borderRadius.lg,
      padding: spacing[4],
      display: 'flex',
      gap: spacing[3],
      alignItems: 'flex-start',
      transition: transitions.base,
      animation: 'slideIn 0.3s ease-out',
    };

    const contentStyle = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[1],
    };

    const titleStyle = {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: config.title,
    };

    const textStyle = {
      fontSize: typography.fontSize.sm,
      color: config.text,
      lineHeight: typography.lineHeight.normal,
    };

    return (
      <div
        ref={ref}
        style={alertStyle}
        className={`alert alert--${variant} ${className}`}
        role="alert"
        {...rest}
      >
        {icon ? (
          <div
            style={{
              fontSize: typography.fontSize.lg,
              display: 'flex',
              alignItems: 'center',
              color: config.text,
            }}
          >
            {icon}
          </div>
        ) : (
          <span style={{ fontSize: '20px', color: config.text }}>{config.icon}</span>
        )}

        <div style={contentStyle}>
          {title && <div style={titleStyle}>{title}</div>}
          <div style={textStyle}>{children}</div>
        </div>

        {closeable && (
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: config.text,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Alert;
