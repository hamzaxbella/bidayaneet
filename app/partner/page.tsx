"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FilePlus2,
  MapPin,
  Send,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
  ArrowRight,
} from "lucide-react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import PartnerLogo from "@/components/PartnerLogo";
import Image from "next/image";
import { useSimulatedState } from "@/lib/simulated-backend";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ReferralStatus =
  | "New"
  | "Shortlisted"
  | "Interview"
  | "Accepted"
  | "Rejected";
type Priority = "High" | "Medium" | "Low";

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
  status: "Open" | "Full" | "Draft";
};

type Activity = {
  id: number;
  text: string;
  time: string;
  color: string;
};

const initialReferrals: Referral[] = [
  {
    id: 1,
    name: "Yassine El Amrani",
    age: 22,
    commune: "Agadir",
    program: "OFPPT Auto Mechanics",
    match: 92,
    status: "New",
    priority: "High",
    notes: "Needs transport support before orientation.",
  },
  {
    id: 2,
    name: "Fatima Zahra A.",
    age: 19,
    commune: "Inezgane",
    program: "Digital Marketing Bootcamp",
    match: 88,
    status: "Shortlisted",
    priority: "Medium",
    notes: "Strong profile for morning cohort.",
  },
  {
    id: 3,
    name: "Omar T.",
    age: 24,
    commune: "Taroudant",
    program: "Local Internship",
    match: 81,
    status: "Interview",
    priority: "Medium",
    notes: "Interview scheduled with local employer.",
  },
  {
    id: 4,
    name: "Saima E.",
    age: 21,
    commune: "Tiznit",
    program: "INDH Entrepreneurship",
    match: 76,
    status: "New",
    priority: "High",
    notes: "Family approval pending.",
  },
];

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Auto Mechanics Cohort",
    type: "Training",
    commune: "Agadir",
    capacity: 25,
    filled: 18,
    deadline: "23 Oct",
    status: "Open",
  },
  {
    id: 2,
    title: "Welding Certification",
    type: "Training",
    commune: "Taroudant",
    capacity: 18,
    filled: 11,
    deadline: "28 Oct",
    status: "Open",
  },
  {
    id: 3,
    title: "Job Readiness Workshop",
    type: "Workshop",
    commune: "Tiznit",
    capacity: 40,
    filled: 40,
    deadline: "30 Oct",
    status: "Full",
  },
];

const statusFlow: ReferralStatus[] = [
  "New",
  "Shortlisted",
  "Interview",
  "Accepted",
];
const statusColors: Record<ReferralStatus, string> = {
  New: "#2E86C1",
  Shortlisted: "#00B8A9",
  Interview: "#F5A623",
  Accepted: "#27AE60",
  Rejected: "#E74C3C",
};

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1B4F72, #00B8A9)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.34,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function priorityColor(priority: Priority) {
  if (priority === "High") return "#E74C3C";
  if (priority === "Medium") return "#F5A623";
  return "#27AE60";
}

function nextStatus(status: ReferralStatus) {
  const index = statusFlow.indexOf(status);
  if (index === -1) return status;
  return statusFlow[Math.min(index + 1, statusFlow.length - 1)];
}

