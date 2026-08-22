import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, Volume2, PlusCircle, CheckCircle2, AlertTriangle, Play, Pause, FastForward, UserCheck, ShieldCheck, LogOut, ArrowUpRight, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { api, playChimeSound } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('loc-1');
  const [adminSession, setAdminSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeActionId, setActiveActionId] = useState(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInServiceId, setWalkInServiceId] = useState('');
  const [walkInPriority, setWalkInPriority] = useState('Regular');
  const [queuePaused, setQueuePaused] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchDashboardData = async () => {
    const session = api.getAdminSession();
    if (!session) {
      // Auto assign demo session if direct access
      setAdminSession({ name: 'Chief Triage Director', role: 'SUPER_ADMIN' });
    } else {
      setAdminSession(session);
    }

    const locs = await api.getLocations();
    setLocations(locs);
    if (locs.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locs[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    window.addEventListener('waitwise_state_change', fetchDashboardData);
    return () => window.removeEventListener('waitwise_state_change', fetchDashboardData);
  }, []);

  const currentLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Action: Call Next Token
  const handleCallNext = async (counterId) => {
    try {
      setActiveActionId(`call-${counterId}`);
      await api.callNextToken(currentLocation.id, counterId);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Error calling next token');
    } finally {
      setActiveActionId(null);
    }
  };

  // Action: Mark Served / Complete
  const handleServe = async (counterId) => {
    try {
      setActiveActionId(`serve-${counterId}`);
      await api.serveToken(currentLocation.id, counterId);
      await fetchDashboardData();
    } finally {
      setActiveActionId(null);
    }
  };

  // Action: Skip / No-show
  const handleSkip = async (counterId) => {
    try {
      setActiveActionId(`skip-${counterId}`);
      await api.skipToken(currentLocation.id, counterId);
      await fetchDashboardData();
    } finally {
      setActiveActionId(null);
    }
  };

  // Action: Add Walk In
  const handleAddWalkIn = async (e) => {
    e.preventDefault();
    const targetServiceId = walkInServiceId || currentLocation?.services[0]?.id;
    await api.addWalkIn({
      locationId: currentLocation.id,
      serviceId: targetServiceId,
      customerName: walkInName || 'Walk-in Guest',
      priority: walkInPriority
    });
    setShowWalkInModal(false);
    setWalkInName('');
    await fetchDashboardData();
  };

  const handleLogout = () => {
    api.adminLogout();
    navigate('/admin/login');
  };

  if (loading || !currentLocation) {
    return <Loading message="Launching Queue Dispatch Console..." fullPage />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-subtle)',
        padding: '1.25rem 1.5rem',
        borderRadius: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <LayoutDashboard size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Live Queue Controller</h2>
              <span className="badge badge-emerald">Live Triage</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Logged in as: <strong style={{ color: 'var(--text-main)' }}>{adminSession?.name || 'Administrator'}</strong>
            </span>
          </div>
        </div>

        {/* Facility Selector & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            style={{ width: 'auto', minWidth: '220px', padding: '0.5rem 0.85rem', fontWeight: 600 }}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id} style={{ background: '#0f172a' }}>
                {loc.name}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            icon={PlusCircle}
            onClick={() => setShowWalkInModal(true)}
          >
            Add Walk-in
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
            title="Sign out of staff console"
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Real-time Ticker Metrics for Current Facility */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <StatCard
          title="Facility Queue"
          value={`${currentLocation.totalWaiting} Waiting`}
          subtitle="Across all departments"
          color="emerald"
          icon={Users}
          badgeText="REAL-TIME"
        />
        <StatCard
          title="Avg Turnaround"
          value={`~${currentLocation.avgWaitMins} Mins`}
          subtitle="Current wait estimate"
          color="cyan"
          icon={Clock}
          badgeText="SLA MET"
        />
        <StatCard
          title="Active Counters"
          value={`${currentLocation.counters.length} Active`}
          subtitle="Ready to serve guests"
          color="purple"
          icon={ShieldCheck}
          badgeText="100% ONLINE"
        />
        <StatCard
          title="Audio Chime"
          value="Online"
          subtitle="Synthesizer ready"
          color="amber"
          icon={Volume2}
          badgeText="CHIME 🔔"
        />
      </div>

      {/* Counter Dispatch Center (The Main Interactive Control Board) */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>
              Service Counters & Desks ({currentLocation.counters.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click <strong>"Call Next"</strong> to summon the next guest in line with an audio announcement.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant={queuePaused ? 'danger' : 'outline'}
              size="sm"
              icon={queuePaused ? Play : Pause}
              onClick={() => setQueuePaused(!queuePaused)}
            >
              {queuePaused ? 'Resume Facility Queue' : 'Pause Queue Intake'}
            </Button>
          </div>
        </div>

        {/* Counter Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {currentLocation.counters.map((counter) => {
            const isServing = counter.status === 'Serving' || counter.status === 'Calling';
            const isCalling = counter.status === 'Calling';
            const targetService = currentLocation.services.find(s => s.id === counter.serviceId);

            return (
              <div
                key={counter.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: isCalling
                    ? '2px solid #10b981'
                    : isServing
                    ? '1.5px solid rgba(6, 182, 212, 0.4)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  boxShadow: isCalling ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none'
                }}
              >
                {/* Counter Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {targetService?.name || 'General Desk'}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginTop: '0.1rem' }}>
                      {counter.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Staff: {counter.agent}
                    </span>
                  </div>

                  <span className={isCalling ? 'badge badge-emerald' : isServing ? 'badge badge-cyan' : 'badge badge-purple'}>
                    <span className={`pulse-dot ${isCalling ? 'emerald' : isServing ? 'cyan' : 'purple'}`}></span>
                    {counter.status}
                  </span>
                </div>

                {/* Token Display Box */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Active Ticket at Desk
                  </span>
                  <div style={{
                    fontSize: '1.85rem',
                    fontWeight: 900,
                    color: counter.currentToken ? '#10b981' : 'var(--text-dim)',
                    margin: '0.2rem 0'
                  }}>
                    {counter.currentToken || 'No Token'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {counter.currentToken ? (isCalling ? '🔔 Ringing chime...' : 'In service') : `${targetService?.waitingCount || 0} waiting in line`}
                  </span>
                </div>

                {/* Counter Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button
                    variant="primary"
                    size="md"
                    icon={Volume2}
                    loading={activeActionId === `call-${counter.id}`}
                    disabled={queuePaused || (targetService && targetService.waitingCount === 0 && !counter.currentToken)}
                    onClick={() => handleCallNext(counter.id)}
                    style={{ width: '100%' }}
                  >
                    {counter.currentToken ? 'Re-Call / Next' : 'Call Next Customer'}
                  </Button>

                  {counter.currentToken && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CheckCircle2}
                        loading={activeActionId === `serve-${counter.id}`}
                        onClick={() => handleServe(counter.id)}
                      >
                        Mark Served
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={FastForward}
                        loading={activeActionId === `skip-${counter.id}`}
                        onClick={() => handleSkip(counter.id)}
                      >
                        Skip No-Show
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Department Queue Waiting Overview */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '22px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Department Breakdown & Queue Load
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {currentLocation.services.map((srv) => (
            <div
              key={srv.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                  {srv.name}
                </span>
                <span className="badge badge-cyan">{srv.prefix}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Currently Serving:</span>
                <strong style={{ color: 'var(--primary)' }}>{srv.prefix}-{String(srv.currentServing).padStart(3, '0')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pending in Queue:</span>
                <strong style={{ color: '#38bdf8' }}>{srv.waitingCount} Guests</strong>
              </div>

              <div style={{
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, srv.waitingCount * 10)}%`,
                  background: srv.waitingCount > 8 ? '#f43f5e' : '#10b981',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Walk-In Guest Modal */}
      {showWalkInModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setShowWalkInModal(false)}>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              background: '#0f172a'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={20} color="var(--primary)" />
              Add Walk-in Customer
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Issue a physical token for guests arriving directly at the reception kiosk.
            </p>

            <form onSubmit={handleAddWalkIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
                  Customer / Patient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
                  Target Department Desk
                </label>
                <select
                  value={walkInServiceId || currentLocation.services[0]?.id}
                  onChange={(e) => setWalkInServiceId(e.target.value)}
                >
                  {currentLocation.services.map((srv) => (
                    <option key={srv.id} value={srv.id} style={{ background: '#0f172a' }}>
                      {srv.name} ({srv.waitingCount} in line)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
                  Priority
                </label>
                <select
                  value={walkInPriority}
                  onChange={(e) => setWalkInPriority(e.target.value)}
                >
                  <option value="Regular" style={{ background: '#0f172a' }}>Regular</option>
                  <option value="Senior / Accessible" style={{ background: '#0f172a' }}>Senior / Wheelchair</option>
                  <option value="Emergency / Urgent" style={{ background: '#0f172a' }}>Emergency</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowWalkInModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={CheckCircle2}
                  style={{ flex: 1 }}
                >
                  Print Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
