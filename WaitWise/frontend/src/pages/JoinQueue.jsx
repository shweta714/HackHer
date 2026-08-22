import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Ticket, Users, Clock, Building2, User, Phone, CheckCircle2, Sparkles, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { api } from '../services/api';

const JoinQueue = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedLocationId = searchParams.get('locationId');

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedLocationId, setSelectedLocationId] = useState(preselectedLocationId || 'loc-1');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [priority, setPriority] = useState('Regular');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const data = await api.getLocations();
      setLocations(data);

      const targetLoc = preselectedLocationId ? data.find(l => l.id === preselectedLocationId) : data[0];
      if (targetLoc) {
        setSelectedLocationId(targetLoc.id);
        if (targetLoc.services.length > 0) {
          setSelectedServiceId(targetLoc.services[0].id);
        }
      }
      setLoading(false);
    };
    fetchLocations();
  }, [preselectedLocationId]);

  // When location changes, update service options
  const handleLocationChange = (locId) => {
    setSelectedLocationId(locId);
    const loc = locations.find(l => l.id === locId);
    if (loc && loc.services.length > 0) {
      setSelectedServiceId(loc.services[0].id);
    }
  };

  const currentLocation = locations.find(l => l.id === selectedLocationId) || locations[0];
  const currentService = currentLocation?.services?.find(s => s.id === selectedServiceId) || currentLocation?.services?.[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a phone number for queue SMS notifications');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = await api.joinQueue({
        locationId: selectedLocationId,
        serviceId: selectedServiceId,
        customerName,
        phone,
        partySize,
        priority,
        notes
      });

      // Fire victory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate('/my-queue');
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to generate token. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading booking counters..." fullPage />;
  }

  const estimatedWait = currentService ? currentService.waitingCount * currentService.avgServiceMins : 15;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Heading */}
      <div style={{ textAlign: 'center' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> Instant Virtual Ticket
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>Join Queue Remotely</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Reserve your spot from home or on the go. Get live wait updates and walk up right when you're called.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          color: '#fda4af',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={20} color="var(--primary)" />
            Queue Registration Form
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Facility / Location Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Select Facility / Location
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                required
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {loc.name} ({loc.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Department / Service Desk */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Select Department / Service Desk
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                {currentLocation?.services?.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: selectedServiceId === srv.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: selectedServiceId === srv.id ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: selectedServiceId === srv.id ? '#ffffff' : 'var(--text-main)', display: 'block' }}>
                        {srv.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Prefix: <strong>{srv.prefix}</strong> • ~{srv.avgServiceMins} mins / customer
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        {srv.waitingCount} in line
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Phone (for SMS alert) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Party Size & Priority Option */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                >
                  <option value="1" style={{ background: '#0f172a' }}>1 Person (Solo)</option>
                  <option value="2" style={{ background: '#0f172a' }}>2 Persons</option>
                  <option value="3" style={{ background: '#0f172a' }}>3-4 Persons</option>
                  <option value="5" style={{ background: '#0f172a' }}>5+ Group</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Priority Tier
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Regular" style={{ background: '#0f172a' }}>Regular Queue</option>
                  <option value="Senior / Accessible" style={{ background: '#0f172a' }}>Senior Citizen / Accessible</option>
                  <option value="Emergency / Urgent" style={{ background: '#0f172a' }}>Emergency / Urgent</option>
                  <option value="Express" style={{ background: '#0f172a' }}>Express Pass</option>
                </select>
              </div>
            </div>

            {/* Special Request / Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Special Note / Symptom / Inquiry (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Need wheelchair access, loan inquiry, quick checkup..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '0.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                icon={CheckCircle2}
                style={{ width: '100%' }}
              >
                Generate Live Virtual Ticket
              </Button>
            </div>
          </div>
        </form>

        {/* Live Token Preview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '22px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-emerald">Live Ticket Preview</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Auto-Updating</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px dashed var(--primary)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.25rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                Estimated Token Preview
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', margin: '0.2rem 0' }}>
                {currentService?.prefix || 'TKT'}-{String((currentService?.totalGenerated || 0) + 1).padStart(3, '0')}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                {currentService?.name || 'General Desk'}
              </span>
            </div>

            {/* Wait Estimate Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentLocation?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>People Ahead:</span>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>{currentService?.waitingCount || 0} Guests</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Wait Time:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>~{estimatedWait} mins</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Notification Channel:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>SMS & Live Screen Chime</span>
              </div>
            </div>
          </div>

          {/* Guarantee / Benefits */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Shield size={28} color="var(--primary)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              WaitWise sends automated SMS reminders 10 minutes and 2 minutes before your token is called, so you never miss your turn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQueue;
