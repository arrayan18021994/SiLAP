import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  buttonText = 'Mengerti',
  onClose
}) => {
  if (!isOpen) return null;

  const getTypeTheme = () => {
    switch (type) {
      case 'error':
        return {
          icon: '⚠️',
          iconBg: '#fee2e2',
          badgeColor: '#dc2626',
          headerTitle: title || 'Pemberitahuan Sistem'
        };
      case 'success':
        return {
          icon: '✓',
          iconBg: '#dcfce7',
          badgeColor: '#16a34a',
          headerTitle: title || 'Berhasil'
        };
      case 'warning':
        return {
          icon: '⚡',
          iconBg: '#fef3c7',
          badgeColor: '#d97706',
          headerTitle: title || 'Peringatan Sistem'
        };
      default:
        return {
          icon: 'ℹ️',
          iconBg: '#fef08a',
          badgeColor: '#1e3a8a',
          headerTitle: title || 'Informasi Sistem'
        };
    }
  };

  const theme = getTypeTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          width: '90%',
          maxWidth: '440px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          border: '2px solid #facc15'
        }}
      >
        {/* Navy Header */}
        <div
          style={{
            background: '#1e3a8a',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '3px solid #facc15'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#facc15',
              color: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}
          >
            {theme.icon}
          </div>
          <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, flex: 1 }}>
            {theme.headerTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#93c5fd',
              fontSize: '1.4rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.5rem 1.25rem 1.5rem', background: '#fafafa' }}>
          <p style={{ margin: 0, color: '#334155', fontSize: '0.925rem', lineHeight: '1.6', wordBreak: 'break-word' }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#1e3a8a',
                color: '#facc15',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.2)',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#1e40af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#1e3a8a';
              }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
