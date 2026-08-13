import React from 'react';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #ccc',
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#fff',
  color: '#111'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  fontSize: '14px',
  color: 'var(--text-primary)'
};

export const Input = ({ label, required, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={labelStyle}>{label} {required && <span style={{color: 'red'}}>*</span>}</label>}
      <input 
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
        onBlur={(e) => e.target.style.borderColor = '#ccc'}
        required={required}
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, options, required, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={labelStyle}>{label} {required && <span style={{color: 'red'}}>*</span>}</label>}
      <select 
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
        onBlur={(e) => e.target.style.borderColor = '#ccc'}
        required={required}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
    </div>
  );
};
