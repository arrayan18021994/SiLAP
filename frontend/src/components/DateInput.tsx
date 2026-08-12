import React, { useState, useEffect, useRef } from 'react';

interface DateInputProps {
  name: string;
  value?: string | null;
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Convert YYYY-MM-DD to DD/MM/YYYY
const toDisplayFormat = (val?: string | null): string => {
  if (!val) return '';
  const str = String(val).trim();
  if (str.includes('/')) return str; // Already DD/MM/YYYY
  const parts = str.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y.length === 4) {
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }
  return str;
};

// Convert DD/MM/YYYY to YYYY-MM-DD
const toISOFormat = (val?: string | null): string => {
  if (!val) return '';
  const str = String(val).trim();
  if (str.includes('-') && str.split('-')[0].length === 4) return str; // Already YYYY-MM-DD
  const parts = str.split('/');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    if (y.length === 4) {
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }
  return str;
};

const DateInput: React.FC<DateInputProps> = ({
  name,
  value = '',
  onChange,
  placeholder = 'dd/mm/yyyy',
  required = false,
  disabled = false,
  className = '',
  style
}) => {
  const [displayValue, setDisplayValue] = useState<string>(toDisplayFormat(value));
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(toDisplayFormat(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^0-9/]/g, '');
    
    // Auto-insert slashes
    if (input.length === 2 && !input.includes('/')) {
      input = input + '/';
    } else if (input.length === 5 && input.split('/').length === 2) {
      input = input + '/';
    }

    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    setDisplayValue(input);
    const isoVal = toISOFormat(input);
    onChange({ target: { name, value: isoVal } });
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value; // YYYY-MM-DD
    const disp = toDisplayFormat(isoVal);
    setDisplayValue(disp);
    onChange({ target: { name, value: isoVal } });
  };

  const openCalendar = () => {
    if (hiddenDateRef.current && typeof hiddenDateRef.current.showPicker === 'function') {
      hiddenDateRef.current.showPicker();
    } else if (hiddenDateRef.current) {
      hiddenDateRef.current.focus();
      hiddenDateRef.current.click();
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleTextChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={className}
        style={{
          width: '100%',
          paddingRight: '2.5rem',
          ...style
        }}
      />
      <button
        type="button"
        onClick={openCalendar}
        disabled={disabled}
        tabIndex={-1}
        style={{
          position: 'absolute',
          right: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.25rem'
        }}
        title="Pilih Tanggal"
      >
        📅
      </button>
      <input
        type="date"
        ref={hiddenDateRef}
        value={toISOFormat(displayValue)}
        onChange={handleNativeDateChange}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 0,
          height: 0,
          right: 0,
          bottom: 0
        }}
        tabIndex={-1}
      />
    </div>
  );
};

export default DateInput;
export { toDisplayFormat, toISOFormat };
