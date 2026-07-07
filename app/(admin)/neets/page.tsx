'use client';

import { Plus, TrendingUp, ChevronRight, ChevronLeft, MoreVertical, Download, Filter, Truck, Heart, Users, BookOpen, DollarSign, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import KPICard from '@/components/KPICard';
import PageHeader from '@/components/PageHeader';

const spark1 = [40,55,45,60,58,72,68,80,75,88,84,92].map(v => ({ v }));
const spark2 = [12,18,14,20,17,24,21,28,25,32,30,38].map(v => ({ v }));
const spark3 = [50,60,55,70,65,80,75,88,82,92,88,96].map(v => ({ v }));
const spark4 = [8,12,10,15,14,18,17,22,20,26,24,30].map(v => ({ v }));

const neetDirectory = [
  { name: 'Yassine El Amrani', avatar: 'YE', commune: 'Agadir',    status: 'Activated',       trust: 'High',   blocker: 'Transport & Mobility', mediator: 'Imane R.',   action: 'Home visit',            date: 'May 31, 2025' },
  { name: 'Fatima Zahra A.',   avatar: 'FZ', commune: 'Inezgane',  status: 'Classification',  trust: 'Medium', blocker: 'Trust & Engagement',   mediator: 'Khalid B.',  action: 'Skills assessment',     date: 'May 30, 2025' },
  { name: 'Omar T.',           avatar: 'OT', commune: 'Taroudant', status: 'Integrated',      trust: 'High',   blocker: 'Skills & Training',     mediator: 'Amina K.',   action: 'Follow-up call',        date: 'May 29, 2025' },
  { name: 'Saima E.',          avatar: 'SE', commune: 'Tiznit',    status: 'Activation',      trust: 'Medium', blocker: 'Family Constraints',   mediator: 'Imane R.',   action: 'Home visit',            date: 'May 29, 2025' },
  { name: 'Rachid D.',         avatar: 'RD', commune: 'Tata',      status: 'Identified',      trust: 'Low',    blocker: 'Dropout Risk',         mediator: 'Youssef M.', action: 'Build trust',           date: 'May 28, 2025' },
  { name: 'Laila B.',          avatar: 'LB', commune: 'Agadir',    status: 'Stabilized (90d)', trust: 'High',  blocker: 'Economic Constraints', mediator: 'Khalid B.',  action: 'Job placement',         date: 'May 27, 2025' },
  { name: 'Hassan A.',         avatar: 'HA', commune: 'Guelmim',   status: 'Classification',  trust: 'Medium', blocker: 'Skills & Training',    mediator: 'Amina K.',   action: 'Skills assessment',     date: 'May 27, 2025' },
  { name: 'Maryem H.',         avatar: 'MH', commune: 'Tata',      status: 'Integrated',      trust: 'High',   blocker: 'Transport & Mobility', mediator: 'Youssef M.', action: 'Employer match',        date: 'May 26, 2025' },
];

const pipelineData = [
  { stage: 'Identified',      count: 502, pct: 27.2, color: '#4A5568' },
  { stage: 'Activated',       count: 412, pct: 22.4, color: '#2E86C1' },
  { stage: 'Classified',      count: 386, pct: 21.0, color: '#8E44AD' },
  { stage: 'Integrated',      count: 347, pct: 18.8, color: '#00B8A9' },
  { stage: 'Stabilized (90d)',count: 195, pct: 10.6, color: '#27AE60' },
];

const commonBlockers = [
  { name: 'Trust & Engagement',    pct: 24.6, count: 453, color: '#E74C3C' },
  { name: 'Transport & Mobility',  pct: 21.3, count: 392, color: '#F5A623' },
  { name: 'Skills & Training',     pct: 19.8, count: 365, color: '#8E44AD' },
  { name: 'Family Constraints',    pct: 14.2, count: 261, color: '#2E86C1' },
  { name: 'Economic Constraints',  pct: 11.1, count: 204, color: '#27AE60' },
  { name: 'Dropout Risk',          pct: 8.7,  count: 160, color: '#E67E22' },
];

const recentActivity = [
  { neet: 'Yassine El Amrani', action: 'Home visit completed',        by: 'Imane R.',   date: 'May 21, 2025', time: '10:30 AM', icon: '🏠' },
  { neet: 'Fatima Zahra A.',   action: 'Skills assessment done',       by: 'Khalid B.',  date: 'May 30, 2025', time: '02:15 PM', icon: '📊' },
  { neet: 'Omar T.',           action: 'Follow-up call',               by: 'Amina K.',   date: 'May 29, 2025', time: '11:45 AM', icon: '📞' },
  { neet: 'Saima E.',          action: 'Referred to training program', by: 'Imane R.',   date: 'May 29, 2025', time: '09:20 AM', icon: '🎓' },
  { neet: 'Rachid D.',         action: 'Initial contact made',         by: 'Youssef M.', date: 'May 28, 2025', time: '04:00 PM', icon: '👋' },
];

const localOpportunities = [
  { title: 'Auto Mechanics Training', org: 'OFPPT - Agadir',      match: 92, matchColor: '#27AE60', tag: 'Agadir' },
  { title: 'Digital Marketing Bootcamp', org: 'StartUp Maroc',    match: 86, matchColor: '#2E86C1', tag: 'Agadir' },
  { title: 'Entrepreneurship Program', org: 'INDH - Souss-Massa', match: 78, matchColor: '#F5A623', tag: 'Inezgane' },
];

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  const colors = ['#00B8A9', '#8E44AD', '#F5A623', '#E74C3C', '#27AE60', '#2E86C1'];
  const idx = initials.charCodeAt(0) % colors.length;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: colors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Activated': 'status-activated', 'Classification': 'status-classification',
    'Integrated': 'status-integrated', 'Activation': 'status-activation',
    'Identified': 'status-identified', 'Stabilized (90d)': 'status-stabilized',
  };
  return <span className={`status-badge ${map[status] || 'status-identified'}`}>{status}</span>;
}

