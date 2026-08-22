import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Layers, MapPin, PlusCircle, Ticket, LayoutDashboard, BarChart3, Sun, Moon, Volume2, ShieldCheck, Menu, X } from 'lucide-react';
import { api, playChimeSound } from '../services/api';
import Button from './Button';

const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTokenCount, setActiveTokenCount] = useState(0);
  const [adminSession, setAdminSession] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateNavbarState = async () => {
    const tokens = await api.getMyTokens();
    const active = tokens.filter(t => t.status === 'WAITING' || t.status === 'CALLING').length;
    setActiveTokenCount(active);
    setAdminSession(api.getAdminSession());
  };

  useEffect(() => {
    updateNavbarState();
    window.addEventListener('waitwise_state_change', updateNavbarState);
    return () => window.removeEventListener('waitwise_state_change', updateNavbarState);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.82)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', display: 'block', lineHeight: 1.1 }}>
              Wait<span style={{ color: 'var(--primary)' }}>Wise</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
              Smart Virtual Queue
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/locations"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <MapPin size={16} /> Locations
          </NavLink>
          <NavLink
            to="/join-queue"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={16} /> Join Queue
          </NavLink>
          <NavLink
            to="/my-queue"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <Ticket size={16} /> My Queue
            {activeTokenCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: '#10b981',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px #10b981'
              }}>
                {activeTokenCount}
              </span>
            )}
          </NavLink>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)', margin: '0 0.4rem' }} />

          <NavLink
            to={adminSession ? '/admin/dashboard' : '/admin/login'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} /> {adminSession ? 'Admin Panel' : 'Staff Login'}
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={16} /> Analytics
          </NavLink>
        </nav>

        {/* Right Actions (Chime sound, Theme, Admin badge) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={playChimeSound}
            title="Test Queue Chime Sound"
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Volume2 size={18} />
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle Dark/Light Mode"
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#38bdf8" />}
          </button>

          {adminSession ? (
            <Button
              variant="outline"
              size="sm"
              icon={ShieldCheck}
              onClick={() => navigate('/admin/dashboard')}
            >
              Staff Active
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Ticket}
              onClick={() => navigate('/my-queue')}
            >
              My Ticket {activeTokenCount > 0 ? `(${activeTokenCount})` : ''}
            </Button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <NavLink to="/" className="mobile-nav-link">Home</NavLink>
          <NavLink to="/locations" className="mobile-nav-link"><MapPin size={16} /> Locations & Wait Times</NavLink>
          <NavLink to="/join-queue" className="mobile-nav-link"><PlusCircle size={16} /> Join Live Queue</NavLink>
          <NavLink to="/my-queue" className="mobile-nav-link"><Ticket size={16} /> My Active Tickets ({activeTokenCount})</NavLink>
          <NavLink to="/admin/dashboard" className="mobile-nav-link"><LayoutDashboard size={16} /> Admin Queue Control</NavLink>
          <NavLink to="/analytics" className="mobile-nav-link"><BarChart3 size={16} /> Queue Analytics & SLA</NavLink>
        </div>
      )}

      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.06);
        }
        .nav-link.active {
          color: var(--primary);
          background: rgba(16, 185, 129, 0.12);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          color: var(--text-main);
          text-decoration: none;
          font-weight: 600;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
        }
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
