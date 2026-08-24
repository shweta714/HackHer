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
  Pizza,
  Store
} from 'lucide-react';
import { queueApi, orderApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { playChime } from '../utils/audio';

const QUICK_NAMES = ['Aman Verma', 'Riya Sen', 'Shweta Sharma', 'Devansh Joshi', 'Sneha Patel'];

const CANTEEN_OPTIONS = [
  { 
    id: 'main-campus', 
    name: 'Main Campus Canteen', 
    shopName: 'Main Campus Central Canteen & Food Court',
    address: 'Ground Floor, Student Activity Center (SAC)',
    specialties: 'Masala Dosa, Paneer Roll, North Indian Thali, Samosa',
    prefix: 'MC'
  },
  { 
    id: 'block-b', 
    name: 'Block B Canteen', 
    shopName: 'Block B Fast Bites & Juice Lounge',
    address: '1st Floor, Block B Academic Complex, East Wing Plaza',
    specialties: 'Paneer Wrap, Crispy Burger, Peri Peri Fries, Smoothies',
    prefix: 'BB'
  },
];

const MEAL_TYPES = [
  { id: 'Quick Snack & Drink', label: 'Quick Snack & Drink', icon: Sandwich, desc: 'Rolls, sandwiches, fries & coffee' },
  { id: 'Full Lunch / Meal', label: 'Full Meal / Thali Combo', icon: Utensils, desc: 'Hot thali, biryani, fried rice' },
  { id: 'Breakfast Special', label: 'Breakfast Special', icon: Pizza, desc: 'Dosa, idli sambar, chole bhature' },
  { id: 'Beverage & Dessert', label: 'Beverage & Dessert', icon: Coffee, desc: 'Cold coffee, tea, juices & shakes' },
];

export default function JoinQueuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveOrder } = useCart();

  const queryLoc = searchParams.get('canteen') || searchParams.get('locationId') || 'main-campus';
  const [canteenId, setCanteenId] = useState(queryLoc);
  const [userName, setUserName] = useState('Shweta Sharma');
  const [userPhone, setUserPhone] = useState('9876543210');
  const [serviceType, setServiceType] = useState('Quick Snack & Drink');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live status preview
  const [queueStatus, setQueueStatus] = useState(null);

  // Success state receipt
  const [issuedToken, setIssuedToken] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await queueApi.getQueueStatus(canteenId);
        if (res.data?.success) {
          setQueueStatus(res.data.data);
        }
      } catch (err) {
        console.warn('Queue status check error:', err);
      }
    };
    fetchStatus();
  }, [canteenId]);

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name to generate a token.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await orderApi.createOrder({
        canteenId,
        customerName: userName.trim(),
        customerPhone: userPhone.trim(),
        serviceType,
      });

      if (res.data?.success && res.data.data) {
        playChime('success');
        const data = res.data.data;
        setIssuedToken(data);

        // Update active order context
        setActiveOrder({
          orderId: data.orderId,
          tokenNumber: data.tokenNumber,
          canteenId,
          canteenName: data.canteenName,
          customerName: userName,
          placedAt: new Date().toISOString(),
        });
      } else {
        setError(res.data?.message || 'Failed to generate token.');
      }
    } catch (err) {
      console.error('Join error:', err);
      setError(err.response?.data?.message || 'Server error generating token.');
    } finally {
      setLoading(false);
    }
  };

  // If token is generated, show the stylish Token Receipt Card
  if (issuedToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 transition-colors duration-200 animate-fade-in">
        <div className="relative rounded-3xl glass-panel p-8 border border-teal-500/40 shadow-2xl text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-10 h-10 animate-bounce-subtle" />
          </div>

          <div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Digital Queue Joined
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Your Token is Generated!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{issuedToken.canteenName}</p>
          </div>

          {/* Big Token Number Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-teal-500/30 shadow-inner">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Your Digital Token</div>
            <div className="text-6xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight my-2">
              #{issuedToken.tokenNumber}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Order #{issuedToken.orderId} • {issuedToken.order?.customerName}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Your Position</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">#{issuedToken.position} in line</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Predicted Wait</div>
              <div className="text-xl font-bold text-teal-600 dark:text-teal-300 font-mono">~{issuedToken.predictedWait} mins</div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You don't need to wait in the physical line. We will update your screen live and chime when your turn is ready!
          </p>

          <button
            onClick={() => navigate(`/order/${issuedToken.orderId}?canteenId=${canteenId}`)}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Track Live Queue Screen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const selectedCanteenObj = CANTEEN_OPTIONS.find(c => c.id === canteenId) || CANTEEN_OPTIONS[0];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in transition-colors duration-200">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>1-Tap Digital Token Generator</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Generate Canteen Token
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choose your canteen and get a digital queue token instantly without waiting in line.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleGenerateToken} className="space-y-6">
          
          {/* 1. Canteen Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              1. Choose Campus Canteen
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CANTEEN_OPTIONS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCanteenId(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    canteenId === c.id
                      ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Open</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{c.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Quick Demo Student Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              2. Student Name
            </label>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[11px] text-slate-400 w-full mb-0.5">Quick-select Demo Name:</span>
              {QUICK_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setUserName(name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    userName === name
                      ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter student name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              3. Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* 4. Meal Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              4. Meal Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MEAL_TYPES.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setServiceType(m.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      serviceType === m.id
                        ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-500/30'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{m.label}</div>
                      <div className="text-[10px] text-slate-400">{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue Live Preview Box */}
          {queueStatus && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Current Queue at {selectedCanteenObj.name}:
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                {queueStatus.activeQueueCount} waiting (~{queueStatus.overallQueueETA} min wait)
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Digital Token Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
