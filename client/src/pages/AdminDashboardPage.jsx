import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  FastForward, 
  RotateCcw, 
  Sparkles, 
  BarChart3, 
  Settings2, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Coffee,
  Utensils,
  Volume2
} from 'lucide-react';
import { queueApi } from '../services/api';
import { getSocket, joinLocationRoom } from '../services/socket';
import StatusBadge from '../components/StatusBadge';
import { playChime } from '../utils/audio';

export default function AdminDashboardPage() {
  const [locationId, setLocationId] = useState('campus-canteen');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servingLoading, setServingLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await queueApi.getQueueStatus(locationId);
      if (res.data?.success) {
        setQueueData(res.data.data);
      }
    } catch (err) {
      console.error('Admin fetch status error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    joinLocationRoom(locationId);

    const socket = getSocket();
    const handleQueueUpdate = () => {
      console.log('📡 Real-time update in Admin Console');
      fetchStatus();
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('token_served', handleQueueUpdate);

    const interval = setInterval(fetchStatus, 5000);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('token_served', handleQueueUpdate);
      clearInterval(interval);
    };
  }, [locationId]);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Serve Next Action
  const handleServeNext = async () => {
    setServingLoading(true);
    try {
      playChime('serving');
      const res = await queueApi.serveNext(locationId);
      if (res.data?.success) {
        showNotification(res.data.message);
        fetchStatus();
      }
    } catch (err) {
      console.error('Error serving next:', err);
      showNotification('Error serving next customer.');
    } finally {
      setServingLoading(false);
    }
  };

  // Update Counters or Service time
  const handleConfigChange = async (updates) => {
    try {
      playChime('tick');
      const payload = {
        activeCounters: updates.activeCounters !== undefined ? updates.activeCounters : queueData.activeCounters,
        averageServiceTime: updates.averageServiceTime !== undefined ? updates.averageServiceTime : queueData.averageServiceTime,
      };
      await queueApi.updateConfig(locationId, payload);
      fetchStatus();
      showNotification('Updated canteen queue parameters.');
    } catch (err) {
      console.error('Config update error:', err);
    }
  };

  // Seed Demo Data
  const handleSeedDemo = async () => {
    try {
      playChime('success');
      const res = await queueApi.seedDemo(locationId);
      showNotification('Demo queue dataset loaded (#12 serving, #13-#17 waiting)');
      fetchStatus();
    } catch (err) {
      console.error('Seed demo error:', err);
    }
  };

  // Reset Queue
  const handleResetQueue = async () => {
    if (window.confirm('Are you sure you want to reset this queue? All active tokens will be cleared.')) {
      try {
        playChime('tick');
        await queueApi.resetQueue(locationId);
        showNotification('Queue has been cleanly reset.');
        fetchStatus();
      } catch (err) {
        console.error('Reset error:', err);
      }
    }
  };

  if (loading && !queueData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Admin Command Center...</p>
      </div>
    );
  }

  const {
    currentServingToken,
    currentlyServing,
    peopleWaiting,
    averageServiceTime,
    activeCounters,
    waitingList = [],
    overallQueueETA,
    overallStatus,
    locationName
  } = queueData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-colors duration-200">
      
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
              Staff Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Canteen Queue Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time counter controls, token dispatch, and dynamic queue throughput.
          </p>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Demo Fast Buttons & Analytics Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDemo}
            className="px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Pre-populate 5 demo waiting customers"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seed Demo Queue</span>
          </button>

          <button
            onClick={handleResetQueue}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Reset queue state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <Link
            to="/admin/analytics"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

      {/* 4 CORE METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Currently Serving */}
        <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-gradient-to-br dark:from-slate-900 dark:to-emerald-950/30 border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Currently Serving</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </span>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono mt-2">
            #{currentServingToken > 0 ? currentServingToken : '—'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium truncate">
            {currentlyServing ? `${currentlyServing.userName} (${currentlyServing.serviceType})` : 'No order currently serving'}
          </div>
        </div>

        {/* Metric 2: People Waiting */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            People Waiting
          </span>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono mt-2">
            {peopleWaiting}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
            <span>Overall ETA: ~{overallQueueETA}m</span>
            <StatusBadge status={overallStatus} size="sm" />
          </div>
        </div>

        {/* Metric 3: Average Service Time with Adjuster */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg Service Time
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono flex items-center justify-between">
            <span>{averageServiceTime} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">min</span></span>
            
            {/* Quick Adjuster */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => handleConfigChange({ averageServiceTime: Math.max(0.5, averageServiceTime - 0.5) })}
                className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-transparent"
                title="Decrease average time"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleConfigChange({ averageServiceTime: averageServiceTime + 0.5 })}
                className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-transparent"
                title="Increase average time"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Dynamically recalibrates all waiting ETAs
          </div>
        </div>

        {/* Metric 4: Active Counters with Adjuster */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Counters
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono flex items-center justify-between">
            <span>{activeCounters} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">lanes</span></span>
            
            {/* Quick Counter Stepper */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => handleConfigChange({ activeCounters: Math.max(1, activeCounters - 1) })}
                className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-transparent"
                title="Remove 1 counter"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleConfigChange({ activeCounters: activeCounters + 1 })}
                className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-transparent"
                title="Add 1 counter"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Throughput: ~{Math.round((60 / averageServiceTime) * activeCounters)} orders / hr
          </div>
        </div>

      </div>

      {/* HUGE "SERVE NEXT" PROMINENT HERO ACTION BUTTON */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border-2 border-teal-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
            Primary Queue Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Advance the Line
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Clicking <strong>SERVE NEXT</strong> will complete token #{currentServingToken || '—'}, advance the next student, and broadcast instant real-time updates to all connected mobile screens.
          </p>
        </div>

        <div>
          <button
            onClick={handleServeNext}
            disabled={servingLoading || peopleWaiting === 0}
            className="w-full max-w-md mx-auto py-5 sm:py-6 rounded-2xl font-black text-xl sm:text-2xl uppercase tracking-wider bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500 text-slate-950 shadow-2xl shadow-teal-500/40 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-3 glow-teal"
          >
            {servingLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                <span>Advancing Queue...</span>
              </>
            ) : (
              <>
                <FastForward className="w-7 h-7 fill-slate-950" />
                <span>SERVE NEXT</span>
              </>
            )}
          </button>
          
          {peopleWaiting === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400/90 mt-2.5 font-medium">
              Queue is currently empty. Click "Seed Demo Queue" above to test the flow!
            </p>
          )}
        </div>
      </div>

      {/* LIVE QUEUE LIST TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Waiting Queue List</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{waitingList.length} customers in active queue</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Real-time synchronization via Socket.IO
          </div>
        </div>

        {/* Empty State */}
        {waitingList.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Customers in Waiting Queue</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                All tokens have been served. New customers joining at <code>/join</code> will appear here automatically in real time.
              </p>
            </div>
            <button
              onClick={handleSeedDemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 5 Demo Waiting Customers</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Position</th>
                  <th className="py-3.5 px-6">Token #</th>
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Meal / Category</th>
                  <th className="py-3.5 px-6">Calculated ETA</th>
                  <th className="py-3.5 px-6">Queue Health</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {waitingList.map((customer, index) => {
                  const isNext = index === 0;
                  return (
                    <tr
                      key={customer.tokenNumber}
                      className={`transition-colors ${
                        isNext ? 'bg-teal-500/5 hover:bg-teal-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Position */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>#{customer.position}</span>
                          {isNext && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 uppercase">
                              Next Up
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Token # */}
                      <td className="py-4 px-6 font-mono font-black text-teal-600 dark:text-teal-300 text-base">
                        #{customer.tokenNumber}
                      </td>

                      {/* Name */}
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                        {customer.userName}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-xs">
                        {customer.serviceType}
                      </td>

                      {/* ETA */}
                      <td className="py-4 px-6 font-mono text-teal-600 dark:text-teal-300 text-sm font-semibold">
                        ~{customer.estimatedWait} min
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <StatusBadge status={customer.queueStatus} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/queue/${customer.tokenNumber}?locationId=${locationId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                        >
                          View User Screen ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
