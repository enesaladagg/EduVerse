import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../design-system/tokens';

/**
 * Modal Component
 * Dialog overlay component for important user interactions
 * 
 * @component
 * @example
 * <Modal isOpen={true} onClose={handleClose} title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>Cancel</Button>
 *     <Button variant="primary">Confirm</Button>
 *   </Modal.Footer>
 * </Modal>
 */
const Modal = React.forwardRef(
  (
    {
      isOpen,
      onClose,
      children,
      title,
      size = 'md',
      closeButton = true,
      className = '',
      ...rest
    },
    ref
  ) => {
    const { colors, spacing, borderRadius, shadows, zIndex } = designTokens;

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const sizeMap = {
      sm: '384px',
      md: '512px',
      lg: '768px',
      xl: '1024px',
    };

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: designTokens.colors.overlay.dark,
            zIndex: zIndex.modal - 1,
          }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          ref={ref}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: colors.background.primary,
            borderRadius: borderRadius.xl,
            boxShadow: shadows[5],
            zIndex: zIndex.modal,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            width: sizeMap[size],
          }}
          className={`modal modal--${size} ${className}`}
          onClick={(e) => e.stopPropagation()}
          {...rest}
        >
          {/* Header */}
          {title && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing[6],
                borderBottom: `1px solid ${colors.border.light}`,
              }}
            >
              <h2
                style={{
                  fontSize: designTokens.typography.fontSize['2xl'],
                  fontWeight: designTokens.typography.fontWeight.bold,
                  margin: 0,
                  color: colors.text.primary,
                }}
              >
                {title}
              </h2>
              {closeButton && (
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: colors.text.secondary,
                    padding: 0,
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div style={{ padding: spacing[6] }}>{children}</div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';

// Modal subcomponent for footer
const ModalFooter = ({ children, className = '', ...rest }) => {
  const { spacing, colors } = designTokens;

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[3],
        justifyContent: 'flex-end',
        padding: spacing[6],
        borderTop: `1px solid ${colors.border.light}`,
      }}
      className={`modal-footer ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeButton: PropTypes.bool,
  className: PropTypes.string,
};

ModalFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Modal.Footer = ModalFooter;

export default Modal;
