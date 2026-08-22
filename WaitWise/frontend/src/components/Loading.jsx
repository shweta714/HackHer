import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading live queue updates...', fullPage = false }) => {
  const containerStyle = fullPage
    ? {
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }
    : {
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      };

  return (
    <div style={containerStyle}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(16, 185, 129, 0.15)',
          borderTopColor: '#10b981',
          animation: 'spin 1s linear infinite'
        }} />
        <Loader2 size={24} style={{ color: '#10b981', animation: 'spin 2s linear infinite' }} />
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
