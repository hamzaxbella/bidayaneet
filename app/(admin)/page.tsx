"use client";

import { useState } from "react";
import { Choice } from "@/components/admin/AdminUI";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Search, ArrowUpRight } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader, PipelineCard, BlockersCard, ViewAll, RecordRow } from "@/components/admin/AdminUI";
import { neetSeed, programSeed, mediatorSeed } from "@/lib/admin-demo";
import { useSimulatedState } from "@/lib/simulated-backend";
import {
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MoroccoMap from "@/components/MoroccoMap";
import KPICard from "@/components/KPICard";
import PartnerLogo from "@/components/PartnerLogo";

/* ── Mock data ── */
const spark1 = [40, 55, 45, 60, 58, 72, 68, 80, 75, 88, 84, 92].map((v) => ({
  v,
}));
const spark2 = [30, 42, 38, 55, 50, 62, 58, 70, 68, 78, 74, 85].map((v) => ({
  v,
}));
const spark3 = [20, 28, 25, 35, 32, 40, 38, 48, 46, 55, 52, 60].map((v) => ({
  v,
}));
const spark4 = [8, 12, 10, 15, 14, 18, 17, 22, 20, 26, 24, 30].map((v) => ({
  v,
}));

const journeyData = [
  {
    month: "Jun'24",
    detected: 420,
    activated: 210,
    integrated: 130,
    stabilized: 45,
  },
  {
    month: "Jul'24",
    detected: 490,
    activated: 260,
    integrated: 160,
    stabilized: 60,
  },
  {
    month: "Aug'24",
    detected: 540,
    activated: 310,
    integrated: 195,
    stabilized: 75,
  },
  {
    month: "Sep'24",
    detected: 620,
    activated: 370,
    integrated: 230,
    stabilized: 90,
  },
  {
    month: "Oct'24",
    detected: 710,
    activated: 430,
    integrated: 270,
    stabilized: 105,
  },
  {
    month: "Nov'24",
    detected: 800,
    activated: 490,
    integrated: 310,
    stabilized: 120,
  },
  {
    month: "Dec'24",
    detected: 880,
    activated: 560,
    integrated: 360,
    stabilized: 140,
  },
  {
    month: "Jan'25",
    detected: 960,
    activated: 640,
    integrated: 420,
    stabilized: 170,
  },
  {
    month: "Feb'25",
    detected: 1100,
    activated: 720,
    integrated: 490,
    stabilized: 200,
  },
  {
    month: "Mar'25",
    detected: 1300,
    activated: 830,
    integrated: 560,
    stabilized: 240,
  },
  {
    month: "Apr'25",
    detected: 1560,
    activated: 960,
    integrated: 630,
    stabilized: 280,
  },
  {
    month: "May'25",
    detected: 1842,
    activated: 1102,
    integrated: 682,
    stabilized: 321,
  },
];

const programs = [
  {
    name: "ANAPEC",
    desc: "Job placement & career guidance",
    opportunities: 124,
    color: "#E74C3C",
  },
  {
    name: "Ministry of Tourism, Handicrafts and SSE",
    desc: "Tourism and hospitality pathways",
    opportunities: 74,
    color: "#1976A3",
  },
  {
    name: "ONMT Tourism Careers",
    desc: "Visitor services and promotion roles",
    opportunities: 52,
    color: "#2E86C1",
  },
  {
    name: "Ministry of Agriculture",
    desc: "Agriculture and rural development",
    opportunities: 91,
    color: "#248A3D",
  },
  {
    name: "ADA Agripreneurship",
    desc: "Young rural entrepreneur support",
    opportunities: 68,
    color: "#6A9F2A",
  },
  {
    name: "Ministry of Economic Inclusion",
    desc: "Small business and skills pathways",
    opportunities: 103,
    color: "#5B4B8A",
  },
];

const soussMassaHeatPoints = [
  { name: "Agadir", lat: 30.4278, lng: -9.5981, neets: 680 },
  { name: "Inezgane", lat: 30.3563, lng: -9.5364, neets: 420 },
  { name: "Ait Melloul", lat: 30.3342, lng: -9.4979, neets: 140 },
  { name: "Aourir", lat: 30.4926, lng: -9.6372, neets: 118 },
  { name: "Oulad Teima", lat: 30.3947, lng: -9.2089, neets: 210 },
  { name: "Taroudant", lat: 30.4727, lng: -8.8749, neets: 280 },
  { name: "Biougra", lat: 30.2144, lng: -9.3711, neets: 87 },
  { name: "Massa", lat: 29.9457, lng: -9.6334, neets: 94 },
  { name: "Tiznit", lat: 29.6974, lng: -9.7316, neets: 215 },
  { name: "Tafraout", lat: 29.7244, lng: -8.9747, neets: 76 },
  { name: "Tata", lat: 29.7441, lng: -7.9736, neets: 120 },
  { name: "Akka", lat: 29.4071, lng: -8.2521, neets: 68 },
];

function TrustDot({ level }: { level: string }) {
  const color =
    level === "High" ? "#27AE60" : level === "Medium" ? "#F5A623" : "#E74C3C";
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        marginRight: 5,
      }}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Activated: "status-activated",
    Classification: "status-classification",
    Integrated: "status-integrated",
    Activation: "status-activation",
    Identified: "status-identified",
    "Stabilized (90d)": "status-stabilized",
  };
  return (
    <span className={`status-badge ${map[status] || "status-identified"}`}>
      {status}
    </span>
  );
}

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  const colors = [
    "#00B8A9",
    "#8E44AD",
    "#F5A623",
    "#E74C3C",
    "#27AE60",
    "#2E86C1",
  ];
  const idx = initials.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors[idx],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function SoussaMassaMap() {
  return (
    <MoroccoMap
      height={400}
      points={soussMassaHeatPoints.map((point) => ({
        ...point,
        value: point.neets,
      }))}
    />
  );
}

