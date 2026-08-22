import React from 'react';
import { Clock, Users, MapPin, ArrowRight, Activity, Building2, Hospital, Landmark, Sparkles, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const iconMap = {
  Hospital: Hospital,
  Landmark: Landmark,
  Building2: Building2,
  Sparkles: Sparkles,
  Utensils: Utensils
};

const QueueCard = ({ location }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[location.icon] || Building2;

  const getBusyBadge = (busy) => {
    switch (busy?.toLowerCase()) {
      case 'low':
        return <span className="badge badge-emerald"><span className="pulse-dot emerald"></span> Low Wait</span>;
      case 'moderate':
        return <span className="badge badge-amber"><span className="pulse-dot amber"></span> Moderate</span>;
      case 'high':
      default:
        return <span className="badge badge-rose"><span className="pulse-dot rose"></span> High Traffic</span>;
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Card Header with Image & Overlay */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={location.image}
          alt={location.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.75)'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.2) 0%, rgba(9, 13, 22, 0.95) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            padding: '0.25rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <IconComponent size={14} color="#38bdf8" />
            {location.category}
          </span>
          {getBusyBadge(location.busyLevel)}
        </div>

        {/* Live Serving Ribbon */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#38bdf8',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          <Activity size={14} />
          Now Serving: <span style={{ color: '#ffffff', background: 'rgba(56, 189, 248, 0.2)', padding: '0.1rem 0.5rem', borderRadius: '6px' }}>{location.currentlyServing || 'Idle'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
          {location.name}
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
          <MapPin size={14} color="var(--primary)" />
          {location.address}
        </p>

        {/* Key Live Stats Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Est. Wait Time</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={16} /> ~{location.avgWaitMins} mins
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>In Queue</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={16} /> {location.totalWaiting} people
            </span>
          </div>
        </div>

        {/* Available Services Chips */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
            Available Desks ({location.services.length})
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {location.services.slice(0, 3).map((srv) => (
              <span
                key={srv.id}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {srv.name} ({srv.waitingCount})
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto' }}>
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            style={{ width: '100%' }}
            onClick={() => navigate(`/join-queue?locationId=${location.id}`)}
          >
            Join Queue Remotely
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QueueCard;
