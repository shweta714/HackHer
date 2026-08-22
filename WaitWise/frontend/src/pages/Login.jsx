import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Phone, KeyRound, Sparkles, ArrowRight, AlertCircle, Smartphone, CheckCircle2, Building2 } from 'lucide-react';
import Button from '../components/Button';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // User form state
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userSuccess, setUserSuccess] = useState(false);

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const handleUserLogin = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      setError('Please fill in your name and phone number');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      localStorage.setItem('waitwise_user_profile', JSON.stringify({
        name: userName,
        phone: userPhone,
        loggedInAt: new Date().toISOString()
      }));
      setLoading(false);
      setUserSuccess(true);
      setTimeout(() => {
        navigate('/my-queue');
      }, 600);
    }, 400);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.adminLogin(adminUsername, adminPassword);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try: admin / admin123');
      setLoading(false);
    }
  };

  const handleQuickDemo = async (user, pass) => {
    setAdminUsername(user);
    setAdminPassword(pass);
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
      maxWidth: '480px',
      margin: '1.5rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Top Header */}
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
          {activeTab === 'user' ? <User size={28} /> : <ShieldCheck size={28} />}
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
          {activeTab === 'user' ? 'Welcome to WaitWise' : 'Staff & Counter Portal'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {activeTab === 'user'
            ? 'Sign in to track your live tickets and arrival countdowns'
            : 'Authorized access for facility managers and counter agents'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '0.35rem',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          type="button"
          onClick={() => { setActiveTab('user'); setError(''); }}
          style={{
            padding: '0.65rem',
            borderRadius: '10px',
            background: activeTab === 'user' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'user' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeTab === 'user' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <User size={16} /> Customer / Guest
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('admin'); setError(''); }}
          style={{
            padding: '0.65rem',
            borderRadius: '10px',
            background: activeTab === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'admin' ? 'var(--secondary)' : 'var(--text-muted)',
            border: activeTab === 'admin' ? '1px solid rgba(6, 182, 212, 0.3)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={16} /> Staff / Admin
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          color: '#fda4af',
          padding: '0.85rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Customer Login Form */}
      {activeTab === 'user' ? (
        <form onSubmit={handleUserLogin} className="glass-card" style={{ padding: '2rem', borderRadius: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Your Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Phone Number (for SMS token updates)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
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
              Continue to My Live Queues
            </Button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Don't have a ticket yet? <Link to="/locations" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Browse Locations</Link>
              </span>
            </div>
          </div>
        </form>
      ) : (
        /* Staff / Admin Login Form */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <form onSubmit={handleAdminLogin} className="glass-card" style={{ padding: '2rem', borderRadius: '22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Staff Username / Counter Agent ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="e.g. admin or agent_01"
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Security PIN / Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
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

          {/* Quick 1-Click Demo Buttons */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
              ⚡ 1-Click Quick Demo Sign-In
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'admin123')}
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
                  cursor: 'pointer'
                }}
              >
                <span>👨‍⚕️ Dr. Sharma (Hospital Director)</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('bank_admin', 'admin123')}
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
                  cursor: 'pointer'
                }}
              >
                <span>🏦 Metro Bank Lead Cashier</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Counter Staff</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
