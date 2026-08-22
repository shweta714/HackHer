import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Users, Download, Calendar, ShieldCheck, Zap, ArrowUpRight, Activity } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { api } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const res = await api.getAnalytics();
      setData(res);
      setLoading(false);
    };
    fetchAnalytics();
  }, [timeRange]);

  const handleExportCsv = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Hour,Visitors,AverageWaitMins\n"
        + data.hourlyTraffic.map(e => `${e.hour},${e.count},${e.avgWait}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `waitwise_analytics_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 600);
  };

  if (loading || !data) {
    return <Loading message="Computing operational SLA metrics & heatmaps..." fullPage />;
  }

  const maxTraffic = Math.max(...data.hourlyTraffic.map(t => t.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">Real-time Intelligence</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>• Live Telemetry Engine</span>
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>Queue Analytics & SLA Insights</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive throughput analysis, peak hour heatmaps, counter agent efficiency, and satisfaction reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontWeight: 600 }}
          >
            <option value="today" style={{ background: '#0f172a' }}>Today's Live Data</option>
            <option value="week" style={{ background: '#0f172a' }}>Past 7 Days</option>
            <option value="month" style={{ background: '#0f172a' }}>This Month</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            loading={downloading}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <StatCard
          title="Total Served"
          value={data.summary.totalServedToday}
          subtitle="Processed today"
          color="emerald"
          icon={Users}
          badgeText="98% SERVED"
          change="14% vs yesterday"
          isPositive={true}
        />
        <StatCard
          title="Average Wait"
          value={`${data.summary.avgWaitTimeMins}m`}
          subtitle="From ticket to counter"
          color="cyan"
          icon={Clock}
          badgeText="TARGET < 15m"
          change="3.2m faster"
          isPositive={true}
        />
        <StatCard
          title="SLA Compliance"
          value={data.summary.slaCompliance}
          subtitle="Met <15min threshold"
          color="purple"
          icon={ShieldCheck}
          badgeText="EXCELLENT"
          change="1.8% gain"
          isPositive={true}
        />
        <StatCard
          title="Peak Window"
          value={data.summary.peakHour}
          subtitle="Highest surge time"
          color="amber"
          icon={Activity}
          badgeText="HIGH LOAD"
        />
        <StatCard
          title="Satisfaction"
          value={data.summary.csatScore}
          subtitle="Post-service ratings"
          color="emerald"
          icon={Zap}
          badgeText="CSAT"
          change="0.2 star jump"
          isPositive={true}
        />
      </div>

      {/* Hourly Traffic & Surge Bar Chart */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Hourly Traffic & Turnaround Heatmap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Shows customer throughput (bars) and average wait time in minutes per hour.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} />
              Volume (Visitors)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#38bdf8', borderRadius: '3px' }} />
              Avg Wait (Mins)
            </span>
          </div>
        </div>

        {/* Custom Visual Bar Chart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.hourlyTraffic.length}, 1fr)`,
          gap: '0.75rem',
          height: '240px',
          alignItems: 'flex-end',
          paddingBottom: '2.5rem',
          position: 'relative',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {data.hourlyTraffic.map((item, idx) => {
            const heightPercent = Math.max(15, (item.count / maxTraffic) * 100);
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}
              >
                {/* Tooltip on hover */}
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '0.35rem'
                }}>
                  {item.count}
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${heightPercent}%`,
                    background: item.count > 75
                      ? 'linear-gradient(180deg, #f59e0b 0%, #10b981 100%)'
                      : 'linear-gradient(180deg, #10b981 0%, #06b6d4 100%)',
                    borderRadius: '8px 8px 3px 3px',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                  }}
                  title={`${item.hour}: ${item.count} visitors, ${item.avgWait} mins wait`}
                />

                {/* X Axis Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  {item.hour}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Department Distribution + Counter Staff Performance */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Department Volume Share */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
            Queue Volume by Department
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.departmentDistribution.map((dept, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dept.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{dept.count} guests ({dept.percentage}%)</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${dept.percentage}%`,
                    background: dept.color,
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Staff Agent Performance Table */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
            Counter Performance & Staff CSAT
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Counter / Agent</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Served</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Avg Service</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>CSAT</th>
                </tr>
              </thead>
              <tbody>
                {data.counterPerformance.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{row.counter}</strong>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{row.agent}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {row.served}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {row.avgService}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {row.satisfaction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
