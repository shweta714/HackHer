import React from 'react';

export default function ProgressRing({ position = 1, totalInQueue = 5, size = 160, strokeWidth = 12 }) {
  // If position is 0 (being served), 100% progress
  const safeTotal = Math.max(totalInQueue, position, 1);
  const progressRatio = position === 0 ? 1 : Math.max(0, Math.min(1, (safeTotal - position + 1) / safeTotal));
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background track */}
        <circle
          className="text-slate-200 dark:text-slate-800 transition-colors"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Progress bar */}
        <circle
          className="text-teal-500 dark:text-teal-400 transition-all duration-700 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {position === 0 ? (
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 animate-pulse">SERVED</span>
        ) : (
          <>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">#{position}</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">in line</span>
          </>
        )}
      </div>
    </div>
  );
}
