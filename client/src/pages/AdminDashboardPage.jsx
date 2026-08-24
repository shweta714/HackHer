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
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Utensils, 
  Radio, 
  RefreshCw,
  ShoppingBag,
  BellRing,
  MapPin,
  Trash2,
  Phone,
  UserCheck,
  CheckCheck,
  Eye,
  Store
} from 'lucide-react';
import { queueApi, orderApi } from '../services/api';
import { getSocket, joinLocationRoom } from '../services/socket';
import { playChime } from '../utils/audio';

export default function AdminDashboardPage() {
  const [canteenId, setCanteenId] = useState('main-campus');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'waiting' | 'preparing' | 'ready' | 'completed'

  const fetchStatus = async () => {
    try {
      const res = await queueApi.getQueueStatus(canteenId);
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
    joinLocationRoom(canteenId);

    const socket = getSocket();
    const handleQueueUpdate = () => {
      console.log('📡 Real-time update in Admin Kitchen Console');
      fetchStatus();
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('token_served', handleQueueUpdate);

    const interval = setInterval(fetchStatus, 4000);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('token_served', handleQueueUpdate);
      clearInterval(interval);
    };
  }, [canteenId]);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Update Status for specific order
  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      playChime('tick');
      const res = await orderApi.updateStatus(orderId, newStatus, canteenId);
      if (res.data?.success) {
        showNotification(`Order #${orderId} marked as '${newStatus.replace('_', ' ')}'!`);
        fetchStatus();
      }
    } catch (err) {
      console.error('Update status error:', err);
      showNotification('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Remove / Clear Completed User from Queue
  const handleRemoveOrder = async (orderId, studentName) => {
    try {
      playChime('tick');
      await orderApi.removeOrder(orderId, canteenId);
      showNotification(`Removed order #${orderId} (${studentName || 'Student'}) from queue.`);
      fetchStatus();
    } catch (err) {
      console.error('Remove order error:', err);
      showNotification('Failed to remove order.');
    }
  };

  // Advance Queue / Serve Next
  const handleServeNext = async () => {
    setActionLoading(true);
    try {
      playChime('serving');
      const res = await queueApi.serveNext(canteenId);
      if (res.data?.success) {
        showNotification(res.data.message);
        fetchStatus();
      }
    } catch (err) {
      console.error('Serve next error:', err);
      showNotification('Failed to advance queue.');
    } finally {
      setActionLoading(false);
    }
  };

  // Adjust Active Staff Counters (+ / -)
  const handleCounterChange = async (delta) => {
    if (!queueData) return;
    const currentCounters = queueData.activeCounters || 2;
    const newCounters = Math.max(1, currentCounters + delta);
    try {
      playChime('tick');
      await queueApi.updateConfig(canteenId, { activeCounters: newCounters });
      showNotification(`Updated kitchen staff counters to ${newCounters}`);
      fetchStatus();
    } catch (err) {
      console.error('Counter update error:', err);
    }
  };

  // Seed Demo Data for Instant Presentation
  const handleSeedDemo = async () => {
    try {
      playChime('success');
      await queueApi.seedDemo(canteenId);
      showNotification(`Demo orders loaded for ${canteenId === 'main-campus' ? 'Main Campus Canteen' : 'Block B Canteen'}!`);
      fetchStatus();
    } catch (err) {
      console.error('Seed demo error:', err);
    }
  };

  // Reset Queue
  const handleResetQueue = async () => {
    if (window.confirm('Are you sure you want to reset this canteen queue? All active orders will be cleared.')) {
      try {
        playChime('tick');
        await queueApi.resetQueue(canteenId);
        showNotification('Queue cleanly reset.');
        fetchStatus();
      } catch (err) {
        console.error('Reset error:', err);
      }
    }
  };

  if (loading && !queueData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Loading Canteen Kitchen Console...</p>
      </div>
    );
  }

  const {
    canteenName = 'Canteen',
    shopName = 'Main Campus Central Canteen & Food Court',
    address = 'Ground Floor, Student Activity Center (SAC), North Campus, University Avenue',
    location = 'Ground Floor, SAC Building',
    activeOrders = [],
    waitingOrders = [],
    preparingOrders = [],
    readyOrders = [],
    completedOrders = [],
    activeQueueCount = 0,
    averageServiceTime = 2,
    activeCounters = 2,
    overallQueueETA = 0,
    rushHourStatus,
    completedCount = 0,
  } = queueData || {};

  // Filter orders according to active tab
  let displayedOrders = activeOrders;
  if (activeTab === 'waiting') displayedOrders = waitingOrders;
  else if (activeTab === 'preparing') displayedOrders = preparingOrders;
  else if (activeTab === 'ready') displayedOrders = readyOrders;
  else if (activeTab === 'completed') displayedOrders = completedOrders;
  else displayedOrders = [...activeOrders, ...readyOrders];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in transition-colors duration-200">
      
      {/* CANTEEN SHOP & TOTAL ADDRESS HERO HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Shop Name & Total Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                Shop / Canteen Details
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                🟢 Live Kitchen Console
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {shopName || canteenName}
            </h1>

            {/* Total Physical Address */}
            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Full Address:</strong> {address}</span>
            </div>
          </div>

          {/* Canteen Switcher Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setCanteenId('main-campus')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                canteenId === 'main-campus'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Main Campus Canteen
            </button>
            <button
              onClick={() => setCanteenId('block-b')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                canteenId === 'block-b'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Block B Canteen
            </button>
          </div>
        </div>

        {/* Counter Adjustment & Quick Actions Strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Active Counters Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Staff Counters:
            </span>
            <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => handleCounterChange(-1)}
                disabled={activeCounters <= 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
                title="Decrease Counter"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm font-mono text-teal-600 dark:text-teal-400">
                {activeCounters}
              </span>
              <button
                onClick={() => handleCounterChange(1)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Increase Counter"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-400 hidden md:inline">
              (~{averageServiceTime}m avg service)
            </span>
          </div>

          {/* Quick Demo Utility Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleServeNext}
              disabled={actionLoading || activeOrders.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Advance Queue</span>
            </button>

            <button
              onClick={handleSeedDemo}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              title="Pre-populate realistic active orders"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>Seed Demo Orders</span>
            </button>

            <button
              onClick={handleResetQueue}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors"
              title="Reset Queue"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-teal-500 text-white font-bold text-xs text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 4 LIVE STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Waiting in Line
          </span>
          <div className="text-3xl font-black text-amber-500 font-mono">
            {waitingOrders.length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Orders placed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            In Preparation
          </span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {preparingOrders.length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Cooking in kitchen</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ready at Counter
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {readyOrders.length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Awaiting pickup</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Completed Orders
          </span>
          <div className="text-3xl font-black text-slate-700 dark:text-slate-300 font-mono">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Fulfilled & picked up</span>
        </div>
      </div>

      {/* CATEGORIZED ORDERS TABS (Who's order is active, complete, in waiting) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Order Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active Queue ({activeOrders.length + readyOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('waiting')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'waiting'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🟡 Waiting ({waitingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('preparing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'preparing'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🔵 In Kitchen ({preparingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'ready'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🟢 Ready ({readyOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'completed'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🏁 Completed ({completedOrders.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {activeCounters} Active Kitchen Counters
          </span>
        </div>

        {/* ORDER CARDS LIST */}
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No orders in '{activeTab}' category
            </p>
            <p className="text-xs text-slate-500">
              {activeTab === 'completed' 
                ? 'When orders are collected and completed, they will appear here.'
                : 'Click "Seed Demo Orders" above to populate sample orders for instant testing!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedOrders.map((ord) => (
              <div
                key={ord.orderId || ord._id}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-sm ${
                  ord.status === 'almost_ready'
                    ? 'border-amber-500/60 shadow-amber-500/5'
                    : ord.status === 'ready'
                    ? 'border-emerald-500/60 shadow-emerald-500/5'
                    : ord.status === 'completed'
                    ? 'border-slate-200 dark:border-slate-800/60 opacity-80'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left Order Information */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Big Token Avatar */}
                  <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-mono font-bold shrink-0 border ${
                    ord.status === 'ready'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : ord.status === 'almost_ready'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : ord.status === 'completed'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase">Token</span>
                    <span className="text-xl font-black leading-tight">#{ord.tokenNumber}</span>
                  </div>

                  {/* Customer & Order Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                        Order #{ord.orderId}
                      </span>
                      
                      {/* Customer / Student Name */}
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        {ord.customerName}
                      </span>

                      {/* Phone if available */}
                      {ord.customerPhone && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3" />
                          {ord.customerPhone}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'almost_ready'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : ord.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'preparing'
                          ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                          : ord.status === 'completed'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                      {(ord.items || []).map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    {/* Secondary Metrics */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium flex-wrap">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">Total: ₹{ord.totalAmount}</span>
                      <span>•</span>
                      <span>Pos: #{ord.position || '-'}</span>
                      <span>•</span>
                      <span>Est. Wait: ~{ord.predictedWait || 0}m</span>
                      {ord.placedAt && (
                        <>
                          <span>•</span>
                          <span>Placed: {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Status Actions & User Remover */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  {/* Status Progression Actions */}
                  {ord.status === 'placed' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.orderId, 'preparing')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Start Preparing
                    </button>
                  )}

                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.orderId, 'almost_ready')}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>Almost Ready (Notify)</span>
                    </button>
                  )}

                  {(ord.status === 'almost_ready' || ord.status === 'preparing') && (
                    <button
                      onClick={() => handleUpdateStatus(ord.orderId, 'ready')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Ready</span>
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.orderId, 'completed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Order Picked Up & Complete</span>
                    </button>
                  )}

                  {/* USER REMOVER BUTTON (If order is complete or needs removal) */}
                  {ord.status === 'completed' ? (
                    <button
                      onClick={() => handleRemoveOrder(ord.orderId, ord.customerName)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 transition-all font-bold text-xs flex items-center gap-1.5"
                      title="Remove finished user from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove User</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveOrder(ord.orderId, ord.customerName)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove / Cancel user order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
