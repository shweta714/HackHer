import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Utensils, 
  Coffee, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Flame,
  Binary,
  Layers,
  ChevronRight
} from 'lucide-react';
import { serviceApi } from '../services/api';
import { getSocket } from '../services/socket';
import StatusBadge from '../components/StatusBadge';
import { playChime } from '../utils/audio';

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Service Details and ML Recommendations
  const fetchServiceAndRecs = async () => {
    setLoading(true);
    setRecsLoading(true);
    setError(null);

    try {
      // 1. Fetch Service Details
      const serviceRes = await serviceApi.getById(serviceId);
      if (serviceRes.data?.success && serviceRes.data.data) {
        setService(serviceRes.data.data);
      } else {
        setError('Service not found.');
        setLoading(false);
        return;
      }
      setLoading(false);

      // 2. Fetch ML Content-Based Cosine Similarity Recommendations
      const recsRes = await serviceApi.getRecommendations(serviceId, 4);
      if (recsRes.data?.success && recsRes.data.recommendations) {
        setRecommendations(recsRes.data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching service/recommendations:', err);
      setError(err.response?.data?.message || 'Could not load service details.');
    } finally {
      setLoading(false);
      setRecsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAndRecs();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const socket = getSocket();
    const handleUpdate = () => {
      console.log('📡 Real-time queue update for service details');
      fetchServiceAndRecs();
    };

    socket.on('queue_updated', handleUpdate);
    return () => {
      socket.off('queue_updated', handleUpdate);
    };
  }, [serviceId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading service details & computing ML recommendations...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error || 'The requested canteen counter was not found.'}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white dark:text-slate-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  const getCrowdBadge = (crowd) => {
    switch (crowd?.toLowerCase()) {
      case 'low':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">🟢 Low Crowd</span>;
      case 'moderate':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">🟡 Moderate Crowd</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold">🔴 High Crowd</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in transition-colors duration-200">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Counters</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-colors">
          <Binary className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>ML Feature Vector Space Active</span>
        </div>
      </div>

      {/* MAIN SERVICE HERO CARD */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Crowd */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
                {service.category}
              </span>
              {getCrowdBadge(service.crowdLevel)}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {service.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {service.description}
              </p>
            </div>

            {/* Feature Tags Badges */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Feature Attributes (Vectorized for ML Recommender)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-teal-700 dark:text-teal-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Join Queue CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate(`/join?locationId=${service.locationId}&service=${encodeURIComponent(service.name)}`)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Join This Queue & Get Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Current token serving: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">#{service.currentServingToken || '—'}</strong>
              </div>
            </div>

          </div>

          {/* Right Live Queue & ETA Stats Widget */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Counter Queue Load</span>
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
              </div>

              {/* 2-Metric Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">People Waiting</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                    {service.queueLength} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">students</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                  <div className="text-xs text-teal-700 dark:text-teal-300 font-medium">Predicted Wait Time</div>
                  <div className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
                    ~{service.predictedWait} <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal">min</span>
                  </div>
                </div>
              </div>

              {/* Counter Parameters */}
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-1">
                <div className="flex justify-between">
                  <span>Active Service Counters:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{service.activeCounters} Lanes</strong>
                </div>
                <div className="flex justify-between">
                  <span>Average Service Speed:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{service.averageServiceTime} min / order</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ML EXPLAINER CALLOUT */}
      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <span>Machine Learning (ML) Recommendation Engine</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono uppercase">
              Cosine Similarity
            </span>
          </div>
          <p>
            WAITWISE converts every counter's feature tags into a high-dimensional binary vector space. Using <strong>Cosine Similarity (Dot Product ÷ Vector Magnitudes)</strong>, it identifies the most relevant alternative services and couples them with real-time wait predictions so you can pick the fastest delicious option.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REQUIRED SECTION: SIMILAR SERVICES YOU MAY LIKE (3-5 ML RECOMMENDATIONS) */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Similar Services You May Like
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Content-based recommendations generated via Cosine Similarity on feature tags & categories.
            </p>
          </div>

          <div className="text-xs font-mono text-teal-600 dark:text-teal-400">
            Top {recommendations.length} Matches Found
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        {recsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
            No similar services found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((rec) => {
              const isHighMatch = rec.similarityScore >= 0.7;
              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    playChime('tick');
                    navigate(`/service/${rec.id}`);
                  }}
                  className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer flex flex-col justify-between space-y-4 group transition-all"
                >
                  
                  {/* Card Header & Similarity Score Badge */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {rec.category}
                      </span>
                      
                      {/* Similarity Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        isHighMatch
                          ? 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500/30 text-teal-700 dark:text-teal-300'
                          : 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {rec.similarityPercentage}% Match
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors leading-snug">
                      {rec.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>

                  {/* Matching Tags Feature List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Matching Features:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rec.matchingTags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-semibold border border-teal-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Queue ETA & Crowd Status */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-slate-500">Predicted Wait</div>
                      <div className="text-sm font-bold text-teal-600 dark:text-teal-300 font-mono">
                        ⏱ ~{rec.predictedWait} min
                      </div>
                    </div>
                    <div>
                      {getCrowdBadge(rec.crowdLevel)}
                    </div>
                  </div>

                  {/* View Service Action */}
                  <div className="pt-1">
                    <div className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 group-hover:bg-teal-500 group-hover:text-white dark:group-hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 group-hover:border-teal-400 transition-all flex items-center justify-center gap-1.5">
                      <span>View Service & Queue</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}
