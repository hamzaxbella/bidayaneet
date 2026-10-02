"use client";

import { Plus, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import PartnerLogo from "@/components/PartnerLogo";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const programs = [
  {
    name: "ANAPEC",
    desc: "National employment agency — job placement & career guidance",
    enrolled: 412,
    capacity: 600,
    completed: 289,
    dropout: 8.2,
    color: "#E74C3C",
    status: "active",
  },
  {
    name: "INDH Programs",
    desc: "National Human Development Initiative — local projects",
    enrolled: 286,
    capacity: 400,
    completed: 180,
    dropout: 6.5,
    color: "#1B8A5A",
    status: "active",
  },
  {
    name: "Local Internships",
    desc: "Partnerships with local businesses for work experience",
    enrolled: 213,
    capacity: 300,
    completed: 145,
    dropout: 11.4,
    color: "#F5A623",
    status: "active",
  },
  {
    name: "Micro-actions",
    desc: "Quick skill-building actions and micro-engagements",
    enrolled: 342,
    capacity: 500,
    completed: 220,
    dropout: 4.3,
    color: "#00B8A9",
    status: "active",
  },
  {
    name: "OFPPT Training",
    desc: "Vocational training programs across Souss-Massa",
    enrolled: 178,
    capacity: 250,
    completed: 102,
    dropout: 9.8,
    color: "#8E44AD",
    status: "active",
  },
  {
    name: "Ministry of Tourism, Handicrafts and SSE",
    desc: "Tourism, handicrafts, and social economy employment pathways",
    enrolled: 164,
    capacity: 220,
    completed: 116,
    dropout: 5.7,
    color: "#1976A3",
    status: "active",
  },
  {
    name: "ONMT Tourism Careers",
    desc: "Regional tourism promotion, hospitality jobs, and guided visitor services",
    enrolled: 132,
    capacity: 180,
    completed: 91,
    dropout: 6.1,
    color: "#2E86C1",
    status: "active",
  },
  {
    name: "Hospitality Training Hub",
    desc: "Hotel operations, guest relations, and restaurant service tracks",
    enrolled: 118,
    capacity: 160,
    completed: 83,
    dropout: 7.4,
    color: "#00A3A3",
    status: "active",
  },
  {
    name: "Ministry of Agriculture",
    desc: "Agriculture, fisheries, rural development, water, and forests programs",
    enrolled: 205,
    capacity: 300,
    completed: 151,
    dropout: 5.9,
    color: "#248A3D",
    status: "active",
  },
  {
    name: "ADA Agripreneurship",
    desc: "Agricultural Development Agency support for young rural entrepreneurs",
    enrolled: 156,
    capacity: 220,
    completed: 112,
    dropout: 6.8,
    color: "#6A9F2A",
    status: "active",
  },
  {
    name: "ORMVA Souss-Massa",
    desc: "Irrigation, orchard, and cooperative training for rural youth",
    enrolled: 139,
    capacity: 180,
    completed: 99,
    dropout: 7.1,
    color: "#4C9A2A",
    status: "active",
  },
  {
    name: "Ministry of Economic Inclusion",
    desc: "Small business, employment, skills, and self-employment pathways",
    enrolled: 241,
    capacity: 320,
    completed: 174,
    dropout: 6.2,
    color: "#5B4B8A",
    status: "active",
  },
  {
    name: "Ministry of Youth, Culture and Communication",
    desc: "Youth centers, civic engagement, culture, and communication activation",
    enrolled: 127,
    capacity: 180,
    completed: 88,
    dropout: 8.0,
    color: "#C0392B",
    status: "active",
  },
];

const totalPrograms = programs.length;
const activePrograms = programs.filter(
  (program) => program.status === "active",
).length;
const totalEnrolled = programs.reduce(
  (sum, program) => sum + program.enrolled,
  0,
);
const totalCompleted = programs.reduce(
  (sum, program) => sum + program.completed,
  0,
);
const completionRate = Math.round((totalCompleted / totalEnrolled) * 100);

const enrollmentTrend = [
  { month: "Jan", enrolled: 1620 },
  { month: "Feb", enrolled: 1785 },
  { month: "Mar", enrolled: 2050 },
  { month: "Apr", enrolled: 2362 },
  { month: "May", enrolled: totalEnrolled },
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
    <div className="kpi-card" style={{ flex: 1, minWidth: 190 }}>
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
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
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

export default function ProgramsPage() {
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
              Programs
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              Manage collaborating programs and track NEET enrollment across
              partners
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={15} /> Add Program
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
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <KPISimple
            title="Total Programs"
            value={String(totalPrograms)}
            change={160.0}
            color="#8E44AD"
            bg="#F5EEF8"
          />
          <KPISimple
            title="Active Programs"
            value={String(activePrograms)}
            change={160.0}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title="NEETs Enrolled"
            value={totalEnrolled.toLocaleString()}
            change={89.6}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title="Avg Completion Rate"
            value={`${completionRate}%`}
            change={5.8}
            color="#F5A623"
            bg="#FEF9E7"
          />
        </div>

        {/* Program Cards */}
        <div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Collaborating Programs
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {programs.map((p) => {
              const enrolledPct = Math.round((p.enrolled / p.capacity) * 100);
              return (
                <div key={p.name} className="card" style={{ padding: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <PartnerLogo name={p.name} size={48} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: "#1A2B3C",
                        }}
                      >
                        {p.name}
                      </div>
                      <span
                        style={{
                          background: "#EAFAF1",
                          color: "#1E8449",
                          borderRadius: 20,
                          padding: "2px 8px",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                        }}
                      >
                        Active
                      </span>
                    </div>
                    <ExternalLink
                      size={14}
                      color="#A0ADB8"
                      style={{ cursor: "pointer", flexShrink: 0 }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#7F8C9A",
                      marginBottom: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.desc}
                  </p>
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "#4A5568",
                        marginBottom: 5,
                      }}
                    >
                      <span>Enrollment</span>
                      <span style={{ fontWeight: 700 }}>
                        {p.enrolled} / {p.capacity}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#F4F6F9",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: `${enrolledPct}%`,
                          height: "100%",
                          background: p.color,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "#7F8C9A" }}>Completed </span>
                      <strong style={{ color: "#1A2B3C" }}>
                        {p.completed}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#7F8C9A" }}>Dropout </span>
                      <strong style={{ color: "#E74C3C" }}>{p.dropout}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Enrollment Trend (2025)
          </h2>
          <ResponsiveContainer
            width="100%"
            height={200}
            initialDimension={{ width: 640, height: 200 }}
          >
            <LineChart
              data={enrollmentTrend}
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
                dataKey="enrolled"
                stroke="#00B8A9"
                strokeWidth={2.5}
                dot={{ fill: "#00B8A9", r: 4 }}
                name="Total Enrolled"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
