import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Utensils,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderApi } from '../services/api';
import { playChime } from '../utils/audio';

const QUICK_STUDENT_NAMES = ['Aman Verma', 'Riya Sen', 'Shweta Sharma', 'Devansh Joshi', 'Sneha Patel'];

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    canteenId,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItemsCount,
    maxPrepTime,
    isDrawerOpen,
    setIsDrawerOpen,
    setActiveOrder,
  } = useCart();

  const [studentName, setStudentName] = useState('Shweta Sharma');
  const [studentPhone, setStudentPhone] = useState('9876543210');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isDrawerOpen) return null;

  const canteenDisplayName = canteenId === 'main-campus' ? 'Main Campus Canteen' : 'Block B Canteen';

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!studentName.trim()) {
      setError('Please enter your name to generate a token.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await orderApi.createOrder({
        canteenId,
        customerName: studentName.trim(),
        customerPhone: studentPhone.trim(),
        items,
        notes: orderNotes,
      });

      if (res.data?.success && res.data.data) {
        playChime('success');
        const orderData = res.data.data;
        
        // Save to active order context
        setActiveOrder({
          orderId: orderData.orderId,
          tokenNumber: orderData.tokenNumber,
          canteenId,
          canteenName: orderData.canteenName,
          customerName: studentName,
          totalAmount: subtotal,
          placedAt: new Date().toISOString(),
        });

        // Clear cart & close drawer
        clearCart();
        setIsDrawerOpen(false);

        // Direct navigate to Live Digital Queue Tracker
        navigate(`/order/${orderData.orderId}?canteenId=${canteenId}`);
      } else {
        setError(res.data?.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.response?.data?.message || 'Could not connect to kitchen order server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Canteen Order</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{canteenDisplayName}</p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">Your cart is empty</p>
                <p className="text-xs text-slate-500">Explore the menu and add delicious food items to skip the line!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Itemized list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Selected Items ({totalItemsCount})</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-500 hover:text-rose-600 text-[11px] font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((it) => (
                  <div
                    key={it.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {it.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-teal-600 dark:text-teal-400 font-mono">
                          ₹{it.price} each
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {it.preparationTime}m
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateQuantity(it.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs font-mono text-slate-900 dark:text-white">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(it.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                        ₹{it.price * it.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student Details Form */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Student Details
                </div>

                {/* Quick Select Buttons */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Quick-select Demo Student:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_STUDENT_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setStudentName(name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          studentName === name
                            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500/50'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aman Verma"
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number (for pickup notification)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Est. Kitchen Prep Time
                  </span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                    ~{maxPrepTime} mins
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Digital Queue Fee</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE (MVP)</span>
                </div>
                <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">Total Amount</span>
                  <span className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <button
              onClick={handleConfirmOrder}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order • ₹{subtotal}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              No real payment needed for demo. Generates your digital queue token instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
