import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Users, 
  Zap, 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  Calendar,
  Flame
} from 'lucide-react';
import { queueApi } from '../services/api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await queueApi.getAnalytics('campus-canteen');
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !analytics) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Compiling Canteen Queue Analytics...</p>
      </div>
    );
  }

  const {
    peopleServedToday = 0,
    currentPeopleWaiting = 0,
    averageWaitTime = 2,
    peakQueuePeriod = '12:30 PM - 2:00 PM (Lunch Rush)',
    timeSavedFormatted = '1.2 hrs',
    totalMinutesSaved = 70,
    activeCounters = 2,
    hourlyTraffic = []
  } = analytics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Console</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Queue Intelligence & Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time throughput metrics, wait time reduction, and canteen peak load forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Today's Active Session</span>
        </div>
      </div>

      {/* 4 CORE ANALYTICS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: People Served Today */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">People Served Today</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {peopleServedToday} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">students</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Orders fulfilled at counters</p>
        </div>

        {/* Metric 2: Current People Waiting */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Waiting</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {currentPeopleWaiting} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">in line</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active waiting tokens</p>
        </div>

        {/* Metric 3: Average Wait Time */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Service Speed</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {averageWaitTime} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">min/meal</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Across {activeCounters} active counters</p>
        </div>

        {/* Metric 4: Peak Queue Period */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peak Rush Period</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono leading-tight mt-1">
            {peakQueuePeriod}
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-300 font-medium">Highest canteen traffic</p>
        </div>

      </div>

      {/* SPECIAL METRIC: Total Physical Waiting Time Saved */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-50 via-slate-50 to-indigo-50 dark:from-teal-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-teal-500/40 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Smart Impact Metric</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Estimated Physical Standing Time Saved
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Without WAITWISE, students spend an average of <strong>14 minutes standing in a physical line</strong> per meal. By providing remote digital queueing with real-time ETA tracking, users wait from comfortable locations and only walk up when ready.
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-white/80 dark:bg-slate-950/60 px-3.5 py-2 rounded-xl inline-block border border-slate-200 dark:border-slate-800">
              Calculation: ({peopleServedToday} Served × 14 min physical standing avoided) = <strong>{totalMinutesSaved} minutes saved</strong>
            </div>
          </div>

          <div className="lg:col-span-4 text-center lg:text-right">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-teal-500/40 inline-block text-center shadow-xl">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest">Total Time Saved Today</span>
              <div className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
                {timeSavedFormatted}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">productive student hours returned</div>
            </div>
          </div>

        </div>
      </div>

      {/* HOURLY CANTEEN TRAFFIC DISTRIBUTION */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Hourly Canteen Rush Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Order volume distribution across campus dining hours</p>
          </div>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-mono">Live Simulation Model</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {hourlyTraffic.map((item) => {
            const isPeak = item.count >= 24;
            return (
              <div
                key={item.hour}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isPeak
                    ? 'bg-teal-500/10 border-teal-500/40 ring-1 ring-teal-500/30'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80'
                }`}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.hour}</div>
                <div className={`text-2xl font-black font-mono my-2 ${isPeak ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                  {item.count}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
