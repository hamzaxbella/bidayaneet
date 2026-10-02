"use client";

import {
  Plus,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mediators = [
  {
    name: "Imane Rachidi",
    avatar: "IR",
    zone: "Agadir",
    assoc: "AMAL Asso.",
    active: 28,
    visits: 42,
    lastActive: "May 31, 2025",
    status: "active",
  },
  {
    name: "Khalid Benhima",
    avatar: "KB",
    zone: "Inezgane",
    assoc: "Jeunes Maroc",
    active: 24,
    visits: 36,
    lastActive: "May 30, 2025",
    status: "active",
  },
  {
    name: "Amina Karimi",
    avatar: "AK",
    zone: "Taroudant",
    assoc: "INDH Part.",
    active: 18,
    visits: 28,
    lastActive: "May 29, 2025",
    status: "active",
  },
  {
    name: "Youssef Malik",
    avatar: "YM",
    zone: "Tata",
    assoc: "Bader ONG",
    active: 14,
    visits: 20,
    lastActive: "May 27, 2025",
    status: "active",
  },
  {
    name: "Nadia Berrada",
    avatar: "NB",
    zone: "Tiznit",
    assoc: "AMAL Asso.",
    active: 9,
    visits: 13,
    lastActive: "May 24, 2025",
    status: "inactive",
  },
  {
    name: "Saad El Fassi",
    avatar: "SF",
    zone: "Chtouka",
    assoc: "Volunteer",
    active: 11,
    visits: 17,
    lastActive: "May 26, 2025",
    status: "active",
  },
];

const activityData = [
  { month: "Jan", visits: 180, neetsAdded: 62 },
  { month: "Feb", visits: 210, neetsAdded: 74 },
  { month: "Mar", visits: 260, neetsAdded: 95 },
  { month: "Apr", visits: 310, neetsAdded: 112 },
  { month: "May", visits: 390, neetsAdded: 140 },
];

const topPerformers = [
  {
    name: "Imane Rachidi",
    score: 98,
    neetsHelped: 28,
    avatar: "IR",
    color: "#F5A623",
  },
  {
    name: "Khalid Benhima",
    score: 91,
    neetsHelped: 24,
    avatar: "KB",
    color: "#C8C8C8",
  },
  {
    name: "Amina Karimi",
    score: 85,
    neetsHelped: 18,
    avatar: "AK",
    color: "#CD7F32",
  },
];

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

function KPISimple({
  title,
  value,
  change,
  color,
  bg,
}: {
  title: string;
  value: string | number;
  change: number;
  color: string;
  bg: string;
}) {
  const up = change >= 0;
  return (
    <div className="kpi-card" style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{ fontSize: "0.78rem", color: "#7F8C9A", fontWeight: 500 }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1A2B3C",
              letterSpacing: "-0.5px",
              marginTop: 4,
            }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      </div>
      <div className={up ? "badge-up" : "badge-down"}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{" "}
        {up ? "+" : ""}
        {change}%
        <span style={{ color: "#7F8C9A", fontWeight: 400, marginLeft: 4 }}>
          vs last month
        </span>
      </div>
    </div>
  );
}

export default function MediatorsPage() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #E8ECF0",
          padding: "16px 28px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "#1A2B3C",
              }}
            >
              Mediators
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              Manage field mediators and track their activity across communes
            </p>
          </div>
          <button
            className="btn-outline"
            style={{ fontSize: "0.78rem", padding: "7px 14px" }}
          >
            <Download size={13} /> Export
          </button>
          <button className="btn-primary">
            <Plus size={15} /> Add Mediator
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* KPIs */}
        <div style={{ display: "flex", gap: 16 }}>
          <KPISimple
            title="Total Mediators"
            value="46"
            change={8.2}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title="Active This Month"
            value="36"
            change={11.4}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title="Total Field Visits"
            value="756"
            change={18.7}
            color="#2E86C1"
            bg="#EBF5FB"
          />
          <KPISimple
            title="Avg NEETs / Mediator"
            value="40"
            change={5.3}
            color="#8E44AD"
            bg="#F5EEF8"
          />
        </div>

        {/* Mediators Table */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 className="section-title">Mediator Directory</h2>
            <div style={{ display: "flex", gap: 8 }}>
              {["All Zones", "All Statuses"].map((f) => (
                <button
                  key={f}
                  className="btn-outline"
                  style={{ fontSize: "0.78rem", padding: "5px 10px" }}
                >
                  {f}{" "}
                  <ChevronRight
                    size={12}
                    style={{ transform: "rotate(90deg)" }}
                  />
                </button>
              ))}
            </div>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8rem",
            }}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Zone",
                  "Association",
                  "Active NEETs",
                  "Visits This Month",
                  "Last Activity",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#7F8C9A",
                      borderBottom: "1px solid #E8ECF0",
                      fontSize: "0.72rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mediators.map((m, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < mediators.length - 1 ? "1px solid #F4F6F9" : "none",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar initials={m.avatar} size={30} />
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                    {m.zone}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                    {m.assoc}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 700,
                      color: "#1A2B3C",
                    }}
                  >
                    {m.active}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                    {m.visits}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "#7F8C9A",
                      fontSize: "0.75rem",
                    }}
                  >
                    {m.lastActive}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background:
                          m.status === "active" ? "#EAFAF1" : "#F2F3F4",
                        color: m.status === "active" ? "#1E8449" : "#717D7E",
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {m.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts Row */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Activity trend */}
          <div className="card" style={{ flex: 2, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Monthly Activity
            </h2>
            <ResponsiveContainer
              width="100%"
              height={200}
              initialDimension={{ width: 640, height: 200 }}
            >
              <BarChart
                data={activityData}
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
                <Bar
                  dataKey="visits"
                  fill="#00B8A9"
                  radius={[4, 4, 0, 0]}
                  name="Field Visits"
                />
                <Bar
                  dataKey="neetsAdded"
                  fill="#E0F7F5"
                  radius={[4, 4, 0, 0]}
                  name="NEETs Added"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Top performers */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Top Performers
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {topPerformers.map((p, i) => (
                <div
                  key={p.name}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span style={{ fontSize: "1.2rem" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <Avatar initials={p.avatar} size={36} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                      {p.neetsHelped} NEETs helped
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: p.color,
                      }}
                    >
                      {p.score}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#7F8C9A" }}>
                      score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
