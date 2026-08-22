import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, ArrowRight, ShieldCheck, Zap, Users, Sparkles, Smartphone, BarChart3, Hospital, Landmark, Building2, Utensils, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import Button from '../components/Button';
import QueueCard from '../components/QueueCard';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyVisits, setMonthlyVisits] = useState(4);
  const [timePerWait, setTimePerWait] = useState(45);

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await api.getLocations();
      setLocations(data);
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate annual time saved
  const annualMinutesSaved = monthlyVisits * 12 * (timePerWait - 10);
  const annualHoursSaved = (annualMinutesSaved / 60).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3.5rem 1rem 2rem',
        position: 'relative'
      }}>
        {/* Top Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-emerald">
            <Sparkles size={13} />
            Next-Gen Virtual Queuing Platform
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            Hackathon 2026 Project
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '920px',
          margin: '0 auto 1.5rem'
        }}>
          Skip Physical Lines. <br />
          <span className="text-gradient-emerald">Wait Anywhere, Arrive Just-In-Time.</span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Join queues at hospitals, banks, DMVs, and restaurants from your phone. Track your live token in real-time and get notified exactly when it's your turn.
        </p>

        {/* Quick Search & Actions Box */}
        <div className="glass-card" style={{
          maxWidth: '640px',
          margin: '0 auto 2.5rem',
          padding: '0.75rem',
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, paddingLeft: '0.5rem' }}>
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search hospitals, banks, DMV, salons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.5rem',
                boxShadow: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/locations?search=${encodeURIComponent(searchQuery)}`);
              }}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(`/locations?search=${encodeURIComponent(searchQuery)}`)}
          >
            Find Queue
          </Button>
        </div>

        {/* Quick Category Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
          {[
            { name: 'Hospitals & Clinics', icon: Hospital, cat: 'Healthcare' },
            { name: 'Banks & Financial', icon: Landmark, cat: 'Banking' },
            { name: 'DMV & Gov Services', icon: Building2, cat: 'Government' },
            { name: 'Dine-In Restaurants', icon: Utensils, cat: 'Restaurants' }
          ].map((c, i) => (
            <button
              key={i}
              onClick={() => navigate(`/locations?search=${c.cat}`)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <c.icon size={15} color="var(--primary)" />
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Real-time System Metrics Row */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem'
      }}>
        <StatCard
          title="Active Waiting Users"
          value="96 People"
          subtitle="Across 5 live locations"
          color="emerald"
          icon={Users}
          badgeText="LIVE"
          change="8% vs last hour"
          isPositive={true}
        />
        <StatCard
          title="Average Wait Time"
          value="14.2 Mins"
          subtitle="Real-time estimated wait"
          color="cyan"
          icon={Clock}
          badgeText="62% FASTER"
          change="Down from 45 mins"
          isPositive={true}
        />
        <StatCard
          title="Daily Served Tickets"
          value="342 Guests"
          subtitle="Total transactions today"
          color="purple"
          icon={Zap}
          badgeText="SLA 94%"
          change="12% volume surge"
          isPositive={true}
        />
        <StatCard
          title="Customer Satisfaction"
          value="4.85 / 5.0"
          subtitle="Based on 1,200+ ratings"
          color="amber"
          icon={ShieldCheck}
          badgeText="HIGH CSAT"
          change="98% would recommend"
          isPositive={true}
        />
      </section>

      {/* Featured Live Locations Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Live Desks Available</span>
            <h2 style={{ fontSize: '1.85rem' }}>Popular Queues Right Now</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/locations')}
          >
            View All Locations
          </Button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredLocations.slice(0, 3).map((loc) => (
            <QueueCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>

      {/* How WaitWise Works (3 Step Interactive Workflow) */}
      <section className="glass-card" style={{ padding: '3rem 2rem', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Effortless Experience</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How Virtual Queuing Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No more waiting in standing lines or stuffy waiting rooms. Step in only when you are called.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          position: 'relative'
        }}>
          {[
            {
              step: '01',
              title: 'Select Facility & Desk',
              desc: 'Browse hospitals, banks, or restaurants and pick your required counter service.',
              icon: Smartphone,
              color: '#10b981'
            },
            {
              step: '02',
              title: 'Get Live Digital Pass',
              desc: 'Receive an instant queue token with real-time countdown and number of people ahead.',
              icon: Clock,
              color: '#06b6d4'
            },
            {
              step: '03',
              title: 'Arrive Just In Time',
              desc: 'Get audio chimes & SMS alerts when your token is called. Walk directly to the counter!',
              icon: CheckCircle2,
              color: '#8b5cf6'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '2rem',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.08)',
                position: 'absolute',
                top: '1.25rem',
                right: '1.5rem',
                fontFamily: 'var(--font-heading)'
              }}>
                {item.step}
              </div>

              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: `rgba(255, 255, 255, 0.05)`,
                border: `1px solid ${item.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                marginBottom: '1.25rem'
              }}>
                <item.icon size={24} />
              </div>

              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {item.title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Wait-Time Saved Calculator */}
      <section className="glass-card" style={{
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>Time Savings Calculator</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              How much life do you waste waiting in lines?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              On average, an urban resident spends over 45 minutes per physical counter visit. See how much time WaitWise saves you each year.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span>Visits to Bank/Hospital/Gov per month:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{monthlyVisits} visits</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={monthlyVisits}
                  onChange={(e) => setMonthlyVisits(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span>Traditional physical line wait:</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{timePerWait} minutes</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={timePerWait}
                  onChange={(e) => setTimePerWait(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#06b6d4' }}
                />
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div style={{
            background: 'rgba(9, 13, 22, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Estimated Annual Time Saved
            </span>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#10b981', margin: '0.5rem 0' }}>
              {annualHoursSaved} <span style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Hours</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              That's equal to <strong>{(annualHoursSaved / 24).toFixed(1)} full days of your life</strong> reclaimed from waiting in queues!
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Smartphone}
              style={{ width: '100%' }}
              onClick={() => navigate('/join-queue')}
            >
              Get Your Digital Token Now
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Box for Staff and Users */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Are you a Facility Manager or Counter Agent?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Launch the WaitWise Admin Console to call next tickets with 1-click, ring live audio chimes, manage walk-in traffic, and view counter throughput.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            icon={BarChart3}
            onClick={() => navigate('/admin/dashboard')}
          >
            Launch Queue Console
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/analytics')}
          >
            View Live Analytics
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
