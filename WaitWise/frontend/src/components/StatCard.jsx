import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  badgeText,
  color = 'emerald' // 'emerald', 'cyan', 'purple', 'amber'
}) => {
  const colorMap = {
    emerald: {
      bgLight: 'rgba(16, 185, 129, 0.12)',
      text: '#10b981',
      border: 'rgba(16, 185, 129, 0.25)',
      glow: '0 8px 24px -6px rgba(16, 185, 129, 0.25)'
    },
    cyan: {
      bgLight: 'rgba(6, 182, 212, 0.12)',
      text: '#06b6d4',
      border: 'rgba(6, 182, 212, 0.25)',
      glow: '0 8px 24px -6px rgba(6, 182, 212, 0.25)'
    },
    purple: {
      bgLight: 'rgba(139, 92, 246, 0.12)',
      text: '#8b5cf6',
      border: 'rgba(139, 92, 246, 0.25)',
      glow: '0 8px 24px -6px rgba(139, 92, 246, 0.25)'
    },
    amber: {
      bgLight: 'rgba(245, 158, 11, 0.12)',
      text: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.25)',
      glow: '0 8px 24px -6px rgba(245, 158, 11, 0.25)'
    }
  };

  const theme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: theme.glow
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.text
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.35rem' }}>
        <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {value}
        </h3>
        {badgeText && (
          <span style={{
            fontSize: '0.75rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '20px',
            background: theme.bgLight,
            color: theme.text,
            fontWeight: 700
          }}>
            {badgeText}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        {subtitle && (
          <span style={{ color: 'var(--text-dim)' }}>
            {subtitle}
          </span>
        )}
        {change && (
          <span style={{
            color: isPositive ? '#10b981' : '#f43f5e',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