/* ── Custom funnel bar ── */
export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Last 12 months");
  const [recentNEETs] = useSimulatedState("admin.neets", neetSeed);
  const [allPrograms] = useSimulatedState("admin.programs", programSeed);
  const [allMediators] = useSimulatedState("admin.mediators", mediatorSeed);
  const filteredNEETs = recentNEETs.filter((person) => Object.values(person).join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const chartData = journeyData.slice(period === "Last 6 months" ? -6 : 0);
  const active = allMediators.filter((mediator) => mediator.status === "active").length;
  const activeRate = Math.round(active / Math.max(1, allMediators.length) * 100);
  const rates = [{ label: "30 Days", pct: 78, change: 4 }, { label: "60 Days", pct: 62, change: 5 }, { label: "90 Days", pct: 48, change: 4 }];
  return (
    <div className="admin-page admin-dashboard">
      <AdminHeader title="Main Dashboard" description="Regional monitoring for Souss-Massa" action={
        <Button variant="outline" onClick={() => downloadCsv("bidayaneet-regional-overview-demo.csv", [["Month", "Detected", "Activated", "Integrated", "Stabilized", "Reporting scope", "Source"], ...chartData.map((row) => [row.month, row.detected, row.activated, row.integrated, row.stabilized, period, "Demonstration"]) ])}>Export overview<ArrowUpRight data-icon="inline-end" /></Button>
      } />
      <div className="admin-content">
        <p className="admin-muted admin-reporting-period">May 2025 · Souss-Massa · Sample reporting period</p>
        <div className="admin-kpi-grid">
          {[{ title: "Detected NEETs", value: "1,842", change: 12.4, data: spark1 }, { title: "Activated", value: "1,102", change: 18.7, data: spark2 }, { title: "Integrated", value: "682", change: 15.3, data: spark3 }, { title: "Stabilized at 90 days", value: "321", change: 9.8, data: spark4 }].map((metric) => <KPICard key={metric.title} title={metric.title} value={metric.value} change={metric.change} changePeriod="vs previous month" icon={<TrendingUp size={20} />} iconBg="var(--secondary)" sparkData={metric.data} sparkColor="var(--primary)" />)}
        </div>
        <div className="admin-dashboard-top">
          <div className="admin-dashboard-chart-stack">
            <section className="card admin-insight-card admin-journey-chart">
              <div className="admin-section-header"><h2 className="section-title">Journey Progression (Monthly)</h2><Choice label="Journey chart period" value={period} onChange={setPeriod} options={["Last 12 months", "Last 6 months"]} /></div>
              <div className="admin-chart-legend">{[{ label: "Detected", color: "#008477" }, { label: "Activated", color: "#358fba" }, { label: "Integrated", color: "#6fa891" }, { label: "Stabilized (90d)", color: "#d79443" }].map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</div>
              <div role="img" aria-label={`Journey progression for the ${period.toLowerCase()}. Detected 1842, activated 1102, integrated 682 and stabilized 321 in May 2025.`}>
                <ResponsiveContainer width="100%" height={220} initialDimension={{ width: 560, height: 220 }}><LineChart data={chartData} margin={{ top: 8, right: 10, bottom: 5, left: -15 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} minTickGap={25} /><YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />{[{ key: "detected", color: "#008477" }, { key: "activated", color: "#358fba" }, { key: "integrated", color: "#6fa891" }, { key: "stabilized", color: "#d79443" }].map((line) => <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2.5} dot={false} />)}</LineChart></ResponsiveContainer>
              </div>
            </section>
            <PipelineCard />
          </div>
          <section className="card admin-insight-card admin-dashboard-map"><div className="admin-section-header"><div><h2 className="section-title">NEET Density Heatmap</h2><p className="admin-muted">National view · sample coverage in Souss-Massa</p></div><Button asChild variant="ghost" size="icon" aria-label="Open full heatmap"><Link href="/heatmap"><ArrowUpRight /></Link></Button></div><SoussaMassaMap /></section>
        </div>
        <div className="admin-dashboard-directory-row">
          <section className="card admin-insight-card">
            <div className="admin-section-header"><h2 className="section-title">Recent NEET Profiles</h2><ViewAll title="All NEET profiles">{recentNEETs.map((person) => <RecordRow key={person.id} name={person.name} detail={`${person.commune} · ${person.mediator}`} aside={<Button asChild variant="outline" size="sm"><Link href={`/neets?profile=${person.id}`}>View profile</Link></Button>} />)}</ViewAll></div>
            <InputGroup className="admin-dashboard-search"><InputGroupInput aria-label="Search NEET profiles" placeholder="Search name, commune, mediator…" value={query} onChange={(event) => setQuery(event.target.value)} /><InputGroupAddon><Search /></InputGroupAddon></InputGroup>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th scope="col">Profile</th><th scope="col">Journey</th><th scope="col">Trust</th><th scope="col">Action</th></tr></thead><tbody>{filteredNEETs.slice(0, 5).map((person) => <tr key={person.id}><td><span className="admin-profile-name"><Avatar initials={person.avatar} /><span>{person.name}<small>{person.commune}</small></span></span></td><td><StatusBadge status={person.status} /></td><td><TrustDot level={person.trust} />{person.trust}</td><td><Button asChild variant="outline" size="sm"><Link href={`/neets?profile=${person.id}`} aria-label={`View profile for ${person.name}`}>View profile</Link></Button></td></tr>)}</tbody></table></div>
            {!filteredNEETs.length && <p className="admin-empty">No profiles match your search.</p>}
            <p className="admin-muted admin-results-note">{filteredNEETs.length} profiles · showing up to 5</p>
          </section>
          <BlockersCard />
        </div>
        <section className="card admin-insight-card admin-dashboard-programs"><div className="admin-section-header"><h2 className="section-title">Opportunities & Collaborating Programs</h2><ViewAll title="All collaborating programs">{allPrograms.map((program) => <RecordRow key={program.id} name={program.name} detail={program.desc} aside={<Button asChild variant="outline" size="sm"><Link href={`/programs/${program.id}`}>View program</Link></Button>} />)}</ViewAll></div>
          <div className="admin-partner-grid">{programs.map((highlight) => { const original = programSeed.find((program) => program.name === highlight.name); const program = allPrograms.find((program) => program.id === original?.id); if (!program) return null; return <article className="admin-partner-card" key={program.id}><div><PartnerLogo name={highlight.name} size={50} /><div><strong>{program.name}</strong><p>{program.desc}</p></div></div><div className="admin-partner-count"><strong>{highlight.opportunities}</strong>opportunities</div><Button asChild><Link href={`/programs/${program.id}`}>Explore program<ArrowUpRight data-icon="inline-end" /></Link></Button></article>; })}</div>
        </section>
        <div className="admin-two-column admin-dashboard-bottom">
          <section className="card admin-insight-card"><div className="admin-section-header"><h2 className="section-title">Mediator Activity</h2><ViewAll title="Mediator activity">{allMediators.map((mediator) => <RecordRow key={mediator.id} name={mediator.name} detail={`${mediator.zone} · ${mediator.visits} field visits · ${mediator.active} NEETs supported`} aside={<Badge variant="secondary">{mediator.status}</Badge>} />)}</ViewAll></div><div className="admin-activity-summary"><strong>{activeRate}%</strong><div><b>Active mediators</b><p className="admin-muted">{active} of {allMediators.length} in this demo directory</p></div></div><div className="admin-progress"><div style={{ width: `${activeRate}%` }} /></div><p className="admin-muted admin-results-note">{allMediators.reduce((total, mediator) => total + mediator.visits, 0)} recorded field visits</p></section>
          <section className="card admin-insight-card"><div className="admin-section-header"><h2 className="section-title">Retention Rates</h2><ViewAll title="Retention rates">{rates.map((rate) => <RecordRow key={rate.label} name={rate.label} detail={`+${rate.change}% vs last month`} aside={<Badge variant="secondary">{rate.pct}% retained</Badge>} />)}</ViewAll></div><div className="admin-retention-grid">{rates.map((rate) => <div key={rate.label}><strong>{rate.pct}%</strong><span>{rate.label}</span><div className="admin-progress"><div style={{ width: `${rate.pct}%` }} /></div><small>+{rate.change}% vs previous month</small></div>)}</div></section>
        </div>
      </div>
    </div>
  );
}
