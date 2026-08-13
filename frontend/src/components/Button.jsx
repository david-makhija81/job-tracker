import React from 'react';
import './Button.css';

const Button = ({ children, color = 'blue', onClick, className = '', type = 'button', href, target, rel, style, innerStyle }) => {
  if (href) {
    return (
      <a 
        href={href} 
        target={target} 
        rel={rel} 
        className={`chunky-btn chunky-btn-${color} ${className}`} 
        onClick={onClick}
        style={{ textDecoration: 'none', ...style }}
      >
        <span className="chunky-btn-inner" style={innerStyle}>
          {children}
        </span>
      </a>
    );
  }

  return (
    <button 
      className={`chunky-btn chunky-btn-${color} ${className}`}
      onClick={onClick}
      type={type}
      style={style}
    >
      <span className="chunky-btn-inner" style={innerStyle}>
        {children}
      </span>
    </button>
  );
};

export default Button;
