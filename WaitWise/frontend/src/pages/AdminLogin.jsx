import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, KeyRound, Sparkles, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { api } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.adminLogin(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleName, user, pass) => {
    setUsername(user);
    setPassword(pass);
    setLoading(true);
    try {
      await api.adminLogin(user, pass);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Demo login error');
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '2rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
          border: '1px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'var(--primary)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Staff & Admin Portal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Authorized access to live counter triage, audio chimes, and analytics.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          color: '#fda4af',
          padding: '0.85rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="glass-card" style={{ padding: '2rem', borderRadius: '22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
              Username / Agent ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or agent_01"
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
              Password / Access PIN
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <KeyRound size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Sign In to Queue Controller
          </Button>
        </div>
      </form>

      {/* Quick 1-Click Demo Login Presets */}
      <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
          ⚡ 1-Click Hackathon Demo Presets
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('Hospital Operations Director', 'admin', 'admin123')}
            style={{
              padding: '0.65rem 0.95rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
          >
            <span>👨‍⚕️ Dr. Sharma (Apex Hospital)</span>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('Bank Head Teller', 'bank_admin', 'admin123')}
            style={{
              padding: '0.65rem 0.95rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
          >
            <span>🏦 Metro Bank Lead Cashier</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Staff Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
