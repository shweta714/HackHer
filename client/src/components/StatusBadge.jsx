import React from 'react';

export default function StatusBadge({ status = 'Normal', size = 'md' }) {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500 dark:bg-emerald-400',
          pulse: 'bg-emerald-500/50 dark:bg-emerald-400/50',
          label: '🟢 Normal Flow',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500 dark:bg-amber-400',
          pulse: 'bg-amber-500/50 dark:bg-amber-400/50',
          label: '🟡 Moderate Wait',
        };
      case 'high wait':
      case 'high':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400',
          dot: 'bg-rose-500 dark:bg-rose-400',
          pulse: 'bg-rose-500/50 dark:bg-rose-400/50',
          label: '🔴 High Wait',
        };
      default:
        return {
          bg: 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-400',
          dot: 'bg-teal-500 dark:bg-teal-400',
          pulse: 'bg-teal-500/50 dark:bg-teal-400/50',
          label: status,
        };
    }
  };

  const current = getStyles();
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-4 py-1.5 text-sm font-semibold' 
    : 'px-3 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-md transition-all ${current.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulse}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span>{current.label}</span>
    </span>
  );
}
