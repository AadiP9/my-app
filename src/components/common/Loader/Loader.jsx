import React from 'react';
import './Loader.css';

const Loader = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  fullscreen = false,
  overlay = false,
  className = ''
}) => {
  const containerClasses = [
    'loader-container',
    fullscreen && 'loader-fullscreen',
    overlay && 'loader-overlay',
    `loader-${color}`,
    className
  ].filter(Boolean).join(' ');

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <div className={`spinner spinner-${size}`} />;
      
      case 'dots':
        return (
          <div className="dots-loader">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        );
      
      case 'pulse':
        return <div className="pulse-loader" />;
      
      case 'bars':
        return (
          <div className="bars-loader">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        );
      
      case 'ring':
        return <div className="ring-loader" />;
      
      default:
        return <div className={`spinner spinner-${size}`} />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="loader-content">
        {renderLoader()}
        {text && (
          <div className={`loader-text loader-text-${size}`}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

// Specific loader components for common use cases
export const PageLoader = ({ text = 'Loading...' }) => (
  <Loader 
    type="spinner" 
    size="lg" 
    text={text} 
    fullscreen 
  />
);

export const ComponentLoader = ({ text }) => (
  <Loader 
    type="spinner" 
    size="md" 
    text={text} 
  />
);

export const ButtonLoader = () => (
  <Loader 
    type="spinner" 
    size="sm" 
    className="inline-loader" 
  />
);

export const OverlayLoader = ({ text = 'Processing...' }) => (
  <Loader 
    type="spinner" 
    size="lg" 
    text={text} 
    overlay 
  />
);

export default Loader;