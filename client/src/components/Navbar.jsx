import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Radio, 
  Sparkles, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  User,
  GraduationCap
} from 'lucide-react';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

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
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center transition-colors duration-200">
              <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                WAIT<span className="bg-gradient-to-r from-teal-500 to-indigo-600 dark:from-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">WISE</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 uppercase tracking-widest">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">Smart Queue Intelligence</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/service/canteen-snacks"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname.startsWith('/service')
                ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            <span className="hidden sm:inline">Counters (ML)</span>
            <span className="sm:hidden">ML</span>
          </Link>

          <Link
            to="/join"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/join')
                ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            <span className="hidden sm:inline">Join Queue</span>
            <span className="sm:hidden">Join</span>
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/admin')
                ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden md:inline">Admin Console</span>
            <span className="md:hidden">Admin</span>
          </Link>

          <Link
            to="/admin/analytics"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/admin/analytics')
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="hidden md:inline">Analytics</span>
          </Link>
        </nav>

        {/* Right Controls: Theme Toggle, Auth, Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Live Socket Status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            </span>
            <span className="font-mono text-[11px]">
              {isConnected ? 'LIVE SYNC' : 'CONNECTING'}
            </span>
          </div>

          {/* User Profile & Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                isAdmin 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300'
              }`}>
                {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> : <GraduationCap className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />}
                <span className="max-w-[100px] truncate">{user?.name || user?.email?.split('@')[0]}</span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 transition-all"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Sign In Link */
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Direct CTA */}
          <Link
            to="/join"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>Get Token</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
