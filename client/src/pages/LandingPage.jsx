import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Utensils,
  ChevronRight,
  Flame,
  ShoppingBag,
  Store,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { canteenApi, queueApi } from '../services/api';
import { useCart } from '../context/CartContext';
import FoodItemModal from '../components/FoodItemModal';
import { playChime } from '../utils/audio';

export default function LandingPage() {
  const [selectedCanteenId, setSelectedCanteenId] = useState('main-campus');
  const [canteens, setCanteens] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, setIsDrawerOpen, activeOrder } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cRes, mRes] = await Promise.all([
          canteenApi.getAll(),
          canteenApi.getMenu({ canteenId: selectedCanteenId }),
        ]);

        if (cRes.data?.success && cRes.data.data) {
          setCanteens(cRes.data.data);
        }
        if (mRes.data?.success && mRes.data.data) {
          setMenuItems(mRes.data.data);
        }
      } catch (err) {
        console.warn('Landing data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCanteenId]);

  const activeCanteenObj = canteens.find(c => c.id === selectedCanteenId) || {
    id: selectedCanteenId,
    name: selectedCanteenId === 'main-campus' ? 'Main Campus Canteen' : 'Block B Canteen',
    shopName: selectedCanteenId === 'main-campus' ? 'Main Campus Central Canteen & Food Court' : 'Block B Fast Bites & Juice Lounge',
    address: selectedCanteenId === 'main-campus' 
      ? 'Ground Floor, Student Activity Center (SAC), North Campus, University Avenue'
      : '1st Floor, Block B Academic Complex, East Wing Plaza, Engineering Block',
    activeQueue: selectedCanteenId === 'main-campus' ? 14 : 6,
    estimatedWait: selectedCanteenId === 'main-campus' ? 12 : 7,
  };

  // Top ML Highest Selling / People Also Liked items (sorted by popularity)
  const popularItems = [...menuItems]
    .sort((a, b) => (b.popularity || 90) - (a.popularity || 90))
    .slice(0, 4);

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    playChime('tick');
    addToCart(item, selectedCanteenId);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative overflow-hidden transition-colors duration-200 space-y-16 pb-20">
      
      {/* Ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-teal-500/30 text-xs font-semibold text-teal-700 dark:text-teal-300 shadow-sm backdrop-blur-md">
            <Utensils className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Smart College Canteen Queue Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Order Your Food, <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 dark:from-teal-400 dark:via-emerald-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Skip The Canteen Queue.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Order delicious meals from your college canteen, get a digital queue token, and know exactly when to collect your fresh hot food without standing in crowds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Utensils className="w-5 h-5" />
              <span>Browse Canteen Menu</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-teal-300 border border-slate-300 dark:border-teal-500/40 hover:border-teal-500 transition-all shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>1-Tap Token Generator</span>
            </Link>
          </div>

          {/* Active Order Banner if student has placed an order */}
          {activeOrder && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-left max-w-xl mx-auto shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500 text-white font-mono font-bold flex items-center justify-center text-sm">
                  #{activeOrder.tokenNumber}
                </div>
                <div>
                  <div className="text-xs font-bold text-teal-700 dark:text-teal-300">You Have an Active Token!</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Order #{activeOrder.orderId} • {activeOrder.canteenName}</div>
                </div>
              </div>
              <Link
                to={`/order/${activeOrder.orderId}?canteenId=${activeOrder.canteenId}`}
                className="px-3.5 py-2 rounded-xl bg-teal-500 text-white text-xs font-bold shadow hover:scale-105 transition-all"
              >
                Track Live
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2 CANTEENS SELECTION & LIVE QUEUE STATUS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Choose Campus Canteen
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare live queue lengths, waiting times, and menus across campus.
          </p>
        </div>

        {/* 2 Canteen Big Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Campus Canteen */}
          <div
            onClick={() => setSelectedCanteenId('main-campus')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-200 border relative overflow-hidden flex flex-col justify-between ${
              selectedCanteenId === 'main-campus'
                ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl ring-2 ring-teal-500/20'
                : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-teal-500/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                  SAC Building
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  🟢 Open (8:00 AM - 8:30 PM)
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Main Campus Canteen
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>Ground Floor, Student Activity Center (SAC)</span>
                </div>
              </div>

              {/* Specialties & Queue */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Live Queue</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {canteens.find(c => c.id === 'main-campus')?.activeQueue || 14} in line
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Wait</span>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                    ~{canteens.find(c => c.id === 'main-campus')?.estimatedWait || 12} mins
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                18 Indian Dishes • Dosa, Kathi Rolls, Thalis, Samosas, Chai
              </span>
              <Link
                to="/menu?canteen=main-campus"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow transition-all flex items-center gap-1"
              >
                <span>Full Menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Block B Canteen */}
          <div
            onClick={() => setSelectedCanteenId('block-b')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-200 border relative overflow-hidden flex flex-col justify-between ${
              selectedCanteenId === 'block-b'
                ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl ring-2 ring-teal-500/20'
                : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-teal-500/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                  Academic Plaza
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  🟢 Open (8:30 AM - 7:30 PM)
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Block B Canteen
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>1st Floor, Block B Academic Complex</span>
                </div>
              </div>

              {/* Specialties & Queue */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Live Queue</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {canteens.find(c => c.id === 'block-b')?.activeQueue || 6} in line
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Wait</span>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                    ~{canteens.find(c => c.id === 'block-b')?.estimatedWait || 7} mins
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                16 Fast Bites • Wraps, Burgers, Peri Peri Fries, Smoothies
              </span>
              <Link
                to="/menu?canteen=block-b"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow transition-all flex items-center gap-1"
              >
                <span>Full Menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CANTEEN MENU ITEMS & "PEOPLE ALSO LIKED" HIGHEST SELLING ML SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {activeCanteenObj.name} Menu
              </span>
              <span className="text-xs text-slate-500 font-medium">({menuItems.length} dishes)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              🔥 People Also Liked — Highest Selling ML Picks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Ranked by student order frequency and machine learning recommendation score.
            </p>
          </div>

          <Link
            to={`/menu?canteen=${selectedCanteenId}`}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Popular Foods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularItems.map((item, idx) => (
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

                  {/* ML Bestseller Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-500 text-white shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-300" />
                    #{idx + 1} Best Seller
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
      </section>

      {/* Item Detail & Cosine Similarity Modal */}
      {selectedItem && (
        <FoodItemModal
          item={selectedItem}
          canteenId={selectedCanteenId}
          onClose={() => setSelectedItem(null)}
          onItemSelect={(newItem) => setSelectedItem(newItem)}
        />
      )}
    </div>
  );
}
