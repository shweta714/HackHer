import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Tag, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Flame, 
  Info,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { canteenApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { playChime } from '../utils/audio';

export default function FoodItemModal({ item, onClose, onItemSelect, canteenId }) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setLoadingRecs(true);

    const fetchRecs = async () => {
      try {
        const res = await canteenApi.getRecommendations(item.id, 4, canteenId);
        if (res.data?.success && res.data.recommendations) {
          setRecommendations(res.data.recommendations);
        }
      } catch (err) {
        console.warn('Recommendation fetch notice:', err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecs();
  }, [item, canteenId]);

  if (!item) return null;

  const handleAdd = () => {
    playChime('tick');
    addToCart({ ...item, quantity }, canteenId || item.canteenId);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
      setIsDrawerOpen(true);
    }, 400);
  };

  const getSpiceBadge = (spice) => {
    if (spice === 'Spicy') return <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1 font-medium"><Flame className="w-3 h-3" /> Spicy</span>;
    if (spice === 'Medium') return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 font-medium"><Flame className="w-3 h-3" /> Medium</span>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    item.isVeg 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-rose-500/90 text-white'
                  }`}>
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                    {item.category}
                  </span>
                  {getSpiceBadge(item.spiceLevel)}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {item.name}
                </h2>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                  ₹{item.price}
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-end gap-1 font-medium mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-teal-300" />
                  <span>{item.preparationTime} min prep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Info */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {item.description}
            </p>

            {/* Tags Feature Space */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-500" />
                  <span>Taste & Characteristics</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ML CONTENT-BASED RECOMMENDATIONS (Cosine Similarity) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      ✨ People Also Liked
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Recommended via Machine Learning Similarity & Popularity
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  Cosine Math
                </span>
              </div>

              {loadingRecs ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Computing feature similarity...</p>
                </div>
              ) : recommendations.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No similar items found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onItemSelect && onItemSelect(rec)}
                      className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-500/5 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all duration-200 flex items-center gap-3 relative"
                    >
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {rec.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">₹{rec.price}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {rec.preparationTime}m
                          </span>
                        </div>

                        {/* Similarity Score Pill */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 font-mono">
                            <Sparkles className="w-2.5 h-2.5" />
                            {rec.similarityPercentage}% Match
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">🟢 Available</span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm font-mono text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              addedAnimation
                ? 'bg-emerald-500 shadow-emerald-500/25 scale-[0.98]'
                : 'bg-gradient-to-r from-teal-500 to-indigo-600 shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ₹{item.price * quantity}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
