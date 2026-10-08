"use client";

import { useState } from "react";
import {
  TrendingUp,
  MoreVertical,
  ChevronRight,
  AlertTriangle,
  Heart,
  Truck,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import MoroccoMap from "@/components/MoroccoMap";
import KPICard from "@/components/KPICard";
import PageHeader from "@/components/PageHeader";
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

const funnelData = [
  { stage: "Identification", count: 1842, pct: "100%", color: "#00B8A9" },
  { stage: "Activation", count: 1102, pct: "59.8%", color: "#26C6BA" },
  { stage: "Classification", count: 892, pct: "48.4%", color: "#4DB6AC" },
  { stage: "Integration", count: 682, pct: "37.0%", color: "#F5A623" },
  { stage: "Stabilization (90d)", count: 321, pct: "17.4%", color: "#FF8C42" },
];

const blockers = [
  {
    name: "Trust & Engagement",
    desc: "Low trust in institutions, previous bad experiences",
    count: 428,
    change: 14.5,
    color: "#E74C3C",
    icon: <Heart size={16} />,
  },
  {
    name: "Transport & Mobility",
    desc: "Distance, cost, limited public transport",
    count: 362,
    change: 11.2,
    color: "#F5A623",
    icon: <Truck size={16} />,
  },
  {
    name: "Family Constraints",
    desc: "Care responsibilities, family obligations",
    count: 287,
    change: 8.7,
    color: "#8E44AD",
    icon: <Users size={16} />,
  },
  {
    name: "Dropout Risk",
    desc: "At risk of disengagement or returning to inactivity",
    count: 213,
    change: 4.2,
    color: "#E67E22",
    icon: <AlertTriangle size={16} />,
  },
];

const recentNEETs = [
  {
    name: "Yassine El Amrani",
    commune: "Agadir",
    status: "Activated",
    trust: "High",
    mediator: "Imane R.",
    action: "Schedule orientation",
    date: "May 31, 2025",
    avatar: "YE",
  },
  {
    name: "Fatima Zahra A.",
    commune: "Inezgane",
    status: "Classification",
    trust: "Medium",
    mediator: "Khalid B.",
    action: "Skills assessment",
    date: "May 30, 2025",
    avatar: "FZ",
  },
  {
    name: "Omar T.",
    commune: "Taroudant",
    status: "Integrated",
    trust: "High",
    mediator: "Amina K.",
    action: "Follow-up call",
    date: "May 29, 2025",
    avatar: "OT",
  },
  {
    name: "Saima E.",
    commune: "Tiznit",
    status: "Activation",
    trust: "Medium",
    mediator: "Imane R.",
    action: "Home visit",
    date: "May 29, 2025",
    avatar: "SE",
  },
  {
    name: "Rachid D.",
    commune: "Tata",
    status: "Identified",
    trust: "Low",
    mediator: "Youssef M.",
    action: "Build trust",
    date: "May 28, 2025",
    avatar: "RD",
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

const mediatorDonut = [
  { name: "Active", value: 78 },
  { name: "Inactive", value: 22 },
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
      height={265}
      points={soussMassaHeatPoints.map((point) => ({
        ...point,
        value: point.neets,
      }))}
    />
  );
}

/* ── Custom funnel bar ── */
function FunnelBar({
  count,
  max,
  color,
}: {
  count: number;
  max: number;
  color: string;
}) {
  const pct = (count / max) * 100;
  return (
    <div
      style={{
        height: 10,
        background: "#F4F6F9",
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 5,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

/* ── Footer ── */

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const filteredNEETs = recentNEETs.filter((person) =>
    Object.values(person).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <PageHeader
        title="Main Dashboard"
        subtitle="Regional monitoring for Souss-Massa"
        actionLabel="Export overview"
        showFilters={true}
        onSearch={setQuery}
      />

      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* KPI Row */}
        <div style={{ display: "flex", gap: 16 }}>
          <KPICard
            title="Detected NEETs"
            value="1,842"
            change={12.4}
            changePeriod="vs Apr 1 – Apr 30"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00B8A9"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            }
            iconBg="#E0F7F5"
            sparkData={spark1}
            sparkColor="#00B8A9"
          />
          <KPICard
            title="Activated"
            value="1,102"
            change={18.7}
            changePeriod="vs Apr 1 – Apr 30"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2E86C1"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                <path d="M16 3l2 2-6 6" />
              </svg>
            }
            iconBg="#EBF5FB"
            sparkData={spark2}
            sparkColor="#2E86C1"
          />
          <KPICard
            title="Integrated"
            value="682"
            change={15.3}
            changePeriod="vs Apr 1 – Apr 30"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#27AE60"
                strokeWidth="2.5"
              >
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
            iconBg="#EAFAF1"
            sparkData={spark3}
            sparkColor="#27AE60"
          />
          <KPICard
            title="Stabilized at 90 days"
            value="321"
            change={9.8}
            changePeriod="vs Apr 1 – Apr 30"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5A623"
                strokeWidth="2.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
            iconBg="#FEF9E7"
            sparkData={spark4}
            sparkColor="#F5A623"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Journey Progression */}
          <div className="card" style={{ flex: 2, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <h2 className="section-title">Journey Progression (Monthly)</h2>
                <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                  {[
                    { label: "Detected", color: "#00B8A9" },
                    { label: "Activated", color: "#2E86C1" },
                    { label: "Integrated", color: "#27AE60" },
                    { label: "Stabilized (90d)", color: "#F5A623" },
                  ].map(({ label, color }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: "0.72rem",
                        color: "#4A5568",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: color,
                          display: "inline-block",
                        }}
                      />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn-outline"
                style={{ fontSize: "0.75rem", padding: "5px 10px" }}
              >
                Last 12 months <ChevronRight size={12} />
              </button>
            </div>
            <ResponsiveContainer
              width="100%"
              height={220}
              initialDimension={{ width: 640, height: 220 }}
            >
              <LineChart
                data={journeyData}
                margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#7F8C9A" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#7F8C9A" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8ECF0",
                    fontSize: "0.78rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="detected"
                  stroke="#00B8A9"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="activated"
                  stroke="#2E86C1"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="integrated"
                  stroke="#27AE60"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="stabilized"
                  stroke="#F5A623"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <h2 className="section-title">NEET Density Heatmap</h2>
              <p
                style={{ fontSize: "0.75rem", color: "#7F8C9A", marginTop: 2 }}
              >
                Souss-Massa Region
              </p>
            </div>
            <SoussaMassaMap />
          </div>
        </div>

        {/* Funnel + Blockers */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Integration Funnel */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Integration Funnel
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {funnelData.map((f, i) => (
                <div key={f.stage}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "0.8125rem",
                        color: "#4A5568",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          background: f.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.65rem",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </span>
                      {f.stage}
                    </div>
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#1A2B3C",
                          fontSize: "0.875rem",
                        }}
                      >
                        {f.count.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#7F8C9A",
                          width: 40,
                          textAlign: "right",
                        }}
                      >
                        {f.pct}
                      </span>
                    </div>
                  </div>
                  <FunnelBar count={f.count} max={1842} color={f.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Top Blockers */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 className="section-title">Top Blockers</h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#00B8A9",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View all
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {blockers.map((b) => (
                <div
                  key={b.name}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${b.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: b.color,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {b.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#7F8C9A",
                        marginTop: 1,
                      }}
                    >
                      {b.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {b.count}
                    </div>
                    <div className="badge-up" style={{ fontSize: "0.7rem" }}>
                      <TrendingUp size={10} /> {b.change}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#7F8C9A" }}>
                      NEETs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent NEET Profiles */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 className="section-title">Recent NEET Profiles</h2>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#00B8A9",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              View all
            </button>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8125rem",
            }}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Commune",
                  "Status",
                  "Trust Level",
                  "Assigned Mediator",
                  "Next Action",
                  "Updated",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#7F8C9A",
                      borderBottom: "1px solid #E8ECF0",
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ width: 30 }} />
              </tr>
            </thead>
            <tbody>
              {filteredNEETs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: "#7F8C9A",
                    }}
                  >
                    No profiles match your search.
                  </td>
                </tr>
              )}
              {filteredNEETs.map((n, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < filteredNEETs.length - 1
                        ? "1px solid #F4F6F9"
                        : "none",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar initials={n.avatar} size={28} />
                      <span style={{ fontWeight: 600, color: "#1A2B3C" }}>
                        {n.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                    {n.commune}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <StatusBadge status={n.status} />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TrustDot level={n.trust} />
                      <span style={{ color: "#4A5568" }}>{n.trust}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Avatar
                        initials={n.mediator
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                        size={22}
                      />
                      <span style={{ color: "#4A5568" }}>{n.mediator}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                    {n.action}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "#7F8C9A",
                      fontSize: "0.75rem",
                    }}
                  >
                    {n.date}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <MoreVertical
                      size={14}
                      color="#A0ADB8"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Row: Programs + Mediator Activity */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Programs */}
          <div className="card" style={{ flex: 2, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 className="section-title">
                Opportunities & Collaborating Programs
              </h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#00B8A9",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View all
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                gap: 14,
              }}
            >
              {programs.map((p) => (
                <div
                  key={p.name}
                  style={{
                    border: "1px solid #E8ECF0",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <PartnerLogo name={p.name} size={50} />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#7F8C9A",
                        marginTop: 3,
                        lineHeight: 1.3,
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#7F8C9A" }}>
                    <strong style={{ color: "#1A2B3C" }}>
                      {p.opportunities}
                    </strong>{" "}
                    opportunities
                  </div>
                  <button
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "7px",
                      fontSize: "0.75rem",
                      justifyContent: "center",
                      background: p.color,
                    }}
                  >
                    Explore
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mediator Activity + Retention */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div className="card" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h2 className="section-title">Mediator Activity</h2>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#00B8A9",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View all
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <PieChart width={80} height={80}>
                    <Pie
                      data={mediatorDonut}
                      cx={35}
                      cy={35}
                      innerRadius={24}
                      outerRadius={36}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill="#00B8A9" />
                      <Cell fill="#E8ECF0" />
                    </Pie>
                  </PieChart>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#1A2B3C",
                    }}
                  >
                    78%
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#1A2B3C",
                    }}
                  >
                    Active Mediators
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#7F8C9A" }}>
                    36 / 46
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#7F8C9A",
                      marginTop: 2,
                    }}
                  >
                    active this month
                  </div>
                  <div
                    className="badge-up"
                    style={{ marginTop: 4, fontSize: "0.72rem" }}
                  >
                    <TrendingUp size={10} /> +8% vs last month
                  </div>
                </div>
              </div>
            </div>

            {/* Retention Rates */}
            <div className="card" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h2 className="section-title">Retention Rates</h2>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#00B8A9",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View all
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between",
                }}
              >
                {[
                  { label: "30 Days", pct: 78, change: 4, color: "#00B8A9" },
                  { label: "60 Days", pct: 62, change: 5, color: "#2E86C1" },
                  { label: "90 Days", pct: 48, change: 4, color: "#8E44AD" },
                ].map(({ label, pct, change, color }) => (
                  <div key={label} style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        position: "relative",
                        width: 60,
                        height: 60,
                        margin: "0 auto 6px",
                      }}
                    >
                      <PieChart width={60} height={60}>
                        <Pie
                          data={[{ v: pct }, { v: 100 - pct }]}
                          cx={25}
                          cy={25}
                          innerRadius={18}
                          outerRadius={28}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="v"
                          strokeWidth={0}
                        >
                          <Cell fill={color} />
                          <Cell fill="#E8ECF0" />
                        </Pie>
                      </PieChart>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: "#1A2B3C",
                        }}
                      >
                        {pct}%
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      className="badge-up"
                      style={{ fontSize: "0.7rem", justifyContent: "center" }}
                    >
                      <TrendingUp size={10} /> +{change}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