function TrustDot({ level }: { level: string }) {
  const color = level === 'High' ? '#27AE60' : level === 'Medium' ? '#F5A623' : '#E74C3C';
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 5 }} />;
}

function FunnelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 10, background: '#F4F6F9', borderRadius: 5, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 5 }} />
    </div>
  );
}

function DashboardFooter() {
  return (
    <div style={{ background: 'white', borderTop: '1px solid #E8ECF0', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#7F8C9A' }}>
      <span>Linking Youth to Programs and Work</span>
      <div style={{ display: 'flex', gap: 16 }}>
        <a href="#" style={{ color: '#7F8C9A', textDecoration: 'none' }}>Privacy Policy</a>
        <span>•</span>
        <a href="#" style={{ color: '#7F8C9A', textDecoration: 'none' }}>Terms of Service</a>
      </div>
    </div>
  );
}

export default function NEETsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8ECF0', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1A2B3C' }}>NEETs</h1>
            <p style={{ fontSize: '0.78rem', color: '#7F8C9A', marginTop: 2 }}>Manage, track, and follow youth profiles across Souss-Massa</p>
          </div>
          <div style={{ position: 'relative' }}>
            <input type="search" placeholder="Search by name, phone, status..." style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, border: '1px solid #E8ECF0', borderRadius: 8, fontSize: '0.8125rem', color: '#1A2B3C', background: '#F9FAFB', outline: 'none', width: 260 }} />
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <button className="btn-primary"><Plus size={15} /> Add NEET</button>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10 }}>
          {['All Communes', 'All Statuses', 'All Trust Levels', 'Date Added'].map(f => (
            <button key={f} className="btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
              {f} <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI Row */}
        <div style={{ display: 'flex', gap: 16 }}>
          <KPICard title="Total NEETs" value="1,842" change={12.4} changePeriod="vs Apr 1 – Apr 30"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B8A9" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
            iconBg="#E0F7F5" sparkData={spark1} sparkColor="#00B8A9" />
          <KPICard title="Newly Identified" value="186" change={18.7} changePeriod="vs Apr 1 – Apr 30"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E86C1" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>}
            iconBg="#EBF5FB" sparkData={spark2} sparkColor="#2E86C1" />
          <KPICard title="In Follow-up" value="612" change={15.3} changePeriod="vs Apr 1 – Apr 30"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            iconBg="#FEF9E7" sparkData={spark3} sparkColor="#F5A623" />
          <KPICard title="High-Risk Cases" value="145" change={-9.8} changePeriod="vs Apr 1 – Apr 30"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            iconBg="#FDEDEC" sparkData={spark4} sparkColor="#E74C3C" />
        </div>

        {/* NEET Directory */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 className="section-title">NEET Directory</h2>
              <span style={{ fontSize: '0.75rem', color: '#7F8C9A' }}>1,842 profiles</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}><Download size={13} /> Export</button>
              <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}><MoreVertical size={13} /></button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {['Name', 'Commune', 'Status', 'Trust Level', 'Main Blocker', 'Assigned Mediator', 'Next Action', 'Last Updated'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#7F8C9A', borderBottom: '1px solid #E8ECF0', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
                <th style={{ width: 30 }} />
              </tr>
            </thead>
            <tbody>
              {neetDirectory.map((n, i) => (
                <tr key={i} style={{ borderBottom: i < neetDirectory.length - 1 ? '1px solid #F4F6F9' : 'none' }}>
                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar initials={n.avatar} size={28} />
                      <span style={{ fontWeight: 600, color: '#1A2B3C', fontSize: '0.8125rem' }}>{n.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 10px', color: '#4A5568', fontSize: '0.8rem' }}>{n.commune}</td>
                  <td style={{ padding: '10px 10px' }}><StatusBadge status={n.status} /></td>
                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TrustDot level={n.trust} />
                      <span style={{ color: '#4A5568', fontSize: '0.8rem' }}>{n.trust}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 10px', color: '#4A5568', fontSize: '0.78rem' }}>{n.blocker}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar initials={n.mediator.split(' ').map(w => w[0]).join('')} size={22} />
                      <span style={{ color: '#4A5568', fontSize: '0.8rem' }}>{n.mediator}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 10px', color: '#4A5568', fontSize: '0.78rem' }}>{n.action}</td>
                  <td style={{ padding: '10px 10px', color: '#7F8C9A', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{n.date}</td>
                  <td style={{ padding: '10px 10px' }}><MoreVertical size={14} color="#A0ADB8" style={{ cursor: 'pointer' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F4F6F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#7F8C9A' }}>
              Rows per page:
              <select style={{ border: '1px solid #E8ECF0', borderRadius: 6, padding: '3px 6px', fontSize: '0.78rem', color: '#4A5568', background: 'white' }}>
                <option>10</option><option>25</option><option>50</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#4A5568' }}>
              <button style={{ border: '1px solid #E8ECF0', borderRadius: 6, padding: '4px 8px', background: 'white', cursor: 'pointer' }}><ChevronLeft size={13} /></button>
              {[1,2,3,4,5].map(p => (
                <button key={p} style={{ border: p === 1 ? '1px solid #00B8A9' : '1px solid #E8ECF0', borderRadius: 6, padding: '4px 9px', background: p === 1 ? '#E0F7F5' : 'white', color: p === 1 ? '#00B8A9' : '#4A5568', cursor: 'pointer', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
              ))}
              <span>... 185</span>
              <button style={{ border: '1px solid #E8ECF0', borderRadius: 6, padding: '4px 8px', background: 'white', cursor: 'pointer' }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>

        {/* Pipeline + Blockers */}
        <div style={{ display: 'flex', gap: 20 }}>
          {/* NEET Pipeline */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>NEET Pipeline (Status Distribution)</h2>
            <div style={{ fontSize: '0.72rem', color: '#27AE60', fontWeight: 600, marginBottom: 16 }}>
              Conversion Identified → Integrated: 69.1% <span style={{ color: '#E74C3C', marginLeft: 6 }}>↓ 6.3% vs last month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {pipelineData.map((p, i) => (
                <div key={p.stage}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 5, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>{p.stage}</span>
                    <span style={{ fontWeight: 700, color: '#1A2B3C', fontSize: '0.875rem' }}>{p.count}</span>
                    <span style={{ fontSize: '0.75rem', color: '#7F8C9A', width: 38, textAlign: 'right' }}>{p.pct}%</span>
                  </div>
                  <FunnelBar pct={p.pct * 3.67} color={p.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Common Blockers */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="section-title">Common Blockers</h2>
              <button style={{ background: 'none', border: 'none', color: '#00B8A9', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>View all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {commonBlockers.map((b) => (
                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.78rem', color: '#4A5568', width: 150, flexShrink: 0 }}>{b.name}</span>
                  <div style={{ flex: 1, height: 8, background: '#F4F6F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${b.pct * 4}%`, height: '100%', background: b.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#7F8C9A', width: 30, textAlign: 'right' }}>{b.pct}%</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1A2B3C', width: 32, textAlign: 'right' }}>{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Spotlight */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="section-title">Profile Spotlight</h2>
            <button style={{ background: 'none', border: 'none', color: '#00B8A9', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>View Full Profile</button>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Profile info */}
            <div style={{ display: 'flex', gap: 16, flex: '1 1 300px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #00B8A9, #1B4F72)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>YE</div>
                <div style={{ position: 'absolute', bottom: 0, right: -4, background: '#00B8A9', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1A2B3C' }}>Yassine El Amrani</div>
                <span className="status-badge status-activated" style={{ marginTop: 4, display: 'inline-block' }}>Activated</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  <div style={{ fontSize: '0.78rem', color: '#7F8C9A' }}>📍 Agadir</div>
                  <div style={{ fontSize: '0.78rem', color: '#7F8C9A' }}>👤 21 years old</div>
                  <div style={{ fontSize: '0.78rem', color: '#7F8C9A' }}>📞 06 12 34 56 78</div>
                  <div style={{ fontSize: '0.72rem', color: '#A0ADB8' }}>Added on May 10, 2025</div>
                </div>
              </div>
            </div>

            {/* Trust Meter */}
            <div style={{ flex: '0 0 140px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7F8C9A', marginBottom: 8 }}>Trust Level</div>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 6px' }}>
                <PieChart width={80} height={80}>
                  <Pie data={[{ v: 78 }, { v: 22 }]} cx={35} cy={35} innerRadius={24} outerRadius={36} startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0}>
                    <Cell fill="#27AE60" />
                    <Cell fill="#E8ECF0" />
                  </Pie>
                </PieChart>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#1A2B3C' }}>78%</div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#27AE60' }}>● High</div>
            </div>

            {/* Main Blockers */}
            <div style={{ flex: '1 1 160px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7F8C9A', marginBottom: 8 }}>Main Blockers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[{ label: 'Transport & Mobility', color: '#F5A623' }, { label: 'Skills & Training', color: '#8E44AD' }].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#4A5568' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, flexShrink: 0, display: 'inline-block' }} />
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div style={{ flex: '1 1 120px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7F8C9A', marginBottom: 8 }}>Interests</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Automotive', 'Digital', 'Entrepreneurship'].map(tag => (
                  <span key={tag} style={{ background: '#E0F7F5', color: '#00B8A9', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Recent Micro-actions */}
            <div style={{ flex: '1 1 180px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7F8C9A', marginBottom: 8 }}>Recent Micro-actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { action: 'Home visit completed', date: 'May 31' },
                  { action: 'Skills assessment done', date: 'May 30' },
                  { action: 'Follow-up call', date: 'May 29' },
                ].map(a => (
                  <div key={a.action} style={{ fontSize: '0.78rem', color: '#4A5568', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#00B8A9' }}>✓</span>
                    <span>{a.action}</span>
                    <span style={{ color: '#A0ADB8', fontSize: '0.7rem', marginLeft: 'auto' }}>{a.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Step */}
            <div style={{ flex: '0 0 200px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7F8C9A', marginBottom: 8 }}>Recommended Next Step</div>
              <div style={{ border: '1px solid #E8ECF0', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🏠</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1A2B3C', marginBottom: 4 }}>Schedule home visit</div>
                <div style={{ fontSize: '0.72rem', color: '#7F8C9A', marginBottom: 10, lineHeight: 1.4 }}>Build trust and explore mobility options.</div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>Schedule Visit</button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity + Local Opportunities */}
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Recent Activity */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Recent Activity & Follow-ups</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid #F4F6F9' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1A2B3C' }}>{a.neet}</div>
                    <div style={{ fontSize: '0.78rem', color: '#4A5568' }}>{a.action} <span style={{ color: '#7F8C9A' }}>by {a.by}</span></div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: '#7F8C9A' }}>{a.date}</div>
                    <div style={{ fontSize: '0.68rem', color: '#A0ADB8' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 12, width: '100%', padding: '9px', border: '1px solid #E8ECF0', borderRadius: 8, background: 'white', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>
              View All Activities
            </button>
          </div>

          {/* Local Opportunities */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="section-title">Local Opportunities Matching</h2>
              <button style={{ background: 'none', border: 'none', color: '#00B8A9', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>View all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {localOpportunities.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', border: '1px solid #F4F6F9', borderRadius: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {i === 0 ? '🔧' : i === 1 ? '💻' : '🚀'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1A2B3C' }}>{o.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#7F8C9A' }}>{o.org}</div>
                    <span style={{ fontSize: '0.68rem', background: '#E0F7F5', color: '#00B8A9', borderRadius: 20, padding: '1px 7px', fontWeight: 600 }}>📍 {o.tag}</span>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: 48, height: 48 }}>
                      <PieChart width={48} height={48}>
                        <Pie data={[{ v: o.match }, { v: 100 - o.match }]} cx={20} cy={20} innerRadius={14} outerRadius={22} startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0}>
                          <Cell fill={o.matchColor} />
                          <Cell fill="#E8ECF0" />
                        </Pie>
                      </PieChart>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#1A2B3C' }}>{o.match}%</div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#7F8C9A' }}>match</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 12, width: '100%', padding: '9px', border: '1px solid #E8ECF0', borderRadius: 8, background: 'white', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>
              View All Opportunities
            </button>
          </div>
        </div>

      </div>
      <DashboardFooter />
    </div>
  );
}
