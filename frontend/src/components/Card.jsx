import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Card Component
 * Container component for grouping related content
 * 
 * @component
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 */
const Card = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      hoverable = false,
      interactive = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, spacing, borderRadius, shadows } = designTokens;

    const variantStyles = {
      default: {
        background: colors.background.primary,
        border: `1px solid ${colors.border.light}`,
        boxShadow: shadows[1],
      },
      elevated: {
        background: colors.background.primary,
        boxShadow: shadows[2],
      },
      outline: {
        background: colors.background.secondary,
        border: `2px solid ${colors.border.medium}`,
        boxShadow: 'none',
      },
      filled: {
        background: colors.background.tertiary,
        border: 'none',
        boxShadow: 'none',
      },
    };

    const style = {
      ...variantStyles[variant],
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      transition: designTokens.transitions.base,
      cursor: interactive ? 'pointer' : 'default',
      ...(hoverable && {
        '&:hover': {
          boxShadow: shadows[3],
          transform: 'translateY(-2px)',
        },
      }),
    };

    return (
      <div
        ref={ref}
        style={style}
        className={`card card--${variant} ${hoverable ? 'card--hoverable' : ''} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
const CardHeader = ({ children, className = '', ...rest }) => {
  const { spacing, typography, borderRadius } = designTokens;

  return (
    <div
      style={{
        marginBottom: spacing[4],
        paddingBottom: spacing[4],
        borderBottom: `1px solid ${designTokens.colors.border.light}`,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: designTokens.colors.text.primary,
      }}
      className={`card-header ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card-body ${className}`} {...rest}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...rest }) => {
  const { spacing, colors } = designTokens;

  return (
    <div
      style={{
        marginTop: spacing[4],
        paddingTop: spacing[4],
        borderTop: `1px solid ${colors.border.light}`,
        display: 'flex',
        gap: spacing[3],
      }}
      className={`card-footer ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'outline', 'filled']),
  hoverable: PropTypes.bool,
  interactive: PropTypes.bool,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
