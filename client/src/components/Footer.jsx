import React from 'react';
import { Clock, Heart, Sparkles, Shield, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                WAIT<span className="text-teal-600 dark:text-teal-400">WISE</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Stop Waiting. Start Living.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Real-Time ETA Forecasts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>ML-Powered Queue Intelligence</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for HackHer 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