export default function ProgramCollaboratorPage() {
  const [referrals, setReferrals] = useSimulatedState(
    "partner.referrals",
    initialReferrals,
  );
  const [opportunities, setOpportunities] = useSimulatedState(
    "partner.opportunities",
    initialOpportunities,
  );
  const [selectedId, setSelectedId] = useState(initialReferrals[0].id);
  const [statusFilter, setStatusFilter] = useState<"All" | ReferralStatus>(
    "All",
  );
  const [feedback, setFeedback] = useState("Partner workspace ready");
  const [replyDraft, setReplyDraft] = useState("");
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    type: "Training",
    commune: "Agadir",
    capacity: "20",
    deadline: "2026-10-30",
  });
  const [activity, setActivity] = useSimulatedState<Activity[]>(
    "partner.activity",
    [
      {
        id: 1,
        text: "Shortlisted Fatima for digital cohort",
        time: "09:10",
        color: "#00B8A9",
      },
      {
        id: 2,
        text: "Updated capacity for Auto Mechanics Cohort",
        time: "Yesterday",
        color: "#2E86C1",
      },
      {
        id: 3,
        text: "Example placement feedback for regional team",
        time: "Yesterday",
        color: "#27AE60",
      },
    ],
  );

  const selectedReferral =
    referrals.find((item) => item.id === selectedId) ?? referrals[0];
  const filteredReferrals = referrals.filter(
    (item) => statusFilter === "All" || item.status === statusFilter,
  );
  const openCapacity = opportunities.reduce(
    (sum, item) => sum + Math.max(0, item.capacity - item.filled),
    0,
  );
  const acceptedCount = referrals.filter(
    (item) => item.status === "Accepted",
  ).length;
  const averageMatch = useMemo(
    () =>
      Math.round(
        referrals.reduce((sum, item) => sum + item.match, 0) / referrals.length,
      ),
    [referrals],
  );

  function log(text: string, color = "#00B8A9") {
    setActivity((current) =>
      [{ id: Date.now(), text, time: "Just now", color }, ...current].slice(
        0,
        7,
      ),
    );
    setFeedback(text);
  }

  function updateReferral(id: number, patch: Partial<Referral>) {
    setReferrals((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function advanceReferral(id: number) {
    const referral = referrals.find((item) => item.id === id);
    if (
      !referral ||
      referral.status === "Accepted" ||
      referral.status === "Rejected"
    )
      return;
    const updatedStatus = nextStatus(referral.status);
    updateReferral(id, { status: updatedStatus });
    log(
      `${referral.name} moved to ${updatedStatus}`,
      statusColors[updatedStatus],
    );
  }

  function rejectReferral(id: number) {
    const referral = referrals.find((item) => item.id === id);
    if (!referral || referral.status === "Rejected") return;
    if (referral.status === "Accepted") {
      setOpportunities(current => current.map(item =>
        item.title === referral.program || (referral.program === "OFPPT Auto Mechanics" && item.id === 1)
          ? { ...item, filled: Math.max(0, item.filled - 1), status: "Open" }
          : item,
      ));
    }
    updateReferral(id, { status: "Rejected" });
    log(`${referral.name} rejected with feedback required`, "#E74C3C");
  }

  function acceptReferral(id: number) {
    const referral = referrals.find((item) => item.id === id);
    if (!referral || referral.status === "Accepted") return;
    updateReferral(id, { status: "Accepted" });
    setOpportunities((current) =>
      current.map((item) =>
        (item.title === referral.program || (referral.program === "OFPPT Auto Mechanics" && item.id === 1))
          ? { ...item, filled: Math.min(item.capacity, item.filled + 1) }
          : item,
      ),
    );
    log(`${referral.name} accepted into ${referral.program}`, "#27AE60");
  }

  function saveFeedback() {
    if (!replyDraft.trim()) return;
    updateReferral(selectedReferral.id, { notes: replyDraft.trim() });
    setReplyDraft("");
    log(
      `Feedback recorded locally for ${selectedReferral.name}. Nothing was sent.`,
      "#2E86C1",
    );
  }

  function addOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newOpportunity.title.trim()) {
      setFeedback("Opportunity title is required");
      return;
    }
    const capacity = Number(newOpportunity.capacity);
    if (!Number.isSafeInteger(capacity) || capacity < 1) {
      setFeedback("Capacity must be a positive whole number");
      return;
    }
    const created: Opportunity = {
      id: Date.now(),
      title: newOpportunity.title.trim(),
      type: newOpportunity.type,
      commune: newOpportunity.commune,
      capacity,
      filled: 0,
      deadline: newOpportunity.deadline,
      status: "Open",
    };
    setOpportunities((current) => [created, ...current]);
    setNewOpportunity({
      title: "",
      type: "Training",
      commune: "Agadir",
      capacity: "20",
      deadline: "2026-10-30",
    });
    log(`Published opportunity: ${created.title}`, "#00B8A9");
  }

  function increaseCapacity(id: number) {
    setOpportunities((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, capacity: item.capacity + 5, status: "Open" }
          : item,
      ),
    );
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (item) log(`Added 5 seats to ${item.title}`, "#2E86C1");
  }

  function selectReferral(id: number) { setSelectedId(id); setReplyDraft(""); }
  const selectedVisible = filteredReferrals.some((item) => item.id === selectedReferral.id);
  const pendingCount = referrals.filter((item) => item.status !== "Accepted" && item.status !== "Rejected").length;
  return (
    <WorkspaceShell role="partner">
      <div className="partner-content">
        <header className="partner-page-header">
          <div><h1>Partner workspace</h1><p>OFPPT Souss-Massa · programs and referrals</p></div>
          <div role="status" className="partner-feedback"><CheckCircle2 size={16} />{feedback}</div>
          <PartnerLogo name="OFPPT Training" size={42} />
        </header>
        <main>
          <section className="partner-showcase">
            <div className="partner-showcase-copy">
              <span className="eyebrow">YOUR COHORT, YOUR NEXT STEP</span>
              <h2>Turn a referral into a new beginning.</h2>
              <p>{pendingCount} candidates need your attention. Review their profiles, prepare feedback, and keep your available places up to date.</p>
              <div className="partner-showcase-actions">
                <Button asChild><a href="#referrals">Review referrals<ArrowRight data-icon="inline-end" /></a></Button>
                <Button asChild variant="outline"><a href="#programs">Manage programs<FilePlus2 data-icon="inline-end" /></a></Button>
              </div>
            </div>
            <div className="partner-showcase-photo"><Image src="/editorial/partner-training.webp" alt="An instructor and young adults learning a technical skill together" fill sizes="(max-width: 760px) 0px, 240px" /></div>
          </section>
          <section className="partner-stat-strip" aria-label="Partner activity overview">
            {[
              ["Incoming referrals", String(pendingCount), "awaiting your review", Users],
              ["Accepted placements", String(acceptedCount), "confirmed in this demo", UserCheck],
              ["Published offers", String(opportunities.length), `${openCapacity} places available`, FilePlus2],
              ["Interviews", String(referrals.filter(item => item.status === "Interview").length), "ready for the next step", CalendarClock],
            ].map(([label, value, note, Icon]) => { const MetricIcon = Icon as typeof Users; return <div className="kpi-card" key={String(label)}><div><span>{String(label)}</span><MetricIcon size={18} /></div><strong>{String(value)}</strong><small>{String(note)}</small></div>; })}
          </section>
          <section id="referrals" className="partner-referrals-section">
            <Card className="card">
              <CardHeader><div className="partner-section-heading"><div><CardTitle>Referral pipeline</CardTitle><CardDescription>Choose a candidate to review their notes.</CardDescription></div><span className="partner-average">{averageMatch}% average match</span></div>
                <Field><FieldLabel htmlFor="partner-status">Status</FieldLabel><select id="partner-status" aria-label="Filter referrals by status" value={statusFilter} onChange={event => { const value = event.target.value as "All" | ReferralStatus; setStatusFilter(value); const first = referrals.find(item => value === "All" || item.status === value); if (first && !referrals.some(item => item.id === selectedId && (value === "All" || item.status === value))) selectReferral(first.id); }}><option value="All">All</option>{["New", "Shortlisted", "Interview", "Accepted", "Rejected"].map(status => <option key={status} value={status}>{status}</option>)}</select></Field>
              </CardHeader>
              <CardContent><div className="partner-referral-table"><table><caption className="sr-only">Candidates referred to your programs</caption><thead><tr>{["Candidate", "Program", "Match", "Status", "Priority", "Actions"].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>
                {filteredReferrals.map(item => <tr key={item.id} className={selectedId === item.id ? "is-selected" : ""}>
                  <td data-label="Candidate"><div className="partner-person"><Avatar name={item.name} size={32} /><div><button type="button" className="partner-candidate" aria-label={`Select ${item.name}`} aria-pressed={selectedId === item.id} onClick={() => selectReferral(item.id)}>{item.name}</button><small>{item.age} years · {item.commune}</small></div></div></td>
                  <td data-label="Program">{item.program}</td><td data-label="Match"><strong>{item.match}%</strong></td><td data-label="Status"><span className="partner-status" style={{ color: statusColors[item.status], background: `${statusColors[item.status]}16` }}>{item.status}</span></td><td data-label="Priority"><span style={{ color: priorityColor(item.priority) }}>{item.priority}</span></td>
                  <td data-label="Actions"><div className="partner-row-actions"><Button variant="outline" size="icon" title="Advance" aria-label={`Advance ${item.name}`} disabled={item.status === "Accepted" || item.status === "Rejected"} onClick={() => advanceReferral(item.id)}><TrendingUp /></Button><Button variant="outline" size="icon" title="Accept" aria-label={`Accept ${item.name}`} disabled={item.status === "Accepted"} onClick={() => acceptReferral(item.id)}><CheckCircle2 /></Button><Button variant="outline" size="icon" title="Reject" aria-label={`Reject ${item.name}`} disabled={item.status === "Rejected"} onClick={() => rejectReferral(item.id)}><XCircle /></Button></div></td>
                </tr>)}
              </tbody></table></div>{!filteredReferrals.length && <p className="partner-empty">No candidates match this status. Choose another filter to continue.</p>}</CardContent>
            </Card>
            <Card className="card">
              <CardHeader><CardTitle>Selected referral</CardTitle><CardDescription>Review notes and prepare feedback locally.</CardDescription></CardHeader>
              <CardContent>{selectedVisible ? <>
                <div className="partner-selected-person"><Avatar name={selectedReferral.name} size={44} /><div><h3>{selectedReferral.name}</h3><p>{selectedReferral.commune} · {selectedReferral.match}% match</p></div></div>
                <p className="partner-referral-note">{selectedReferral.notes}</p>
                <Field><FieldLabel htmlFor="partner-feedback">Your feedback</FieldLabel><Textarea id="partner-feedback" aria-label="Partner feedback" value={replyDraft} onChange={event => setReplyDraft(event.target.value)} placeholder="Interview notes, documents reviewed, or the next step…" maxLength={2000} /></Field>
                <div className="partner-detail-actions"><Button disabled={!replyDraft.trim()} onClick={saveFeedback}><Send data-icon="inline-start" />Record demo feedback</Button><Button variant="outline" disabled={selectedReferral.status === "Accepted" || selectedReferral.status === "Rejected"} onClick={() => advanceReferral(selectedReferral.id)}><CalendarClock data-icon="inline-start" />Next stage</Button></div>
                <p className="partner-demo-note">Saved on this device. Nothing is sent to the candidate.</p>
              </> : <p className="partner-empty">Select a candidate from the current list to review their notes.</p>}</CardContent>
            </Card>
          </section>
          <section id="programs" className="partner-programs-section">
            <Card className="card"><CardHeader><CardTitle>Opportunity capacity</CardTitle><CardDescription>Keep available places up to date.</CardDescription></CardHeader><CardContent><div className="partner-capacity-list">{opportunities.map(item => { const percent = Math.min(100, Math.round(item.filled / item.capacity * 100)); return <article key={item.id} className="partner-capacity-card"><div><div><h3>{item.title}</h3><p><MapPin size={12} />{item.commune} · {item.type} · {item.deadline}</p></div><Button variant="outline" size="sm" onClick={() => increaseCapacity(item.id)}>+5 seats</Button></div><div className="partner-capacity-progress"><progress value={item.filled} max={item.capacity} aria-label={`Places filled for ${item.title}`} /><strong>{item.filled}/{item.capacity}</strong></div><small>{percent === 100 ? "Cohort full" : `${item.capacity - item.filled} places available`}</small></article>; })}</div></CardContent></Card>
            <Card className="card"><CardHeader><CardTitle>Publish opportunity</CardTitle><CardDescription>Add a training, workshop, internship, or hiring opportunity.</CardDescription></CardHeader><CardContent><form className="partner-offer-form" onSubmit={addOpportunity}><FieldGroup>
              <Field className="partner-form-wide"><FieldLabel htmlFor="partner-offer-title">Title</FieldLabel><Input id="partner-offer-title" aria-label="Opportunity title" required maxLength={160} value={newOpportunity.title} onChange={event => setNewOpportunity({ ...newOpportunity, title: event.target.value })} placeholder="e.g. Regional skills cohort" /></Field>
              <Field><FieldLabel htmlFor="partner-offer-type">Type</FieldLabel><select id="partner-offer-type" aria-label="Opportunity type" value={newOpportunity.type} onChange={event => setNewOpportunity({ ...newOpportunity, type: event.target.value })}>{["Training", "Workshop", "Internship", "Hiring"].map(type => <option key={type}>{type}</option>)}</select></Field>
              <Field><FieldLabel htmlFor="partner-offer-city">City</FieldLabel><select id="partner-offer-city" aria-label="Opportunity commune" value={newOpportunity.commune} onChange={event => setNewOpportunity({ ...newOpportunity, commune: event.target.value })}>{["Agadir", "Inezgane", "Taroudant", "Tiznit", "Tata"].map(city => <option key={city}>{city}</option>)}</select></Field>
              <Field><FieldLabel htmlFor="partner-offer-capacity">Places</FieldLabel><Input id="partner-offer-capacity" aria-label="Opportunity capacity" type="number" min={1} step={1} required value={newOpportunity.capacity} onChange={event => setNewOpportunity({ ...newOpportunity, capacity: event.target.value })} /></Field>
              <Field><FieldLabel htmlFor="partner-offer-deadline">Deadline</FieldLabel><Input id="partner-offer-deadline" aria-label="Opportunity deadline" type="date" required value={newOpportunity.deadline} onChange={event => setNewOpportunity({ ...newOpportunity, deadline: event.target.value })} /></Field>
            </FieldGroup><Button type="submit"><FilePlus2 data-icon="inline-start" />Publish opportunity</Button><p className="partner-demo-note">Creates an example offer on this device.</p></form></CardContent></Card>
          </section>
          <Card id="activity" className="card partner-activity-card"><CardHeader><CardTitle>Activity log</CardTitle><CardDescription>Your latest updates in this demo.</CardDescription></CardHeader><CardContent><div className="partner-activity-list">{activity.map(item => <div key={item.id}><span style={{ background: item.color }} /><div><p>{item.text}</p><small><Clock size={12} />{item.time}</small></div></div>)}</div></CardContent></Card>
        </main>
      </div>
    </WorkspaceShell>
  );
}
