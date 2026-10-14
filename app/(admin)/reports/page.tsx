"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { reportSummary } from "@/lib/reporting";
import { useAdminData } from "@/components/workspace/AdminData";

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
        {change !== 0 &&
          (up ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}{" "}
        {change !== 0 && up ? "+" : ""}
        {change !== 0 ? (
          change + "%"
        ) : (
          <Translated value="Données enregistrées" />
        )}
        <span
          style={{ color: "#7F8C9A", fontWeight: 400, marginLeft: 4 }}
        ></span>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { text: uiText } = useUiTranslation();

  const { trendData, savedReports, metrics, data } = useAdminData();

  const [activeTab, setActiveTab] = useState("Monthly"),
    [customStart, setCustomStart] = useState(
      new Date().toISOString().slice(0, 10),
    ),
    [customEnd, setCustomEnd] = useState(new Date().toISOString().slice(0, 10)),
    [exporting, setExporting] = useState(false),
    [error, setError] = useState("");
  const today = new Date(),
    end = activeTab === "Custom" ? customEnd : today.toISOString().slice(0, 10),
    start =
      activeTab === "Custom"
        ? customStart
        : new Date(
            Date.UTC(
              today.getUTCFullYear(),
              activeTab === "Quarterly"
                ? Math.floor(today.getUTCMonth() / 3) * 3
                : today.getUTCMonth(),
              1,
            ),
          )
            .toISOString()
            .slice(0, 10);
  const summary = reportSummary(data, start, end);
  async function exportReport() {
    setExporting(true);
    setError("");
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report-export",
          payload: { start, end },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || "Export indisponible.");
      const a = document.createElement("a");
      a.href = result.url;
      a.download = "";
      a.click();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export indisponible.");
    } finally {
      setExporting(false);
    }
  }

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
              <Translated value="Reports" />
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Generate and export regional performance reports" />
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-outline"
              style={{ fontSize: "0.78rem", padding: "7px 14px" }}
            >
              <span onClick={() => window.print()}>
                <Download size={13} />
                <Translated value="Imprimer / PDF" />
              </span>
            </button>
            <button
              className="btn-outline"
              style={{ fontSize: "0.78rem", padding: "7px 14px" }}
            >
              <span
                onClick={() => {
                  if (!exporting) void exportReport();
                }}
              >
                <Download size={13} /> {exporting ? "Export…" : "Export CSV"}
              </span>
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
            title={uiText("Total NEETs Detected")}
            value={String(summary.identified)}
            change={0}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title={uiText("Integration Rate")}
            value={`${summary.integrationRate}%`}
            change={0}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title={uiText("Stabilization Rate")}
            value={`${summary.stabilizationRate}%`}
            change={0}
            color="#F5A623"
            bg="#FEF9E7"
          />
          <KPISimple
            title={uiText("Active Programs")}
            value={String(data.programs.filter((p) => p.published).length)}
            change={0}
            color="#8E44AD"
            bg="#F5EEF8"
          />
        </div>

        {error && (
          <p role="alert" style={{ color: "#AD2F2F" }}>
            {error}
          </p>
        )}
        <p>
          <Translated value="Rapport des dossiers reçus du" />
          {start}
          <Translated value="au" />
          {end}
          <Translated value=". Les taux concernent cette même cohorte." />
        </p>
        {activeTab === "Custom" && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label>
              <Translated value="Début" />{" "}
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </label>
            <label>
              <Translated value="Fin" />{" "}
              <input
                type="date"
                min={customStart}
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </label>
          </div>
        )}
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
              <Translated value="Historique des événements — six derniers mois" />
            </h2>
            <button
              className="btn-outline"
              style={{ fontSize: "0.75rem", padding: "5px 10px" }}
            >
              <span onClick={() => setActiveTab("Custom")}>
                <Translated value="Customize" />
              </span>
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
            <Translated value="Saved Reports" />
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
                  <Download size={12} />
                  <Translated value="Download" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
