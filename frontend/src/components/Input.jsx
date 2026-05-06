import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Input Component
 * Flexible input field with validation support
 * 
 * @component
 * @example
 * <Input placeholder="Email" type="email" />
 * <Input label="Password" type="password" error="Password required" />
 * <Input icon={<IconComponent />} />
 */
const Input = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      disabled = false,
      icon = null,
      iconPosition = 'left',
      variant = 'default',
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, spacing, typography, borderRadius, transitions } = designTokens;

    const sizeStyles = {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
        height: designTokens.sizes.input.sm,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
        height: designTokens.sizes.input.md,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
        height: designTokens.sizes.input.lg,
      },
    };

    const inputStyle = {
      ...sizeStyles[size],
      width: '100%',
      border: error ? `2px solid ${colors.error[500]}` : `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.md,
      fontFamily: typography.fontFamily.primary,
      backgroundColor: disabled ? colors.background.tertiary : colors.background.primary,
      color: disabled ? colors.text.disabled : colors.text.primary,
      transition: transitions.base,
      outline: 'none',
      boxSizing: 'border-box',
      paddingLeft: icon && iconPosition === 'left' ? `calc(${spacing[10]})` : undefined,
      paddingRight: icon && iconPosition === 'right' ? `calc(${spacing[10]})` : undefined,
    };

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[2],
      position: 'relative',
    };

    const iconStyle = {
      position: 'absolute',
      top: '50%',
      [iconPosition]: spacing[3],
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      color: error ? colors.error[500] : colors.text.secondary,
    };

    return (
      <div style={containerStyle} className={`input-field ${className}`}>
        {label && (
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: error ? colors.error[500] : colors.text.primary,
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            style={inputStyle}
            disabled={disabled}
            className={error ? 'input--error' : ''}
            {...rest}
          />
          {icon && <div style={iconStyle}>{icon}</div>}
        </div>

        {error && (
          <span
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.error[500],
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {error}
          </span>
        )}

        {hint && !error && (
          <span
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['default', 'filled', 'underline']),
  className: PropTypes.string,
};

export default Input;
