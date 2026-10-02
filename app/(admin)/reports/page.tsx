"use client";

import { Download, TrendingUp, TrendingDown } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";

const tabs = ["Monthly", "Quarterly", "Custom"];

const trendData = [
  {
    month: "Jan",
    detected: 420,
    activated: 210,
    integrated: 130,
    stabilized: 45,
  },
  {
    month: "Feb",
    detected: 490,
    activated: 260,
    integrated: 160,
    stabilized: 60,
  },
  {
    month: "Mar",
    detected: 620,
    activated: 370,
    integrated: 230,
    stabilized: 90,
  },
  {
    month: "Apr",
    detected: 800,
    activated: 490,
    integrated: 310,
    stabilized: 120,
  },
  {
    month: "May",
    detected: 1100,
    activated: 640,
    integrated: 420,
    stabilized: 170,
  },
];

const savedReports = [
  {
    name: "April 2025 Monthly Report",
    date: "May 1, 2025",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    name: "Q1 2025 Quarterly Summary",
    date: "Apr 1, 2025",
    type: "PDF",
    size: "5.8 MB",
  },
  {
    name: "NEET Profiles Export - May",
    date: "May 31, 2025",
    type: "CSV",
    size: "1.2 MB",
  },
  {
    name: "Mediator Activity Report",
    date: "May 15, 2025",
    type: "XLSX",
    size: "890 KB",
  },
];

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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
      </div>
      <div className={up ? "badge-up" : "badge-down"}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{" "}
        {up ? "+" : ""}
        {change}%
        <span style={{ color: "#7F8C9A", fontWeight: 400, marginLeft: 4 }}>
          vs last period
        </span>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Monthly");

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
              Reports
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              Generate and export regional performance reports
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-outline"
              style={{ fontSize: "0.78rem", padding: "7px 14px" }}
            >
              <Download size={13} /> Export PDF
            </button>
            <button
              className="btn-outline"
              style={{ fontSize: "0.78rem", padding: "7px 14px" }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 14,
            borderBottom: "1px solid #E8ECF0",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "8px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: activeTab === t ? 700 : 500,
                color: activeTab === t ? "#00B8A9" : "#7F8C9A",
                borderBottom:
                  activeTab === t
                    ? "2px solid #00B8A9"
                    : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t}
            </button>
          ))}
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
            title="Total NEETs Detected"
            value="1,842"
            change={12.4}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title="Integration Rate"
            value="37.0%"
            change={5.8}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title="Stabilization Rate"
            value="17.4%"
            change={9.8}
            color="#F5A623"
            bg="#FEF9E7"
          />
          <KPISimple
            title="Active Programs"
            value="5"
            change={25.0}
            color="#8E44AD"
            bg="#F5EEF8"
          />
        </div>

        {/* Main Chart */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 className="section-title">
              Journey Progression — {activeTab} View
            </h2>
            <button
              className="btn-outline"
              style={{ fontSize: "0.75rem", padding: "5px 10px" }}
            >
              Customize
            </button>
          </div>
          <ResponsiveContainer
            width="100%"
            height={240}
            initialDimension={{ width: 640, height: 240 }}
          >
            <AreaChart
              data={trendData}
              margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
            >
              <defs>
                {[
                  ["detected", "#00B8A9"],
                  ["activated", "#2E86C1"],
                  ["integrated", "#27AE60"],
                  ["stabilized", "#F5A623"],
                ].map(([k, c]) => (
                  <linearGradient
                    key={k}
                    id={`g-${k}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
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
              {[
                ["detected", "#00B8A9"],
                ["activated", "#2E86C1"],
                ["integrated", "#27AE60"],
                ["stabilized", "#F5A623"],
              ].map(([k, c]) => (
                <Area
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={c}
                  strokeWidth={2.5}
                  fill={`url(#g-${k})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Saved Reports */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Saved Reports
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {savedReports.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom:
                    i < savedReports.length - 1 ? "1px solid #F4F6F9" : "none",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background:
                      r.type === "PDF"
                        ? "#FDEDEC"
                        : r.type === "CSV"
                          ? "#EAFAF1"
                          : "#EBF5FB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color:
                      r.type === "PDF"
                        ? "#E74C3C"
                        : r.type === "CSV"
                          ? "#27AE60"
                          : "#2E86C1",
                    flexShrink: 0,
                  }}
                >
                  {r.type}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "#1A2B3C",
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                    {r.date} · {r.size}
                  </div>
                </div>
                <button
                  style={{
                    border: "1px solid #E8ECF0",
                    borderRadius: 6,
                    padding: "5px 12px",
                    background: "white",
                    fontSize: "0.75rem",
                    color: "#4A5568",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
