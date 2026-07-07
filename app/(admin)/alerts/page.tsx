'use client';

import { Bell, AlertTriangle, Info, CheckCircle, X, Settings, TrendingUp, Filter } from 'lucide-react';
import { useState } from 'react';

const allAlerts = [
  { id: 1, severity: 'critical', title: 'High-Risk NEET Dropout Detected',        desc: '12 NEETs in Agadir showed dropout signals this week. Immediate follow-up needed.', time: '2 hours ago',    neets: 12,  action: 'View Profiles',   read: false },
  { id: 2, severity: 'critical', title: 'Mediator Coverage Gap — Tata Commune',   desc: 'No active mediator assigned to 38 NEETs in Tata. Last visit was 15 days ago.',  time: '5 hours ago',    neets: 38,  action: 'Assign Mediator', read: false },
  { id: 3, severity: 'warning',  title: 'Low Trust Score Cluster Detected',       desc: '24 NEETs with trust score below 40% in Tiznit — needs engagement boost.',        time: '1 day ago',      neets: 24,  action: 'View NEETs',      read: false },
  { id: 4, severity: 'warning',  title: 'ANAPEC Enrollment Capacity at 90%',      desc: 'ANAPEC program is almost at full capacity (540/600). Prioritize referrals.',      time: '2 days ago',     neets: null, action: 'Manage Program',  read: true },
  { id: 5, severity: 'info',     title: 'Monthly Report Ready',                   desc: 'The April 2025 monthly performance report has been generated and is ready for review.', time: '3 days ago', neets: null, action: 'View Report',    read: true },
  { id: 6, severity: 'info',     title: '50 New NEETs Profiled — Taroudant',      desc: 'Field team completed profiling of 50 new NEETs in Taroudant this week.',          time: '4 days ago',     neets: 50,  action: 'Review Profiles', read: true },
  { id: 7, severity: 'success',  title: '30 NEETs Reached Stabilization (90d)',   desc: '30 NEETs have successfully passed the 90-day stability mark this month. Great progress!', time: '5 days ago', neets: 30, action: 'View Stats',    read: true },
];

const alertRules = [
  { name: 'Dropout Risk Detection',    trigger: 'NEET inactivity > 14 days', severity: 'critical', enabled: true },
  { name: 'Mediator Coverage Gap',     trigger: 'Commune with 0 active mediators', severity: 'critical', enabled: true },
  { name: 'Enrollment Capacity Alert', trigger: 'Program capacity > 85%', severity: 'warning',  enabled: true },
  { name: 'New NEET Batch',            trigger: '10+ new NEETs added in 24h', severity: 'info',     enabled: true },
  { name: 'Low Trust Cluster',         trigger: 'Cluster of 20+ NEETs with trust < 40%', severity: 'warning', enabled: false },
];

const tabs = ['All', 'Critical', 'Warning', 'Info', 'Success'];

const severityConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critical: { color: '#E74C3C', bg: '#FDEDEC', icon: <AlertTriangle size={16} />, label: 'Critical' },
  warning:  { color: '#F5A623', bg: '#FEF9E7', icon: <AlertTriangle size={16} />, label: 'Warning' },
  info:     { color: '#2E86C1', bg: '#EBF5FB', icon: <Info size={16} />,          label: 'Info' },
  success:  { color: '#27AE60', bg: '#EAFAF1', icon: <CheckCircle size={16} />,   label: 'Success' },
};

function Footer() {
  return <div style={{ background: 'white', borderTop: '1px solid #E8ECF0', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#7F8C9A' }}><span>Linking Youth to Programs and Work</span><div style={{ display: 'flex', gap: 16 }}><a href="#" style={{ color: '#7F8C9A', textDecoration: 'none' }}>Privacy Policy</a><span>•</span><a href="#" style={{ color: '#7F8C9A', textDecoration: 'none' }}>Terms of Service</a></div></div>;
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? allAlerts : allAlerts.filter(a => a.severity === activeTab.toLowerCase());
  const unread = allAlerts.filter(a => !a.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E8ECF0', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1A2B3C' }}>Alerts</h1>
              {unread > 0 && <span style={{ background: '#E74C3C', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>{unread}</span>}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#7F8C9A', marginTop: 2 }}>Monitor system alerts, risk signals, and program notifications</p>
          </div>
          <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '7px 14px' }}><Settings size={13} /> Manage Rules</button>
          <button className="btn-primary">Mark All Read</button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginTop: 14, borderBottom: '1px solid #E8ECF0' }}>
          {tabs.map(t => {
            const count = t === 'All' ? allAlerts.length : allAlerts.filter(a => a.severity === t.toLowerCase()).length;
            return (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: '8px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === t ? 700 : 500, color: activeTab === t ? '#00B8A9' : '#7F8C9A', borderBottom: activeTab === t ? '2px solid #00B8A9' : '2px solid transparent', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6 }}>
                {t}
                <span style={{ background: activeTab === t ? '#E0F7F5' : '#F4F6F9', color: activeTab === t ? '#00B8A9' : '#7F8C9A', borderRadius: 20, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Alert Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((alert) => {
            const cfg = severityConfig[alert.severity];
            return (
              <div key={alert.id} className="card" style={{ padding: 18, borderLeft: `4px solid ${cfg.color}`, background: alert.read ? 'white' : `${cfg.bg}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1A2B3C' }}>{alert.title}</span>
                      {!alert.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, display: 'inline-block', flexShrink: 0 }} />}
                      <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700 }}>{cfg.label}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#4A5568', lineHeight: 1.5, marginBottom: 10 }}>{alert.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '0.72rem', color: '#A0ADB8' }}>{alert.time}</span>
                      {alert.neets && <span style={{ fontSize: '0.72rem', color: '#7F8C9A', background: '#F4F6F9', borderRadius: 20, padding: '2px 8px' }}>{alert.neets} NEETs affected</span>}
                      <button style={{ padding: '5px 14px', background: cfg.color, color: 'white', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>{alert.action}</button>
                    </div>
                  </div>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#A0ADB8', flexShrink: 0 }}><X size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Rules */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Alert Rules</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {['Rule Name','Trigger Condition','Severity','Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#7F8C9A', borderBottom: '1px solid #E8ECF0', fontSize: '0.72rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alertRules.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < alertRules.length - 1 ? '1px solid #F4F6F9' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1A2B3C' }}>{r.name}</td>
                  <td style={{ padding: '10px 12px', color: '#7F8C9A', fontSize: '0.75rem' }}>{r.trigger}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: severityConfig[r.severity].bg, color: severityConfig[r.severity].color, borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{severityConfig[r.severity].label}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 20, borderRadius: 10, background: r.enabled ? '#00B8A9' : '#E8ECF0', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: r.enabled ? 18 : 3, transition: 'left 0.2s' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: r.enabled ? '#27AE60' : '#7F8C9A' }}>{r.enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
