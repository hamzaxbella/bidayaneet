'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FilePlus2,
  Filter,
  MapPin,
  Send,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import PlatformSwitcher from '@/components/PlatformSwitcher';
import PartnerLogo from '@/components/PartnerLogo';

type ReferralStatus = 'New' | 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected';
type Priority = 'High' | 'Medium' | 'Low';

type Referral = {
  id: number;
  name: string;
  age: number;
  commune: string;
  program: string;
  match: number;
  status: ReferralStatus;
  priority: Priority;
  notes: string;
};

type Opportunity = {
  id: number;
  title: string;
  type: string;
  commune: string;
  capacity: number;
  filled: number;
  deadline: string;
  status: 'Open' | 'Full' | 'Draft';
};

type Activity = {
  id: number;
  text: string;
  time: string;
  color: string;
};

const initialReferrals: Referral[] = [
  { id: 1, name: 'Yassine El Amrani', age: 22, commune: 'Agadir', program: 'OFPPT Auto Mechanics', match: 92, status: 'New', priority: 'High', notes: 'Needs transport support before orientation.' },
  { id: 2, name: 'Fatima Zahra A.', age: 19, commune: 'Inezgane', program: 'Digital Marketing Bootcamp', match: 88, status: 'Shortlisted', priority: 'Medium', notes: 'Strong profile for morning cohort.' },
  { id: 3, name: 'Omar T.', age: 24, commune: 'Taroudant', program: 'Local Internship', match: 81, status: 'Interview', priority: 'Medium', notes: 'Interview scheduled with local employer.' },
  { id: 4, name: 'Saima E.', age: 21, commune: 'Tiznit', program: 'INDH Entrepreneurship', match: 76, status: 'New', priority: 'High', notes: 'Family approval pending.' },
];

const initialOpportunities: Opportunity[] = [
  { id: 1, title: 'Auto Mechanics Cohort', type: 'Training', commune: 'Agadir', capacity: 25, filled: 18, deadline: 'Jun 15', status: 'Open' },
  { id: 2, title: 'Welding Certification', type: 'Training', commune: 'Taroudant', capacity: 18, filled: 11, deadline: 'Jun 08', status: 'Open' },
  { id: 3, title: 'Job Readiness Workshop', type: 'Workshop', commune: 'Tiznit', capacity: 40, filled: 40, deadline: 'May 30', status: 'Full' },
];

const statusFlow: ReferralStatus[] = ['New', 'Shortlisted', 'Interview', 'Accepted'];
const statusColors: Record<ReferralStatus, string> = {
  New: '#2E86C1',
  Shortlisted: '#00B8A9',
  Interview: '#F5A623',
  Accepted: '#27AE60',
  Rejected: '#E74C3C',
};

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #1B4F72, #00B8A9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.34, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function priorityColor(priority: Priority) {
  if (priority === 'High') return '#E74C3C';
  if (priority === 'Medium') return '#F5A623';
  return '#27AE60';
}

function nextStatus(status: ReferralStatus) {
  const index = statusFlow.indexOf(status);
  if (index === -1) return status;
  return statusFlow[Math.min(index + 1, statusFlow.length - 1)];
}

