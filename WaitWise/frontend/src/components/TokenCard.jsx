import React, { useState, useEffect } from 'react';
import { QrCode, Clock, Users, Bell, AlertCircle, CheckCircle2, ChevronRight, Volume2, ShieldAlert } from 'lucide-react';
import Button from './Button';
import { api } from '../services/api';

const TokenCard = ({ token, onUpdate }) => {
  const [delaying, setDelaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [smsAlertSent, setSmsAlertSent] = useState(false);

  // Status-based styling
  const isCalling = token.status === 'CALLING';
  const isCompleted = token.status === 'COMPLETED';
  const isMissed = token.status === 'MISSED' || token.status === 'CANCELLED';

  const handleDelay = async () => {
    setDelaying(true);
    await api.delayToken(token.id, 2);
    setDelaying(false);
    if (onUpdate) onUpdate();
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this queue token?')) {
      setCancelling(true);
      await api.cancelToken(token.id);
      setCancelling(false);
      if (onUpdate) onUpdate();
    }
  };

  const simulateSms = () => {
    setSmsAlertSent(true);
    setTimeout(() => setSmsAlertSent(false), 4000);
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: isCalling
          ? '2px solid #10b981'
          : isMissed
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : '1px solid var(--border-subtle)',
        boxShadow: isCalling
          ? '0 0 35px rgba(16, 185, 129, 0.35)'
          : 'var(--shadow-md)'
      }}
    >
      {/* Top Banner Ribbon */}
      <div style={{
        padding: '0.85rem 1.5rem',
        background: isCalling
          ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          : isCompleted
          ? 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)'
          : isMissed
          ? 'linear-gradient(90deg, #e11d48 0%, #be123c 100%)'
          : 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {isCalling ? (
            <>
              <span className="pulse-dot emerald" style={{ background: '#ffffff' }}></span>
              <span>YOUR TURN! PLEASE PROCEED TO COUNTER</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 size={16} />
              <span>SERVICE COMPLETED</span>
            </>
          ) : isMissed ? (
            <>
              <AlertCircle size={16} />
              <span>TICKET {token.status}</span>
            </>
          ) : (
            <>
              <span className="pulse-dot emerald"></span>
              <span>ACTIVE IN VIRTUAL QUEUE</span>
            </>
          )}
        </div>
        <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>
          {new Date(token.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div style={{ padding: '1.75rem' }}>
        {/* Token Number & Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Digital Queue Pass
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: isCalling ? '#10b981' : 'var(--text-main)', marginTop: '0.1rem' }}>
              {token.tokenNumber}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">{token.serviceName}</span>
              {token.priority && token.priority !== 'Regular' && (
                <span className="badge badge-purple">{token.priority} Priority</span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'block' }}>Location</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {token.locationName}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>
              Assigned: {token.assignedCounter}
            </span>
          </div>
        </div>

        {/* Live Status Progress Bar */}
        {!isCompleted && !isMissed && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {isCalling ? 'You are at the counter' : `${token.currentAhead} people ahead of you`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                  {isCalling ? 'Now' : `~${token.estimatedWaitMins} mins wait`}
                </span>
              </div>
            </div>

            {/* Visual Progress Track */}
            <div style={{
              height: '10px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: isCalling ? '100%' : `${Math.max(10, 100 - (token.currentAhead * 20))}%`,
                background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
                borderRadius: '999px',
                transition: 'width 0.6s ease'
              }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>Joined Queue</span>
              <span>Near Counter</span>
              <span>Your Turn</span>
            </div>
          </div>
        )}

        {/* Customer & Ticket Details Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '1rem',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Guest Name</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{token.customerName}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Phone</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{token.phone}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Party Size</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{token.partySize} Person(s)</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Verification Code</span>
            <span style={{ fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em' }}>
              #WW-{token.id.slice(-4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* SMS Notification Banner Simulation */}
        {smsAlertSent && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--primary)',
            color: '#a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Bell size={16} />
            <span>Simulated SMS alert sent to {token.phone}: "Your turn is approaching! (Token {token.tokenNumber})"</span>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={QrCode}
            onClick={() => setShowQrModal(true)}
          >
            Show Pass QR
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Bell}
            onClick={simulateSms}
          >
            Test SMS Notice
          </Button>

          {!isCompleted && !isMissed && (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={Clock}
                loading={delaying}
                onClick={handleDelay}
                title="Delay ticket if you need 10 more minutes"
              >
                +10 Mins Delay
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={cancelling}
                onClick={handleCancel}
                style={{ marginLeft: 'auto' }}
              >
                Leave Queue
              </Button>
            </>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
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
        }} onClick={() => setShowQrModal(false)}>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '360px',
              width: '100%',
              textAlign: 'center',
              background: '#0f172a'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Scan at Kiosk / Counter</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Token #{token.tokenNumber} • {token.customerName}
            </p>

            <div style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              {/* Simulated QR Code SVG */}
              <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />
                <rect x="60" y="10" width="30" height="30" fill="black" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="black" />
                <rect x="10" y="60" width="30" height="30" fill="black" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="black" />
                <rect x="45" y="45" width="10" height="10" fill="#10b981" />
                <rect x="55" y="65" width="10" height="25" fill="black" />
                <rect x="75" y="55" width="15" height="15" fill="black" />
                <rect x="45" y="15" width="8" height="15" fill="black" />
              </svg>
            </div>

            <Button variant="primary" size="md" style={{ width: '100%' }} onClick={() => setShowQrModal(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
