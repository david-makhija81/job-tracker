import React, { useState, useRef, useEffect } from 'react';

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

const PRESET_CATEGORIES = [
  'Software Engineer',
  'Data Roles',
  'DevOps/Systems',
  'AI/ML Engineer',
  'Solutions Engineer',
];

const ComboSelect = ({ label, name, value, onChange, required }) => {
  const isCustom = value && !PRESET_CATEGORIES.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  const customInputRef = useRef(null);

  useEffect(() => {
    if (showCustom && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustom]);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === '__custom__') {
      setShowCustom(true);
      onChange({ target: { name, value: '' } });
    } else {
      setShowCustom(false);
      onChange({ target: { name, value: selected } });
    }
  };

  const handleCustomChange = (e) => {
    onChange({ target: { name, value: e.target.value } });
  };

  const handleBackToSelect = () => {
    setShowCustom(false);
    onChange({ target: { name, value: '' } });
  };

  const selectValue = showCustom ? '__custom__' : (value || '');

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={labelStyle}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}

      {!showCustom ? (
        <select
          style={inputStyle}
          value={selectValue}
          onChange={handleSelectChange}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          required={required}
        >
          <option value="" disabled>
            Select a category…
          </option>
          {PRESET_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__custom__">✏️ Custom…</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            ref={customInputRef}
            style={{ ...inputStyle, flex: 1 }}
            type="text"
            placeholder="Type your category…"
            value={value}
            onChange={handleCustomChange}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            required={required}
          />
          <button
            type="button"
            onClick={handleBackToSelect}
            style={{
              background: 'none',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              transition: 'border-color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
            onMouseLeave={(e) => (e.target.style.borderColor = '#ccc')}
            title="Back to presets"
          >
            ↩
          </button>
        </div>
      )}
    </div>
  );
};

export { PRESET_CATEGORIES };
export default ComboSelect;
