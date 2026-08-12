import React from 'react';

interface LogoProps {
  style?: React.CSSProperties;
  className?: string;
  hideText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ style, className, hideText }) => {
  if (hideText) {
    return (
      <div 
        className={className}
        style={{ 
          ...style, 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        <img 
          src="/logo.png" 
          alt="SiLAP Logo" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }} 
        />
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="SiLAP Logo" 
      style={{ ...style, maxWidth: '100%', objectFit: 'contain' }} 
      className={className} 
    />
  );
};

export default Logo;
