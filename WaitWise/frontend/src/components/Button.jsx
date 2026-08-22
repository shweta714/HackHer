import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '10px',
    fontWeight: '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  };

  const sizeStyles = {
    sm: { padding: '0.45rem 0.85rem', fontSize: '0.85rem' },
    md: { padding: '0.7rem 1.35rem', fontSize: '0.95rem' },
    lg: { padding: '0.9rem 1.85rem', fontSize: '1.05rem', borderRadius: '12px' }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
      border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    outline: {
      background: 'rgba(255, 255, 255, 0.03)',
      color: 'var(--text-main)',
      border: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)'
    },
    danger: {
      background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: 'none'
    }
  };

  const combinedStyle = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      type={type}
      style={combinedStyle}
      disabled={disabled || loading}
      onClick={onClick}
      className={`ww-btn ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{
          width: '1rem',
          height: '1rem',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#ffffff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block'
        }} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
        </>
      )}
    </button>
  );
};

export default Button;