function StatCard({ label, value, note, icon, color, bg }: { label: string; value: string; note: string; icon: ReactNode; color: string; bg: string }) {
  return (
    <div className="kpi-card" style={{ flex: 1, borderRadius: 8, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#7F8C9A', fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: '1.85rem', color: '#1A2B3C', fontWeight: 800, marginTop: 5 }}>{value}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      </div>
      <div style={{ color: '#7F8C9A', fontSize: '0.75rem', fontWeight: 500 }}>{note}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
      <div>
        <h2 className="section-title">{title}</h2>
        <p style={{ color: '#7F8C9A', fontSize: '0.73rem', marginTop: 4, lineHeight: 1.35 }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export default function ProgramCollaboratorPage() {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [selectedId, setSelectedId] = useState(initialReferrals[0].id);
  const [statusFilter, setStatusFilter] = useState<'All' | ReferralStatus>('All');
  const [feedback, setFeedback] = useState('Partner workspace ready');
  const [replyDraft, setReplyDraft] = useState('');
  const [newOpportunity, setNewOpportunity] = useState({ title: '', type: 'Training', commune: 'Agadir', capacity: '20', deadline: 'Jun 30' });
  const [activity, setActivity] = useState<Activity[]>([
    { id: 1, text: 'Shortlisted Fatima for digital cohort', time: '09:10', color: '#00B8A9' },
    { id: 2, text: 'Updated capacity for Auto Mechanics Cohort', time: 'Yesterday', color: '#2E86C1' },
    { id: 3, text: 'Sent placement feedback to regional team', time: 'Yesterday', color: '#27AE60' },
  ]);

  const selectedReferral = referrals.find(item => item.id === selectedId) ?? referrals[0];
  const filteredReferrals = referrals.filter(item => statusFilter === 'All' || item.status === statusFilter);
  const openCapacity = opportunities.reduce((sum, item) => sum + Math.max(0, item.capacity - item.filled), 0);
  const acceptedCount = referrals.filter(item => item.status === 'Accepted').length;
  const averageMatch = useMemo(() => Math.round(referrals.reduce((sum, item) => sum + item.match, 0) / referrals.length), [referrals]);

  function log(text: string, color = '#00B8A9') {
    setActivity(current => [{ id: Date.now(), text, time: 'Just now', color }, ...current].slice(0, 7));
    setFeedback(text);
  }

  function updateReferral(id: number, patch: Partial<Referral>) {
    setReferrals(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
  }

  function advanceReferral(id: number) {
    const referral = referrals.find(item => item.id === id);
    if (!referral || referral.status === 'Accepted' || referral.status === 'Rejected') return;
    const updatedStatus = nextStatus(referral.status);
    updateReferral(id, { status: updatedStatus });
    log(`${referral.name} moved to ${updatedStatus}`, statusColors[updatedStatus]);
  }

  function rejectReferral(id: number) {
    const referral = referrals.find(item => item.id === id);
    if (!referral) return;
    updateReferral(id, { status: 'Rejected' });
    log(`${referral.name} rejected with feedback required`, '#E74C3C');
  }

  function acceptReferral(id: number) {
    const referral = referrals.find(item => item.id === id);
    if (!referral) return;
    updateReferral(id, { status: 'Accepted' });
    setOpportunities(current => current.map(item => item.title === referral.program ? { ...item, filled: Math.min(item.capacity, item.filled + 1) } : item));
    log(`${referral.name} accepted into ${referral.program}`, '#27AE60');
  }

  function saveFeedback() {
    if (!replyDraft.trim()) return;
    updateReferral(selectedReferral.id, { notes: replyDraft.trim() });
    setReplyDraft('');
    log(`Saved partner feedback for ${selectedReferral.name}`, '#2E86C1');
  }

  function addOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newOpportunity.title.trim()) {
      setFeedback('Opportunity title is required');
      return;
    }
    const created: Opportunity = {
      id: Date.now(),
      title: newOpportunity.title.trim(),
      type: newOpportunity.type,
      commune: newOpportunity.commune,
      capacity: Number(newOpportunity.capacity) || 1,
      filled: 0,
      deadline: newOpportunity.deadline,
      status: 'Open',
    };
    setOpportunities(current => [created, ...current]);
    setNewOpportunity({ title: '', type: 'Training', commune: 'Agadir', capacity: '20', deadline: 'Jun 30' });
    log(`Published opportunity: ${created.title}`, '#00B8A9');
  }

  function increaseCapacity(id: number) {
    setOpportunities(current => current.map(item => item.id === id ? { ...item, capacity: item.capacity + 5, status: 'Open' } : item));
    const item = opportunities.find(opportunity => opportunity.id === id);
    if (item) log(`Added 5 seats to ${item.title}`, '#2E86C1');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #E8ECF0', padding: '14px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <PlatformSwitcher width={132} height={54} />
          <div style={{ width: 1, height: 36, background: '#E8ECF0' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.25rem', color: '#1A2B3C', fontWeight: 800 }}>Program Collaborator Portal</h1>
            <p style={{ fontSize: '0.78rem', color: '#7F8C9A', marginTop: 2 }}>OFPPT Souss-Massa - referrals, capacity, placements, and feedback</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F6FFFD', border: '1px solid #CFF2EE', borderRadius: 8, padding: '8px 11px', color: '#007D73', fontSize: '0.76rem', fontWeight: 800 }}>
            <CheckCircle2 size={14} /> {feedback}
          </div>
          <PartnerLogo name="OFPPT Training" size={42} />
        </div>
      </header>

      <main style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <section style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F6FFFD 100%)', border: '1px solid #D9F2EF', borderRadius: 8, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#E0F7F5', color: '#008B80', borderRadius: 999, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800, marginBottom: 8 }}>
              <BriefcaseBusinessIcon /> Partner operations
            </div>
            <h2 style={{ color: '#1A2B3C', fontSize: '1.35rem', fontWeight: 800 }}>Manage referrals from BidayaNeet</h2>
            <p style={{ color: '#7F8C9A', fontSize: '0.82rem', marginTop: 4 }}>Review matched candidates, open new seats, schedule interviews, and send placement feedback to the regional team.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 112px)', gap: 10, textAlign: 'center' }}>
            <div style={{ background: 'white', border: '1px solid #E8ECF0', borderRadius: 8, padding: 10 }}><strong style={{ display: 'block', color: '#2E86C1', fontSize: '1.1rem' }}>{referrals.length}</strong><span style={{ color: '#7F8C9A', fontSize: '0.68rem' }}>referrals</span></div>
            <div style={{ background: 'white', border: '1px solid #E8ECF0', borderRadius: 8, padding: 10 }}><strong style={{ display: 'block', color: '#00B8A9', fontSize: '1.1rem' }}>{openCapacity}</strong><span style={{ color: '#7F8C9A', fontSize: '0.68rem' }}>open seats</span></div>
            <div style={{ background: 'white', border: '1px solid #E8ECF0', borderRadius: 8, padding: 10 }}><strong style={{ display: 'block', color: '#F5A623', fontSize: '1.1rem' }}>{averageMatch}%</strong><span style={{ color: '#7F8C9A', fontSize: '0.68rem' }}>avg match</span></div>
          </div>
        </section>

        <section style={{ display: 'flex', gap: 16 }}>
          <StatCard label="Incoming Referrals" value={`${referrals.filter(item => item.status !== 'Accepted' && item.status !== 'Rejected').length}`} note="awaiting partner action" icon={<Users size={21} />} color="#2E86C1" bg="#EBF5FB" />
          <StatCard label="Accepted Placements" value={`${acceptedCount}`} note="confirmed by collaborator" icon={<UserCheck size={21} />} color="#27AE60" bg="#EAFAF1" />
          <StatCard label="Published Offers" value={`${opportunities.length}`} note={`${openCapacity} seats available`} icon={<FilePlus2 size={21} />} color="#00B8A9" bg="#E0F7F5" />
          <StatCard label="Interviews" value={`${referrals.filter(item => item.status === 'Interview').length}`} note="scheduled this week" icon={<CalendarClock size={21} />} color="#F5A623" bg="#FEF9E7" />
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.85fr', gap: 20, alignItems: 'start' }}>
          <div className="card" style={{ padding: 20, borderRadius: 8 }}>
            <SectionHeader
              title="Referral Pipeline"
              subtitle="Act on candidates sent by mediators and the regional matching engine."
              action={(
                <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'All' | ReferralStatus)} style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '7px 9px', background: 'white', fontSize: '0.78rem' }}>
                  <option>All</option>
                  {(['New', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'] as ReferralStatus[]).map(status => <option key={status}>{status}</option>)}
                </select>
              )}
            />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    {['Candidate', 'Program', 'Match', 'Status', 'Priority', 'Actions'].map(header => (
                      <th key={header} style={{ padding: '8px 10px', textAlign: 'left', color: '#7F8C9A', fontSize: '0.72rem', borderBottom: '1px solid #E8ECF0', fontWeight: 700 }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((item, index) => (
                    <tr key={item.id} onClick={() => setSelectedId(item.id)} style={{ borderBottom: index < filteredReferrals.length - 1 ? '1px solid #F4F6F9' : 'none', background: selectedId === item.id ? '#F6FFFD' : 'transparent', cursor: 'pointer' }}>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar name={item.name} size={30} />
                          <div><strong style={{ color: '#1A2B3C' }}>{item.name}</strong><div style={{ color: '#7F8C9A', fontSize: '0.7rem' }}>{item.age} years - {item.commune}</div></div>
                        </div>
                      </td>
                      <td style={{ padding: '10px', color: '#4A5568' }}>{item.program}</td>
                      <td style={{ padding: '10px', color: '#1A2B3C', fontWeight: 800 }}>{item.match}%</td>
                      <td style={{ padding: '10px' }}><span style={{ color: statusColors[item.status], background: `${statusColors[item.status]}16`, borderRadius: 999, padding: '4px 9px', fontSize: '0.72rem', fontWeight: 800 }}>{item.status}</span></td>
                      <td style={{ padding: '10px' }}><span style={{ color: priorityColor(item.priority), fontWeight: 800 }}>{item.priority}</span></td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" onClick={(event) => { event.stopPropagation(); advanceReferral(item.id); }} title="Advance" style={{ border: '1px solid #E8ECF0', background: 'white', borderRadius: 7, padding: 6, cursor: 'pointer', display: 'flex' }}><TrendingUp size={13} color="#00B8A9" /></button>
                          <button type="button" onClick={(event) => { event.stopPropagation(); acceptReferral(item.id); }} title="Accept" style={{ border: '1px solid #E8ECF0', background: 'white', borderRadius: 7, padding: 6, cursor: 'pointer', display: 'flex' }}><CheckCircle2 size={13} color="#27AE60" /></button>
                          <button type="button" onClick={(event) => { event.stopPropagation(); rejectReferral(item.id); }} title="Reject" style={{ border: '1px solid #E8ECF0', background: 'white', borderRadius: 7, padding: 6, cursor: 'pointer', display: 'flex' }}><XCircle size={13} color="#E74C3C" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ padding: 20, borderRadius: 8 }}>
            <SectionHeader title="Selected Referral" subtitle="Review notes and send feedback to mediators." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Avatar name={selectedReferral.name} size={38} />
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A2B3C' }}>{selectedReferral.name}</div>
                <div style={{ color: '#7F8C9A', fontSize: '0.72rem' }}>{selectedReferral.commune} - {selectedReferral.match}% match</div>
              </div>
            </div>
            <div style={{ background: '#F9FAFB', border: '1px solid #E8ECF0', borderRadius: 8, padding: 10, color: '#4A5568', fontSize: '0.76rem', lineHeight: 1.45, marginBottom: 10 }}>
              {selectedReferral.notes}
            </div>
            <textarea value={replyDraft} onChange={event => setReplyDraft(event.target.value)} placeholder="Write partner feedback, missing documents, or interview result" style={{ width: '100%', minHeight: 96, resize: 'vertical', border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.78rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
              <button type="button" onClick={saveFeedback} className="btn-primary" style={{ justifyContent: 'center' }}><Send size={14} /> Send feedback</button>
              <button type="button" onClick={() => advanceReferral(selectedReferral.id)} className="btn-outline" style={{ justifyContent: 'center' }}><CalendarClock size={14} /> Schedule</button>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          <div className="card" style={{ padding: 20, borderRadius: 8 }}>
            <SectionHeader title="Opportunity Capacity" subtitle="Maintain available seats and publish new opportunities." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {opportunities.map(item => {
                const pct = Math.min(100, Math.round((item.filled / item.capacity) * 100));
                return (
                  <div key={item.id} style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ color: '#1A2B3C', fontWeight: 800, fontSize: '0.82rem' }}>{item.title}</div>
                        <div style={{ color: '#7F8C9A', fontSize: '0.7rem', marginTop: 2 }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{item.commune} - {item.type} - Deadline {item.deadline}</div>
                      </div>
                      <button type="button" onClick={() => increaseCapacity(item.id)} className="btn-outline" style={{ padding: '6px 9px', fontSize: '0.72rem' }}>+5 seats</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <div style={{ flex: 1, height: 8, background: '#F4F6F9', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#E74C3C' : '#00B8A9' }} /></div>
                      <strong style={{ color: '#1A2B3C', fontSize: '0.76rem' }}>{item.filled}/{item.capacity}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20, borderRadius: 8 }}>
            <SectionHeader title="Publish Opportunity" subtitle="Create a training, workshop, internship, or hiring slot for NEET matching." />
            <form onSubmit={addOpportunity} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={newOpportunity.title} onChange={event => setNewOpportunity({ ...newOpportunity, title: event.target.value })} placeholder="Opportunity title" style={{ gridColumn: '1 / -1', border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontSize: '0.8rem' }} />
              <select value={newOpportunity.type} onChange={event => setNewOpportunity({ ...newOpportunity, type: event.target.value })} style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontSize: '0.8rem', background: 'white' }}>
                {['Training', 'Workshop', 'Internship', 'Hiring'].map(item => <option key={item}>{item}</option>)}
              </select>
              <select value={newOpportunity.commune} onChange={event => setNewOpportunity({ ...newOpportunity, commune: event.target.value })} style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontSize: '0.8rem', background: 'white' }}>
                {['Agadir', 'Inezgane', 'Taroudant', 'Tiznit', 'Tata'].map(item => <option key={item}>{item}</option>)}
              </select>
              <input value={newOpportunity.capacity} onChange={event => setNewOpportunity({ ...newOpportunity, capacity: event.target.value })} placeholder="Capacity" style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontSize: '0.8rem' }} />
              <input value={newOpportunity.deadline} onChange={event => setNewOpportunity({ ...newOpportunity, deadline: event.target.value })} placeholder="Deadline" style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '9px 10px', fontSize: '0.8rem' }} />
              <button className="btn-primary" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}><FilePlus2 size={14} /> Publish opportunity</button>
            </form>
            <div style={{ marginTop: 16 }}>
              <SectionHeader title="Activity Log" subtitle="Recent collaborator actions synced to the regional admin." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activity.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: item.color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#1A2B3C', fontSize: '0.78rem', fontWeight: 700 }}>{item.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7F8C9A', fontSize: '0.7rem', marginTop: 2 }}><Clock size={12} /> {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: 'white', borderTop: '1px solid #E8ECF0', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', color: '#7F8C9A', fontSize: '0.75rem' }}>
        <span>Program collaborator portal</span>
        <span>BidayaNeet © 2025</span>
      </footer>
    </div>
  );
}

function BriefcaseBusinessIcon() {
  return <Filter size={13} />;
}
