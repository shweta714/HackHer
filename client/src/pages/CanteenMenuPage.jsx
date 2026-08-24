import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Utensils, 
  Search, 
  Filter, 
  Clock, 
  Tag, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  ChevronRight,
  Star,
  Check,
  AlertCircle,
  Store,
  MapPin
} from 'lucide-react';
import { canteenApi, queueApi } from '../services/api';
import { getSocket } from '../services/socket';
import { useCart } from '../context/CartContext';
import FoodItemModal from '../components/FoodItemModal';
import { playChime } from '../utils/audio';

export default function CanteenMenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCanteen = searchParams.get('canteen') || 'main-campus';

  const [activeCanteenId, setActiveCanteenId] = useState(initialCanteen);
  const [canteens, setCanteens] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const { addToCart, totalItemsCount, subtotal, setIsDrawerOpen } = useCart();

  // Fetch Canteens and Menu
  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [canteensRes, menuRes] = await Promise.all([
        canteenApi.getAll(),
        canteenApi.getMenu({ canteenId: activeCanteenId }),
      ]);

      if (canteensRes.data?.success && canteensRes.data.data) {
        setCanteens(canteensRes.data.data);
      }

      if (menuRes.data?.success && menuRes.data.data) {
        setMenuItems(menuRes.data.data);
      }
    } catch (err) {
      console.warn('Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
    setSelectedCategory('All');
    setSearchParams({ canteen: activeCanteenId });

    const socket = getSocket();
    const handleUpdate = () => {
      fetchMenuData();
    };

    socket.on('queue_updated', handleUpdate);
    return () => {
      socket.off('queue_updated', handleUpdate);
    };
  }, [activeCanteenId]);

  const currentCanteen = canteens.find((c) => c.id === activeCanteenId) || {
    id: activeCanteenId,
    name: activeCanteenId === 'main-campus' ? 'Main Campus Canteen' : 'Block B Canteen',
    shopName: activeCanteenId === 'main-campus' ? 'Main Campus Central Canteen & Food Court' : 'Block B Fast Bites & Juice Lounge',
    address: activeCanteenId === 'main-campus' 
      ? 'Ground Floor, Student Activity Center (SAC)' 
      : '1st Floor, Block B Academic Complex',
    activeQueue: activeCanteenId === 'main-campus' ? 14 : 6,
    estimatedWait: activeCanteenId === 'main-campus' ? 12 : 7,
    categories: ['Breakfast', 'Snacks', 'Meals', 'Beverages', 'Desserts'],
  };

  const availableCategories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category)))];

  // Highest selling / People also liked ML picks (top 4 popularity)
  const popularPicks = [...menuItems]
    .sort((a, b) => (b.popularity || 90) - (a.popularity || 90))
    .slice(0, 4);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (dietFilter === 'veg' && !item.isVeg) return false;
    if (dietFilter === 'nonveg' && item.isVeg) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    playChime('tick');
    addToCart(item, activeCanteenId);
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in transition-colors duration-200">
      
      {/* CANTEEN SWITCHER TABS */}
      <div className="p-2 rounded-3xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 flex flex-col sm:flex-row gap-2 shadow-inner">
        <button
          onClick={() => setActiveCanteenId('main-campus')}
          className={`flex-1 p-4 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 text-left ${
            activeCanteenId === 'main-campus'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-teal-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold">Main Campus Canteen</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                🟢 Open
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakfast, Meals, Thalis & Snacks • SAC Building
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono block">
              {canteens.find((c) => c.id === 'main-campus')?.activeQueue || 14} in queue
            </span>
            <span className="text-[11px] text-slate-400">
              ~{canteens.find((c) => c.id === 'main-campus')?.estimatedWait || 12} min wait
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveCanteenId('block-b')}
          className={`flex-1 p-4 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 text-left ${
            activeCanteenId === 'block-b'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-teal-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold">Block B Canteen</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                🟢 Open
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Wraps, Burgers, Healthy Salads & Smoothies • Block B
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono block">
              {canteens.find((c) => c.id === 'block-b')?.activeQueue || 6} in queue
            </span>
            <span className="text-[11px] text-slate-400">
              ~{canteens.find((c) => c.id === 'block-b')?.estimatedWait || 7} min wait
            </span>
          </div>
        </button>
      </div>

      {/* FEATURED: PEOPLE ALSO LIKED — HIGHEST SELLING ML PICKS */}
      {!searchQuery && selectedCategory === 'All' && popularPicks.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-indigo-500/5 to-teal-500/10 border border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-teal-500 text-white shadow-sm">
                <Flame className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  🔥 People Also Liked — Highest Selling ML Picks
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Most popular dishes ordered by students at {currentCanteen.name}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 uppercase">
              ML Recommendations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularPicks.map((pick, idx) => (
              <div
                key={pick.id}
                onClick={() => setSelectedItem(pick)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                  <img src={pick.image} alt={pick.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-teal-500 text-white">
                    #{idx + 1} Best Seller
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{pick.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-teal-600 dark:text-teal-400 font-mono">₹{pick.price}</span>
                    <span className="text-[10px] text-slate-400 font-medium">~{pick.preparationTime}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS BAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Paneer Roll, Dosa, Coffee)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dietFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Diets
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dietFilter === 'veg'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🟢 Pure Veg
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading fresh canteen menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No food items found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group p-4 rounded-3xl glass-card glass-card-hover border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                    }}
                  />

                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.isVeg ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                  }`}>
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    ₹{item.price}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-teal-500" />
                    <span>{item.preparationTime} min prep</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 group-hover:underline hidden sm:inline">
                    Details
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="p-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING BOTTOM CART BAR */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-bounce-subtle">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-2xl shadow-teal-500/30 flex items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm font-mono">
                {totalItemsCount}
              </div>
              <div>
                <div className="text-xs text-teal-100 font-semibold">{currentCanteen.name}</div>
                <div className="text-base font-black font-mono">Total: ₹{subtotal}</div>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View Cart & Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Item Detail & Cosine Similarity Modal */}
      {selectedItem && (
        <FoodItemModal
          item={selectedItem}
          canteenId={activeCanteenId}
          onClose={() => setSelectedItem(null)}
          onItemSelect={(newItem) => setSelectedItem(newItem)}
        />
      )}
    </div>
  );
}
