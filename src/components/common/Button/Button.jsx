import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const loadingClass = loading ? 'btn-loading' : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';
  
  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    loadingClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon-left" style={{ marginRight: '8px' }}>
          {icon}
        </span>
      )}
      
      {!loading && children}
      
      {icon && iconPosition === 'right' && (
        <span className="btn-icon-right" style={{ marginLeft: '8px' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

// Icon Button Component
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  ...props
}) => {
  const iconSizeClass = `btn-icon-${size}`;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`btn-icon ${iconSizeClass}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`btn-group ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Button;