import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Utensils, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  Coffee,
  Sandwich,
  Pizza
} from 'lucide-react';
import { queueApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { playChime } from '../utils/audio';

const QUICK_NAMES = ['Aarav Patel', 'Priya Sharma', 'Rohan Gupta', 'Sneha Verma', 'Devansh Joshi'];

const SERVICE_TYPES = [
  { id: 'Main Meal (Thali)', label: 'Main Meal (Thali / Lunch)', icon: Utensils, desc: 'Full hot lunch & meal platters' },
  { id: 'Sandwich & Snacks', label: 'Sandwich & Quick Bites', icon: Sandwich, desc: 'Rolls, sandwiches, samosas' },
  { id: 'Hot Beverages', label: 'Tea, Coffee & Cold Drinks', icon: Coffee, desc: 'Fresh chai, cappuccino, coolers' },
  { id: 'Fast Food Combos', label: 'Burger & Noodles Combo', icon: Pizza, desc: 'Quick-fry canteen specials' },
];

export default function JoinQueuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryLoc = searchParams.get('locationId') || 'campus-canteen';
  const querySrv = searchParams.get('service');

  const [locationId, setLocationId] = useState(queryLoc);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [serviceType, setServiceType] = useState(() => {
    if (querySrv) {
      if (querySrv.includes('Snack')) return 'Sandwich & Snacks';
      if (querySrv.includes('Coffee') || querySrv.includes('Juice') || querySrv.includes('Beverage')) return 'Hot Beverages';
      if (querySrv.includes('Fast Food')) return 'Fast Food Combos';
      return 'Main Meal (Thali)';
    }
    return 'Main Meal (Thali)';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live queue status preview
  const [queueStatus, setQueueStatus] = useState(null);

  // Success state receipt
  const [issuedToken, setIssuedToken] = useState(null);

  // Fetch current queue state
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await queueApi.getQueueStatus(locationId);
        if (res.data?.success) {
          setQueueStatus(res.data.data);
        }
      } catch (err) {
        console.warn('Queue status check error:', err);
      }
    };
    fetchStatus();
  }, [locationId]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name to receive a token.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await queueApi.joinQueue({
        locationId,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        serviceType,
      });

      if (res.data?.success) {
        playChime('success');
        setIssuedToken(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to join queue.');
      }
    } catch (err) {
      console.error('Join error:', err);
      setError(err.response?.data?.message || 'Server error joining queue. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  // If token is generated, show the stylish Token Receipt Card
  if (issuedToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 transition-colors duration-200">
        <div className="relative rounded-3xl glass-panel p-8 border border-teal-500/40 shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-10 h-10 animate-bounce-subtle" />
          </div>

          <div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Queue Joined Successfully
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Your Token is Ready!</h2>
          </div>

          {/* Big Token Number Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-teal-500/30 shadow-inner">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Token Number</div>
            <div className="text-5xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight my-2">
              #{issuedToken.token?.tokenNumber}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {issuedToken.token?.userName} • {issuedToken.token?.serviceType}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Your Position</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">#{issuedToken.position} in line</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estimated Wait</div>
              <div className="text-xl font-bold text-teal-600 dark:text-teal-300 font-mono">~{issuedToken.estimatedWait} mins</div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You do not need to stand in line. We'll update your screen live when your turn approaches!
          </p>

          <button
            onClick={() => navigate(`/queue/${issuedToken.token?.tokenNumber}?locationId=${locationId}`)}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Open Live Tracking Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 transition-colors duration-200">
      
      {/* Page Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300">
          <Utensils className="w-3.5 h-3.5" />
          <span>Campus Canteen Digital Queue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Join the Queue & Get Your Token
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Skip the physical crowd. Enter your details below to get an instant token and track your wait live.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">

        {/* Live Queue Health Banner */}
        {queueStatus && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Current Queue Load</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {queueStatus.peopleWaiting} people waiting • Serving #{queueStatus.currentServingToken || '—'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Est. wait: <strong className="text-teal-600 dark:text-teal-300 font-mono">~{queueStatus.overallQueueETA} mins</strong>
              </span>
              <StatusBadge status={queueStatus.overallStatus} size="sm" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-6">

          {/* Location Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Select Canteen Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocationId('campus-canteen')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  locationId === 'campus-canteen'
                    ? 'bg-teal-500/10 border-teal-500/50 text-slate-900 dark:text-white ring-1 ring-teal-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <MapPin className={`w-5 h-5 ${locationId === 'campus-canteen' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-bold">Campus Central Canteen</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Main Dining Hall & Counters</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocationId('snack-bar')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  locationId === 'snack-bar'
                    ? 'bg-teal-500/10 border-teal-500/50 text-slate-900 dark:text-white ring-1 ring-teal-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Coffee className={`w-5 h-5 ${locationId === 'snack-bar' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-bold">Quick Bites & Juice Bar</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Snacks & Beverage Kiosk</div>
                </div>
              </button>
            </div>
          </div>

          {/* Service / Counter Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Select Meal Category / Counter
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_TYPES.map((st) => {
                const Icon = st.icon;
                const isSelected = serviceType === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setServiceType(st.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-slate-900 dark:text-white ring-1 ring-indigo-500/40'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{st.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{st.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Enter Customer Information
            </label>

            {/* Name Input with quick suggestion buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Your Name <span className="text-teal-600 dark:text-teal-400">*</span></span>
                <span className="text-[11px] text-slate-500">Quick-fill for demo:</span>
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Quick suggestions pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setUserName(name)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition-all"
                  >
                    + {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone / Student ID (Optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Phone Number or Student ID <span className="text-slate-500">(Optional for SMS alerts)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210 / STU-2026"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Digital Token...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Join Queue & Generate Token</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
