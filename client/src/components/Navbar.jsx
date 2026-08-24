import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  User, 
  GraduationCap, 
  Utensils, 
  PlusCircle,
  Store
} from 'lucide-react';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import { playChime } from '../utils/audio';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItemsCount, setIsDrawerOpen, activeOrder } = useCart();
  const [isConnected, setIsConnected] = useState(false);

  const isKitchenAdminPage = location.pathname.startsWith('/admin') || (isAdmin && !location.pathname.startsWith('/menu') && !location.pathname.startsWith('/join'));

  useEffect(() => {
    const socket = getSocket();
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    playChime('tick');
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link to={isKitchenAdminPage ? "/admin" : "/"} className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center transition-colors duration-200">
              {isKitchenAdminPage ? (
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Utensils className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                WAIT<span className="bg-gradient-to-r from-teal-500 to-indigo-600 dark:from-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">WISE</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                isKitchenAdminPage
                  ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
                  : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20'
              }`}>
                {isKitchenAdminPage ? 'Kitchen Admin' : 'Canteen'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
              {isKitchenAdminPage ? 'Live Counter Order Management' : 'Smart Canteen Queue Intelligence'}
            </p>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        {isKitchenAdminPage ? (
          /* ========================================================================= */
          /* KITCHEN ADMIN NAVIGATION (NO Menu, NO Get Token, NO Cart)                 */
          /* ========================================================================= */
          <nav className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kitchen Console</span>
            </span>
          </nav>
        ) : (
          /* ========================================================================= */
          /* STUDENT NAVIGATION                                                        */
          /* ========================================================================= */
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Canteens</span>
            </Link>

            <Link
              to="/menu"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive('/menu')
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Menu</span>
            </Link>

            <Link
              to="/join"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive('/join')
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-500" />
              <span className="hidden sm:inline">Get Token</span>
              <span className="sm:hidden">Token</span>
            </Link>

            {activeOrder && (
              <Link
                to={`/order/${activeOrder.orderId}?canteenId=${activeOrder.canteenId}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  location.pathname.startsWith('/order') || location.pathname.startsWith('/queue')
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Token #{activeOrder.tokenNumber}</span>
              </Link>
            )}
          </nav>
        )}

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Cart Trigger (ONLY for students, hidden on Kitchen Admin) */}
          {!isKitchenAdminPage && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-600 dark:text-teal-400 hover:text-white border border-teal-500/30 transition-all"
              title="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-teal-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-950">
                  {totalItemsCount}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* AUTHENTICATION: SIGN IN / SIGN OUT CONTROLS */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-1">
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
                  isKitchenAdminPage ? 'bg-indigo-600' : 'bg-teal-500'
                }`}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm"
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-500" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Live Socket Status Dot */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-emerald-500/50 shadow-sm' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'Live' : 'Connecting'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
