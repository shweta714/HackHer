import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, PlusCircle, RefreshCw, AlertCircle, History, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import TokenCard from '../components/TokenCard';
import Loading from '../components/Loading';
import { api, playChimeSound } from '../services/api';

const MyQueue = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMyTokens = async () => {
    setLoading(true);
    const data = await api.getMyTokens();
    setTokens(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyTokens();
    window.addEventListener('waitwise_state_change', fetchMyTokens);
    return () => window.removeEventListener('waitwise_state_change', fetchMyTokens);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMyTokens();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const activeTokens = tokens.filter(t => t.status === 'WAITING' || t.status === 'CALLING');
  const pastTokens = tokens.filter(t => t.status === 'COMPLETED' || t.status === 'CANCELLED' || t.status === 'MISSED');

  const callingToken = tokens.find(t => t.status === 'CALLING');

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner if user's token is currently being called */}
      {callingToken && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          padding: '1.25rem 1.75rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 0 35px rgba(16, 185, 129, 0.5)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Volume2 size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Token #{callingToken.tokenNumber} is Being Called!
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.95 }}>
                Please proceed directly to <strong>{callingToken.assignedCounter}</strong> at {callingToken.locationName}.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={playChimeSound}
            style={{ background: '#ffffff', color: '#065f46', border: 'none', fontWeight: 800 }}
          >
            Replay Chime
          </Button>
        </div>
      )}

      {/* Page Header & Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">Live Queue Status</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              • {activeTokens.length} Active Digital Passes
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>My Virtual Queues</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track your position in line, estimated arrival times, and digital QR passes in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={isRefreshing}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/join-queue')}
          >
            Join Another Queue
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.75rem'
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            background: activeTab === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeTab === 'active' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
            padding: '0.5rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <Ticket size={16} /> Active Tickets ({activeTokens.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            background: activeTab === 'history' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'history' ? 'var(--secondary)' : 'var(--text-muted)',
            border: activeTab === 'history' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
            padding: '0.5rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <History size={16} /> History & Past Tickets ({pastTokens.length})
        </button>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <Loading message="Syncing active tokens..." fullPage />
      ) : activeTab === 'active' ? (
        activeTokens.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '22px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--primary)'
            }}>
              <Ticket size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Active Queues Right Now</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              You haven't joined any virtual queues yet. Explore nearby facilities and reserve your spot in advance!
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={PlusCircle}
              onClick={() => navigate('/join-queue')}
            >
              Browse & Join a Queue
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeTokens.map((token) => (
              <TokenCard key={token.id} token={token} onUpdate={fetchMyTokens} />
            ))}
          </div>
        )
      ) : (
        pastTokens.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '22px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No completed or past tokens recorded.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pastTokens.map((token) => (
              <TokenCard key={token.id} token={token} onUpdate={fetchMyTokens} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyQueue;
