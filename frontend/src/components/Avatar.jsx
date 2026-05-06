import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Avatar Component
 * Display user profile images or initials
 * 
 * @component
 * @example
 * <Avatar src="image.jpg" alt="John Doe" />
 * <Avatar initials="JD" />
 * <Avatar status="online" />
 */
const Avatar = React.forwardRef(
  (
    {
      src,
      alt = 'Avatar',
      initials,
      size = 'md',
      variant = 'circle',
      status,
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, borderRadius } = designTokens;

    const sizeMap = {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '56px',
      xl: '72px',
    };

    const size_value = sizeMap[size];

    const containerStyle = {
      position: 'relative',
      width: size_value,
      height: size_value,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary[100],
      border: `2px solid ${colors.background.primary}`,
      borderRadius: variant === 'circle' ? borderRadius.full : borderRadius.md,
      flexShrink: 0,
      overflow: 'hidden',
    };

    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    };

    const initialsStyle = {
      fontSize: size === 'xs' || size === 'sm' ? '12px' : '14px',
      fontWeight: 'bold',
      color: colors.primary[700],
      textTransform: 'uppercase',
    };

    const statusSizeMap = {
      xs: '6px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
    };

    const statusStyle = {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: statusSizeMap[size],
      height: statusSizeMap[size],
      borderRadius: borderRadius.full,
      border: `2px solid ${colors.background.primary}`,
      backgroundColor:
        status === 'online'
          ? colors.success[500]
          : status === 'offline'
            ? colors.neutral[400]
            : colors.warning[500],
    };

    return (
      <div
        ref={ref}
        style={containerStyle}
        className={`avatar avatar--${size} avatar--${variant} ${className}`}
        {...rest}
      >
        {src ? (
          <img src={src} alt={alt} style={imageStyle} />
        ) : initials ? (
          <span style={initialsStyle}>{initials}</span>
        ) : (
          <span style={initialsStyle}>?</span>
        )}

        {status && <div style={statusStyle} />}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  initials: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['circle', 'square']),
  status: PropTypes.oneOf(['online', 'offline', 'away']),
  className: PropTypes.string,
};

export default Avatar;
