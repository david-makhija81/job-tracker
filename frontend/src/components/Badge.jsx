import React from 'react';
import './Badge.css';

const Badge = ({ children, color = 'blue', tilt = 0, style = {}, className = '' }) => {
  return (
    <div 
      className={`floating-badge badge-${color} ${className}`}
      style={{
        transform: `rotate(${tilt}deg)`,
        ...style
      }}
    >
      <div className="badge-inner">
        {children}
      </div>
    </div>
  );
};

export default Badge;
