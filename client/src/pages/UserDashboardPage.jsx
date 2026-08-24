import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  BellRing,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowLeft,
  Share2,
  XCircle,
  PartyPopper,
  Info,
  Utensils,
  Store,
  ChefHat,
  ShoppingBag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderApi, queueApi } from '../services/api';
import { getSocket, joinLocationRoom } from '../services/socket';
import { playChime } from '../utils/audio';

export default function UserDashboardPage() {
  const { orderId, tokenNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const identifier = orderId || tokenNumber;
  const canteenParam = searchParams.get('canteenId') || searchParams.get('locationId') || 'main-campus';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAlertedApproaching, setHasAlertedApproaching] = useState(false);
  const [hasCelebratedReady, setHasCelebratedReady] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch Order/Token Tracking Details
  const fetchDetails = async () => {
    if (!identifier) return;
    try {
      const res = await orderApi.getOrderDetails(identifier, canteenParam);
      if (res.data?.success && res.data.data) {
        const orderData = res.data.data;
        setData(orderData);
        setError(null);

        // Near-turn notification check (orders ahead <= 2 or almost_ready)
        if (orderData.isNearTurn && orderData.status !== 'ready' && orderData.status !== 'completed' && !hasAlertedApproaching) {
          playChime('approaching');
          setHasAlertedApproaching(true);
        }

        // Ready for pickup celebration
        if (orderData.status === 'ready' && !hasCelebratedReady) {
          playChime('serving');
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
          setHasCelebratedReady(true);
        }
      } else {
        setError(res.data?.message || 'Order not found.');
      }
    } catch (err) {
      console.warn('Fetch order error:', err);
      setError(err.response?.data?.message || `Unable to find Order #${identifier}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    joinLocationRoom(canteenParam);

    const socket = getSocket();
    const handleQueueUpdate = () => {
      console.log('📡 Real-time update in User Queue Tracker');
      fetchDetails();
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on(`order_${identifier}`, handleQueueUpdate);

    const interval = setInterval(fetchDetails, 4000);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off(`order_${identifier}`, handleQueueUpdate);
      clearInterval(interval);
    };
  }, [identifier, canteenParam]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel your order and leave the queue?')) {
      try {
        await orderApi.removeOrder(identifier, canteenParam);
        playChime('tick');
        navigate('/menu');
      } catch (err) {
        console.error('Cancel order error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Connecting to Canteen Kitchen...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500">
          <XCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {error || `We couldn't locate order #${identifier}.`}
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-xs shadow-md"
        >
          <Utensils className="w-4 h-4" />
          <span>Browse Canteen Menu</span>
        </Link>
      </div>
    );
  }

  const {
    orderId: displayOrderId = identifier,
    tokenNumber: displayTokenNum = 1,
    canteenName = 'Main Campus Canteen',
    shopName = 'Main Campus Central Canteen & Food Court',
    address = 'Ground Floor, Student Activity Center (SAC)',
    status = 'placed',
    position = 1,
    ordersAhead = 0,
    predictedWait = 5,
    isNearTurn = false,
    customerName = 'Student',
    items = [],
    totalAmount = 0,
    placedAt,
  } = data;

  const isReady = status === 'ready';
  const isCompleted = status === 'completed';
  const isPreparing = status === 'preparing' || status === 'almost_ready';

  // 5 Status Steps
  const STEPS = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'In Kitchen' },
    { key: 'almost_ready', label: 'Almost Ready' },
    { key: 'ready', label: 'Ready for Pickup' },
  ];

  const getStepIndex = (st) => {
    if (st === 'placed') return 0;
    if (st === 'confirmed') return 1;
    if (st === 'preparing') return 2;
    if (st === 'almost_ready') return 3;
    if (st === 'ready' || st === 'completed') return 4;
    return 0;
  };

  const currentStepIdx = getStepIndex(status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in transition-colors duration-200">
      
      {/* Top Header Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Copy Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share Token'}</span>
          </button>

          {!isCompleted && !isReady && (
            <button
              onClick={handleCancelOrder}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl text-xs font-medium transition-colors"
              title="Cancel Order"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* READY FOR PICKUP BANNER (Celebration) */}
      {isReady && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 space-y-2 text-center animate-bounce-subtle">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto text-white">
            <PartyPopper className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black">Your Food is Ready for Pickup! 🎉</h2>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Please walk over to Counter #1 at {canteenName} with Token #{displayTokenNum} to collect your hot meal.
          </p>
        </div>
      )}

      {/* NEAR TURN ALERT BANNER */}
      {isNearTurn && !isReady && !isCompleted && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/25 flex items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-100">Near-Turn Alert 🔔</div>
            <div className="text-base font-extrabold">Your turn is arriving next! Walk towards {canteenName}.</div>
            <div className="text-xs text-amber-100">Only {ordersAhead} order(s) ahead of you.</div>
          </div>
        </div>
      )}

      {/* MAIN DIGITAL TOKEN CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
        
        {/* Token Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                Digital Queue Token
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                Live Sync
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {canteenName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>{address}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase">Student</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{customerName}</div>
            <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400">Order #{displayOrderId}</div>
          </div>
        </div>

        {/* Big Center Token Number Display */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-teal-500/30 text-center space-y-2 shadow-inner relative overflow-hidden">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            Your Live Token Number
          </div>
          <div className="text-7xl sm:text-8xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight my-2">
            #{displayTokenNum}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Status: {status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* 3 Real-time Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Queue Position</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              #{position} in line
            </div>
            <span className="text-[11px] text-slate-400">{ordersAhead} order(s) ahead</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Predicted Wait Time</span>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
              ~{predictedWait} mins
            </div>
            <span className="text-[11px] text-slate-400">Dynamic ML prediction</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Amount</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{totalAmount}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Digital Pass Active</span>
          </div>
        </div>

        {/* 5-Stage Live Progress Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Preparation Progress
          </div>

          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="space-y-2 text-center">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isPassed
                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-xs font-bold block truncate ${
                      isCurrent
                        ? 'text-teal-600 dark:text-teal-400 scale-105'
                        : isPassed
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Food Items List */}
        {items && items.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Your Ordered Dishes</span>
              <span>{items.length} item(s)</span>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 dark:text-white">{it.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono font-semibold">
                      x{it.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹{it.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
