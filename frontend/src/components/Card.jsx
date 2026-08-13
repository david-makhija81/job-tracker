import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`glass-panel p-6 ${className}`} style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '4px solid #111',
      boxShadow: '8px 8px 0px rgba(0, 0, 0, 1)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {title && <h3 style={{
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '14px',
        margin: '-24px -24px 24px -24px',
        backgroundColor: 'var(--accent-blue)',
        color: 'white',
        borderBottom: '4px solid #111',
        borderRadius: '12px 12px 0 0',
        padding: '20px',
        textAlign: 'center'
      }}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
