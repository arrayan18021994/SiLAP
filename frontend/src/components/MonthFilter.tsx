import React from 'react';

interface MonthFilterProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

const MONTHS = [
  'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
];

const MonthFilter: React.FC<MonthFilterProps> = ({ currentDate, onChange }) => {
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onChange(newDate);
  };
  
  const prevMonthDate = new Date(currentDate);
  prevMonthDate.setMonth(currentDate.getMonth() - 1);
  
  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(currentDate.getMonth() + 1);

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '1rem',
      background: 'var(--bg-surface)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      marginBottom: '1.5rem',
      fontSize: '13px',
      fontWeight: '600'
    }}>
      <button 
        onClick={handlePrevMonth}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>◀</span> {MONTHS[prevMonthDate.getMonth()]} {prevMonthDate.getFullYear()}
      </button>
      
      <div style={{ 
        padding: '0.5rem 1.5rem', 
        background: 'var(--primary-color)', 
        color: 'var(--primary-text)', 
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
      
      <button 
        onClick={handleNextMonth}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {MONTHS[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()} <span>▶</span>
      </button>
    </div>
  );
};

export default MonthFilter;
