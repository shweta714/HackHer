import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  BellRing, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Utensils, 
  ChevronRight,
  TrendingUp,
  Tag,
  Binary
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { queueApi, serviceApi } from '../services/api';
import { getSocket } from '../services/socket';

export default function LandingPage() {
  const [queueState, setQueueState] = useState({
    currentServingToken: 12,
    peopleWaiting: 5,
    averageServiceTime: 2,
    activeCounters: 2,
    overallQueueETA: 5,
    overallStatus: 'Normal',
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch live queue status
    const fetchStatus = async () => {
      try {
        const res = await queueApi.getQueueStatus('campus-canteen');
        if (res.data?.success && res.data.data) {
          setQueueState(res.data.data);
        }
      } catch (err) {
        console.warn('Using default preview state');
      }
    };
    fetchStatus();

    // Fetch all services for discovery
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getAll();
        if (res.data?.success && res.data.data) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.warn('Services fetch notice:', err);
      }
    };
    fetchServices();

    // Socket listener for live preview updates
    const socket = getSocket();
    const handleUpdate = () => {
      fetchStatus();
      fetchServices();
    };
    socket.on('queue_updated', handleUpdate);

    return () => {
      socket.off('queue_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="relative overflow-hidden transition-colors duration-200">
      {/* Glow ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-teal-500/30 text-xs font-semibold text-teal-700 dark:text-teal-300 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>ML Queue Intelligence & Content-Based Recommender</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Stop Waiting in Line. <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 dark:from-teal-400 dark:via-emerald-300 dark:to-indigo-400 bg-clip-text text-transparent">
                Know When to Arrive.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              WAITWISE eliminates crowded physical queues at campus canteens. Grab a digital token, explore <strong className="text-teal-600 dark:text-teal-300">ML-powered similar counters</strong> with Cosine Similarity, and arrive exactly when your food is ready.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/join"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Utensils className="w-5 h-5" />
                <span>Join Canteen Queue</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                to="/service/canteen-snacks"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-teal-300 border border-slate-300 dark:border-teal-500/40 hover:border-teal-500 transition-all duration-200 shadow-md shadow-teal-500/5"
              >
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Explore ML Recommender</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-left">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">0 mins</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Physical line standing</div>
              </div>
              <div>
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">Cosine Sim</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">ML Recommendations</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">Real-Time</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Predicted Wait Times</div>
              </div>
            </div>
          </div>

          {/* Right Live Interactive Queue Simulation Preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/30 to-indigo-500/30 blur-xl opacity-75 animate-pulse-slow"></div>

              <div className="relative rounded-2xl glass-panel p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-2xl space-y-6">
                
                {/* Header Widget */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Campus Central Canteen</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Live Queue Status</p>
                    </div>
                  </div>
                  <StatusBadge status={queueState.overallStatus} size="sm" />
                </div>

                {/* Main Numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Currently Serving</span>
                    <div className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-2">
                      #{queueState.currentServingToken || '—'}
                      <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">People Waiting</span>
                    <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {queueState.peopleWaiting}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5 font-sans">students</span>
                    </div>
                  </div>
                </div>

                {/* Real-time ETA banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 via-teal-100/50 to-indigo-50 dark:from-teal-950/60 dark:to-indigo-950/60 border border-teal-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-teal-800 dark:text-teal-300">Predicted Wait For New Orders</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                      ~{queueState.overallQueueETA} mins
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                    <div>{queueState.activeCounters} Active Counters</div>
                    <div>{queueState.averageServiceTime}m / customer</div>
                  </div>
                </div>

                {/* Sample Token Banner */}
                <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                    <span className="text-slate-700 dark:text-slate-300">Ready to join? Grab your token now.</span>
                  </div>
                  <Link to="/join" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5">
                    Join <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CANTEEN COUNTERS & ML RECOMMENDER EXPLORER SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/90 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                <Binary className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Machine Learning Add-on Feature</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Explore Canteen Counters & Similar Items
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Click on any counter below to view its live queue, predicted wait time, and <strong className="text-teal-600 dark:text-teal-300">Cosine Similarity-based recommendations</strong>.
              </p>
            </div>

            <Link
              to="/service/canteen-snacks"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
            >
              <span>View Main Canteen - Snacks Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 8 Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => (
              <Link
                key={srv.id}
                to={`/service/${srv.id}`}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {srv.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      {srv.crowdLevel} Crowd
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {srv.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Wait & Action */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="font-mono text-teal-600 dark:text-teal-300 font-bold">
                    ⏱ ~{srv.predictedWait} min
                  </div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 group-hover:text-teal-600 dark:group-hover:text-teal-300 font-semibold flex items-center gap-1">
                    Details & Recs <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">The Problem & Solution</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Stand in Lines When Technology Can Wait for You?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black">
                  ✕
                </div>
                <h3 className="text-xl font-bold text-rose-700 dark:text-rose-300">The Traditional Physical Queue</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Wasted Breaks:</strong> Standing for 20+ minutes in a cramped, noisy canteen line between classes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Zero Visibility:</strong> No idea how long food preparation or order fulfillment will take.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Counter Chaos:</strong> Aggressive crowding, pushed orders, and stressed canteen staff.</span>
                </li>
              </ul>
            </div>

            {/* The WAITWISE Way */}
            <div className="p-8 rounded-2xl bg-teal-50/80 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/30 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300">The WAITWISE Experience</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">•</span>
                  <span><strong>Zero Physical Waiting:</strong> Relax with friends, study in library, or stay in class until your turn is near.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">•</span>
                  <span><strong>Predictive Live ETA:</strong> Dynamic algorithms compute exact waiting minutes based on active counters.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">•</span>
                  <span><strong>ML Similar Counter Discovery:</strong> Content-Based Cosine Similarity suggests fast alternative snacks and meals.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Simple 3-Step Flow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How WAITWISE Works in Practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Counter & View ML Matches</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose your favorite canteen counter, see live predicted wait times, and discover similar fast alternatives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Real-Time ETA</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Watch your position decrement live as counter staff serves orders. ETA adapts dynamically without page refresh.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Walk Over When Alerted</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get an alert when you are within 3 minutes of the front. Walk up, show your token, and collect your meal fresh!
              </p>
            </div>

          </div>

          {/* Bottom Banner */}
          <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-50 via-slate-100 to-indigo-50 dark:from-teal-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-300 dark:border-slate-700/80 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ready to experience ML-driven smart dining?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm">
              Try the live interactive demo right now. Join the queue as a student or explore similar counter recommendations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/join"
                className="px-6 py-3 rounded-xl bg-teal-500 text-white dark:text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all"
              >
                Get a Token Now
              </Link>
              <Link
                to="/service/canteen-snacks"
                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Explore ML Recommender
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
