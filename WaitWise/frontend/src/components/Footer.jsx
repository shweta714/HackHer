import React from 'react';
import { Layers, Heart, Shield, Cpu, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(9, 13, 22, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Brand Col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Layers size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Wait<span style={{ color: 'var(--primary)' }}>Wise</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Next-generation smart virtual queue & live wait-time intelligence platform. Built to eliminate physical queues, reduce walkaways, and optimize counter operations.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-emerald"><Zap size={12} /> Real-Time Sync</span>
            <span className="badge badge-cyan"><Cpu size={12} /> AI Wait Predictor</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            User Services
          </h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/locations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live Location Directory</Link></li>
            <li><Link to="/join-queue" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Join Queue Remotely</Link></li>
            <li><Link to="/my-queue" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Active Digital Tokens</Link></li>
            <li><Link to="/locations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Hospitals & Diagnostic Centers</Link></li>
            <li><Link to="/locations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Banks & Financial Tellers</Link></li>
          </ul>
        </div>

        {/* Staff & Admin Links */}
        <div>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Enterprise & Staff
          </h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Counter Staff Login</Link></li>
            <li><Link to="/admin/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live Queue Controller</Link></li>
            <li><Link to="/analytics" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Peak Traffic & SLA Analytics</Link></li>
            <li><span style={{ color: 'var(--text-dim)' }}>Multi-Counter Triage Engine</span></li>
            <li><span style={{ color: 'var(--text-dim)' }}>SMS / WhatsApp Gateway Ready</span></li>
          </ul>
        </div>

        {/* Hackathon Info */}
        <div>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Hackathon Project
          </h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Developed by our 4-person engineering team for <strong>HackHer / Cypher Verse 5</strong>.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}>
            Frontend built with React 18, Vite, Lucide Icons, Web Audio API & reactive state architecture.
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <span>© 2026 WaitWise Systems Inc. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)' }}>
            <Shield size={14} /> SOC2 & HIPAA Compliant Ready
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
