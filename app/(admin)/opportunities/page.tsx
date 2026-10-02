"use client";

import { Plus, TrendingUp, TrendingDown, MapPin, Clock } from "lucide-react";
import PartnerLogo from "@/components/PartnerLogo";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const opportunities = [
  {
    title: "Auto Mechanics Training",
    type: "Training",
    program: "OFPPT",
    commune: "Agadir",
    deadline: "Jun 15, 2025",
    matches: 48,
    status: "active",
    color: "#00B8A9",
  },
  {
    title: "Digital Marketing Bootcamp",
    type: "Internship",
    program: "StartUp",
    commune: "Agadir",
    deadline: "Jun 10, 2025",
    matches: 32,
    status: "active",
    color: "#2E86C1",
  },
  {
    title: "Entrepreneurship Program",
    type: "Program",
    program: "INDH",
    commune: "Inezgane",
    deadline: "Jun 20, 2025",
    matches: 25,
    status: "active",
    color: "#8E44AD",
  },
  {
    title: "Welding Certification",
    type: "Training",
    program: "OFPPT",
    commune: "Taroudant",
    deadline: "Jun 8, 2025",
    matches: 18,
    status: "active",
    color: "#F5A623",
  },
  {
    title: "Retail Sales Internship",
    type: "Internship",
    program: "Local",
    commune: "Agadir",
    deadline: "Jun 5, 2025",
    matches: 41,
    status: "closing",
    color: "#E74C3C",
  },
  {
    title: "CV & Job Readiness Workshop",
    type: "Micro",
    program: "ANAPEC",
    commune: "Tiznit",
    deadline: "May 30, 2025",
    matches: 64,
    status: "active",
    color: "#27AE60",
  },
];

const byType = [
  { type: "Training", count: 42 },
  { type: "Internship", count: 38 },
  { type: "Program", count: 29 },
  { type: "Micro-action", count: 75 },
  { type: "Workshop", count: 24 },
];

const recentMatches = [
  {
    neet: "Yassine El Amrani",
    opp: "Auto Mechanics Training",
    match: 92,
    date: "May 31",
  },
  {
    neet: "Fatima Zahra A.",
    opp: "Digital Marketing Bootcamp",
    match: 86,
    date: "May 30",
  },
  {
    neet: "Omar T.",
    opp: "Entrepreneurship Program",
    match: 78,
    date: "May 29",
  },
  {
    neet: "Hassan A.",
    opp: "Welding Certification",
    match: 74,
    date: "May 27",
  },
];

type KPISimpleProps = {
  title: string;
  value: string;
  change: number;
  color: string;
  bg: string;
};

function KPISimple({ title, value, change, color, bg }: KPISimpleProps) {
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

export default function OpportunitiesPage() {
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
              Opportunities
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              Track and manage matched opportunities for NEETs across
              Souss-Massa
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={15} /> Add Opportunity
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
        <div style={{ display: "flex", gap: 16 }}>
          <KPISimple
            title="Total Opportunities"
            value="208"
            change={22.4}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title="Active"
            value="186"
            change={18.3}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title="Total Matches"
            value="1,284"
            change={31.6}
            color="#2E86C1"
            bg="#EBF5FB"
          />
          <KPISimple
            title="Filled / Closed"
            value="22"
            change={-4.2}
            color="#E74C3C"
            bg="#FDEDEC"
          />
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Opportunities Directory
          </h2>
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
                  "Title",
                  "Type",
                  "Program",
                  "Commune",
                  "Deadline",
                  "Matches",
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
              {opportunities.map((o, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < opportunities.length - 1
                        ? "1px solid #F4F6F9"
                        : "none",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: o.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 600, color: "#1A2B3C" }}>
                        {o.title}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background: `${o.color}18`,
                        color: o.color,
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {o.type}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#4A5568",
                      }}
                    >
                      <PartnerLogo name={o.program} size={28} />
                      <span>{o.program}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#4A5568",
                      }}
                    >
                      <MapPin size={11} />
                      {o.commune}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#7F8C9A",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Clock size={11} />
                      {o.deadline}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 700,
                      color: "#1A2B3C",
                    }}
                  >
                    {o.matches}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background:
                          o.status === "active" ? "#EAFAF1" : "#FEF9E7",
                        color: o.status === "active" ? "#1E8449" : "#D4AC0D",
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {o.status === "active" ? "Active" : "Closing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* By Type chart */}
          <div className="card" style={{ flex: 2, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Opportunities by Type
            </h2>
            <ResponsiveContainer
              width="100%"
              height={200}
              initialDimension={{ width: 640, height: 200 }}
            >
              <BarChart
                data={byType}
                margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="type"
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
                  dataKey="count"
                  fill="#00B8A9"
                  radius={[4, 4, 0, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Recent Matches */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>
              Recent Matches
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentMatches.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px",
                    background: "#F9FAFB",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {m.neet}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                      {m.opp}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        color: "#27AE60",
                      }}
                    >
                      {m.match}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#A0ADB8" }}>
                      {m.date}
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
