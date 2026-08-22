import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { tokenApi, queueApi } from '../services/api';
import { getSocket, joinLocationRoom } from '../services/socket';
import StatusBadge from '../components/StatusBadge';
import ProgressRing from '../components/ProgressRing';
import { playChime } from '../utils/audio';

export default function UserDashboardPage() {
  const { tokenNumber } = useParams();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('locationId') || 'campus-canteen';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAlertedApproaching, setHasAlertedApproaching] = useState(false);
  const [hasCelebratedServing, setHasCelebratedServing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch token details
  const fetchDetails = async () => {
    try {
      const res = await tokenApi.getTokenDetails(tokenNumber, locationId);
      if (res.data?.success && res.data.data) {
        const tokenData = res.data.data;
        setData(tokenData);
        setError(null);

        // Near-turn notification check
        if (tokenData.isNearTurn && tokenData.token?.status === 'waiting' && !hasAlertedApproaching) {
          playChime('approaching');
          setHasAlertedApproaching(true);
        }

        // Serving celebration check
        if (tokenData.token?.status === 'serving' && !hasCelebratedServing) {
          playChime('serving');
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
          setHasCelebratedServing(true);
        }
      } else {
        setError(res.data?.message || 'Token not found.');
      }
    } catch (err) {
      console.error('Fetch token error:', err);
      setError(err.response?.data?.message || 'Unable to retrieve token details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    joinLocationRoom(locationId);

    // Socket.io real-time listener
    const socket = getSocket();

    const handleQueueUpdate = () => {
      console.log('📡 Real-time queue update received on User Dashboard');
      fetchDetails();
    };

    const handleTokenServed = (payload) => {
      if (parseInt(payload.tokenNumber, 10) === parseInt(tokenNumber, 10)) {
        fetchDetails();
      }
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('token_served', handleTokenServed);

    // Backup polling every 5s for extreme reliability
    const interval = setInterval(fetchDetails, 5000);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('token_served', handleTokenServed);
      clearInterval(interval);
    };
  }, [tokenNumber, locationId]);

  const handleCancelToken = async () => {
    if (window.confirm('Are you sure you want to cancel your token and leave the queue?')) {
      try {
        await tokenApi.cancelToken(tokenNumber, locationId);
        fetchDetails();
      } catch (err) {
        alert('Could not cancel token.');
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Connecting to live queue intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Token Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error || 'This token number is either invalid or expired.'}</p>
        </div>
        <Link
          to="/join"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white dark:text-slate-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Join Queue Again</span>
        </Link>
      </div>
    );
  }

  const { token, position, peopleAhead, estimatedWait, queueStatus, isNearTurn, locationName, currentServingToken } = data;
  const isServing = token.status === 'serving';
  const isCompleted = token.status === 'completed';
  const isCancelled = token.status === 'cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 transition-colors duration-200">
      
      {/* Top Bar with Back & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/join"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Join</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Token'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[11px] font-mono text-teal-700 dark:text-teal-300">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>LIVE SYNC ACTIVE</span>
          </div>
        </div>
      </div>

      {/* STATE 1: SERVING CELEBRATION BANNER */}
      {isServing && (
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-100 dark:from-emerald-950/80 dark:via-teal-900/60 dark:to-slate-900 border-2 border-emerald-500 dark:border-emerald-400 shadow-2xl animate-glow text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest animate-pulse">
            <PartyPopper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>It's Your Turn Right Now!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Please Proceed to the Canteen Counter
          </h2>

          <p className="text-sm text-slate-700 dark:text-emerald-200/90 max-w-lg mx-auto">
            Token <strong className="text-emerald-700 dark:text-white font-mono text-base">#{token.tokenNumber}</strong> is currently being called. Show this screen to the counter staff to collect your order.
          </p>
        </div>
      )}

      {/* STATE 2: NEAR-TURN PROMINENT NOTIFICATION (3-5 min remaining) */}
      {!isServing && isNearTurn && token.status === 'waiting' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-gradient-to-r dark:from-amber-950/80 dark:via-amber-900/40 dark:to-slate-900 border-2 border-amber-500 dark:border-amber-400/80 shadow-xl glow-amber animate-pulse-slow">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                  Turn Alert
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono">
                  ~{estimatedWait} mins away
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">🔔 Your turn is approaching!</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Please make your way towards the canteen counter now. You are <strong className="text-amber-700 dark:text-amber-300">#{position} in line</strong> ({peopleAhead} {peopleAhead === 1 ? 'person' : 'people'} ahead).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: COMPLETED OR CANCELLED */}
      {isCompleted && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Token Served & Completed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Thank you for using WAITWISE! Enjoy your meal.</p>
        </div>
      )}

      {isCancelled && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-rose-200 dark:border-rose-500/30 text-center space-y-2">
          <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Token Cancelled</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">This token was removed from the active queue.</p>
        </div>
      )}

      {/* MAIN DASHBOARD CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{locationName}</span>
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{token.serviceType}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Customer: <span className="text-teal-700 dark:text-teal-300">{token.userName}</span>
            </h1>
          </div>
          <StatusBadge status={queueStatus} size="md" />
        </div>

        {/* Big 4-Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Your Token */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-teal-500/30 relative overflow-hidden">
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Your Token</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mt-1">
              #{token.tokenNumber}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium">
              Status: <strong className={isServing ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>{token.status}</strong>
            </div>
          </div>

          {/* 2. People Ahead */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">People Ahead</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {isServing ? 0 : peopleAhead}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              ahead in line
            </div>
          </div>

          {/* 3. Current Position */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Position</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {isServing ? 'Now' : `#${position}`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Serving: #{currentServingToken || '—'}
            </div>
          </div>

          {/* 4. Estimated Wait */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-50 dark:from-slate-900 dark:to-teal-950/40 border border-teal-500/30">
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">Estimated Wait</span>
            <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
              {isServing ? '0' : estimatedWait} <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">min</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Intelligent live ETA
            </div>
          </div>

        </div>

        {/* Visual Progress Section */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <ProgressRing position={isServing ? 0 : position} totalInQueue={position + 4} size={110} strokeWidth={10} />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isServing 
                  ? 'Active at Counter!' 
                  : position === 1 
                  ? 'You are next in line!' 
                  : `${peopleAhead} orders being prepared before yours`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                "You don't need to stand in line yet. We'll let you know when your turn is getting close."
              </p>
            </div>
          </div>

          {/* Live Counter Parameters */}
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span>Active Counters:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{data.activeCounters}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Avg Service Speed:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{data.averageServiceTime}m / order</strong>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        {token.status === 'waiting' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Screen syncs automatically. No manual refresh needed.</span>
            </div>

            <button
              onClick={handleCancelToken}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors"
            >
              Cancel Token & Leave Queue
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
