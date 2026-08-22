import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Grid, List, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import QueueCard from '../components/QueueCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { api } from '../services/api';

const CATEGORIES = [
  'All Categories',
  'Healthcare & Hospital',
  'Banking & Finance',
  'Government & Public Services',
  'Beauty & Lifestyle',
  'Restaurants & Dining'
];

const Locations = () => {
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBusy, setSelectedBusy] = useState('All');
  const [sortBy, setSortBy] = useState('wait-asc'); // 'wait-asc', 'waiting-desc', 'name'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    const data = await api.getLocations();
    setLocations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
    window.addEventListener('waitwise_state_change', fetchLocations);
    return () => window.removeEventListener('waitwise_state_change', fetchLocations);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLocations();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter and sort
  const filtered = locations
    .filter((loc) => {
      const matchSearch =
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === 'All Categories' ||
        loc.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchBusy =
        selectedBusy === 'All' ||
        loc.busyLevel.toLowerCase() === selectedBusy.toLowerCase();

      return matchSearch && matchCat && matchBusy;
    })
    .sort((a, b) => {
      if (sortBy === 'wait-asc') return a.avgWaitMins - b.avgWaitMins;
      if (sortBy === 'waiting-desc') return b.totalWaiting - a.totalWaiting;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">Live Queue Network</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>• {locations.length} Connected Facilities</span>
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>Browse Queues & Wait Times</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select any facility to see desk availability, current serving tokens, and reserve your place remotely.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          loading={isRefreshing}
          onClick={handleRefresh}
        >
          Sync Live Data
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.25rem 0.75rem' }}>
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search by name, service or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat, i) => (
                <option key={i} value={cat} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Busy Level Filter */}
          <div>
            <select
              value={selectedBusy}
              onChange={(e) => setSelectedBusy(e.target.value)}
            >
              <option value="All" style={{ background: '#0f172a' }}>All Traffic Levels</option>
              <option value="Low" style={{ background: '#0f172a' }}>Low Wait (Fast)</option>
              <option value="Moderate" style={{ background: '#0f172a' }}>Moderate Traffic</option>
              <option value="High" style={{ background: '#0f172a' }}>High Traffic</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="wait-asc" style={{ background: '#0f172a' }}>Shortest Wait First</option>
              <option value="waiting-desc" style={{ background: '#0f172a' }}>Most Active Queues</option>
              <option value="name" style={{ background: '#0f172a' }}>Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Locations Results Grid */}
      {loading ? (
        <Loading message="Fetching real-time queue states..." fullPage />
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: '20px' }}>
          <Building2 size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No matching facilities found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try resetting your search query or choosing "All Categories".
          </p>
          <Button
            variant="outline"
            size="md"
            onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); setSelectedBusy('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filtered.map((loc) => (
            <QueueCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Locations;
