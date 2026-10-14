"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useState } from "react";
import BusinessAction from "@/components/workspace/BusinessAction";
import { downloadCsv } from "@/lib/export-csv";
import { useAdminData } from "@/components/workspace/AdminData";

import {
  Plus,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Download,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import KPICard from "@/components/KPICard";

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

function FunnelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      style={{
        height: 10,
        background: "#F4F6F9",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 5,
        }}
      />
    </div>
  );
}

export default function NEETsPage() {
  const { text: uiText } = useUiTranslation();

  const {
    spark1,
    spark2,
    spark3,
    spark4,
    pipelineData,
    neetDirectory,
    commonBlockers,
    recentActivity,
    actions,
    localOpportunities,
    metrics,
    data,
  } = useAdminData();

  const [query, setQuery] = useState(""),
    [commune, setCommune] = useState(""),
    [status, setStatus] = useState("");
  const filtered = neetDirectory.filter(
    (n) =>
      (!commune || n.commune === commune) &&
      (!status || n.status === status) &&
      `${n.name} ${n.commune} ${n.status}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "#1A2B3C",
              }}
            >
              <Translated value="NEETs" />
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Manage, track, and follow youth profiles across Souss-Massa" />
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="search"
              placeholder={uiText("Rechercher un dossier…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                paddingLeft: 36,
                paddingRight: 14,
                paddingTop: 8,
                paddingBottom: 8,
                border: "1px solid #E8ECF0",
                borderRadius: 8,
                fontSize: "0.8125rem",
                color: "#1A2B3C",
                background: "#F9FAFB",
                outline: "none",
                width: 260,
              }}
            />
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A0ADB8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <span style={{ fontSize: 12, color: "#7F8C9A" }}>
            <Translated value="Les nouveaux dossiers arrivent depuis l’application de terrain." />
          </span>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 10 }}>
          <select
            className="btn-outline"
            aria-label={uiText("Commune")}
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
          >
            <option value="">
              <Translated value="Toutes les communes" />
            </option>
            {[...new Set(neetDirectory.map((n) => n.commune))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="btn-outline"
            aria-label={uiText("État du dossier")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">
              <Translated value="Tous les états" />
            </option>
            {[...new Set(neetDirectory.map((n) => n.status))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
        {/* KPI Row */}
        <div style={{ display: "flex", gap: 16 }}>
          <KPICard
            title={uiText("Total NEETs")}
            value={String(metrics.identified)}
            change={0}
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
            title={uiText("Newly Identified")}
            value={String(
              data.people.filter((p) =>
                p.created_at.startsWith(new Date().toISOString().slice(0, 7)),
              ).length,
            )}
            change={0}
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            }
            iconBg="#EBF5FB"
            sparkData={spark2}
            sparkColor="#2E86C1"
          />
          <KPICard
            title={uiText("Suivis planifiés")}
            value={String(
              new Set(
                data.followups
                  .filter((f) => f.outcome === "planned")
                  .map((f) => f.youth_id),
              ).size,
            )}
            change={0}
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            }
            iconBg="#FEF9E7"
            sparkData={spark3}
            sparkColor="#F5A623"
          />
          <KPICard
            title={uiText("Suivis en retard")}
            value={String(
              new Set(
                data.followups
                  .filter(
                    (f) =>
                      f.outcome === "planned" &&
                      f.due_date < new Date().toISOString().slice(0, 10),
                  )
                  .map((f) => f.youth_id),
              ).size,
            )}
            change={-9.8}
            changePeriod="vs Apr 1 – Apr 30"
            icon={
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E74C3C"
                strokeWidth="2.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
            iconBg="#FDEDEC"
            sparkData={spark4}
            sparkColor="#E74C3C"
          />
        </div>

        {/* NEET Directory */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 className="section-title">
                <Translated value="NEET Directory" />
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#7F8C9A" }}>
                {filtered.length}
                <Translated value="dossiers" />
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-outline"
                style={{ fontSize: "0.78rem", padding: "6px 12px" }}
              >
                <Download size={13} />
                <Translated value="Export" />
              </button>
              <button
                className="btn-outline"
                style={{ fontSize: "0.78rem", padding: "6px 12px" }}
              >
                <MoreVertical size={13} />
              </button>
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
                  "Commune",
                  "Status",
                  "Trust Level",
                  "Main Blocker",
                  "Assigned Mediator",
                  "Next Action",
                  "Last Updated",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 10px",
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
                <th style={{ width: 30 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < neetDirectory.length - 1
                        ? "1px solid #F4F6F9"
                        : "none",
                  }}
                >
                  <td style={{ padding: "10px 10px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar initials={n.avatar} size={28} />
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#1A2B3C",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {n.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#4A5568",
                      fontSize: "0.8rem",
                    }}
                  >
                    {n.commune}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <StatusBadge status={n.status} />
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TrustDot level={n.trust} />
                      <span style={{ color: "#4A5568", fontSize: "0.8rem" }}>
                        {n.trust}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#4A5568",
                      fontSize: "0.78rem",
                    }}
                  >
                    {n.blocker}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
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
                      <span style={{ color: "#4A5568", fontSize: "0.8rem" }}>
                        {n.mediator}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#4A5568",
                      fontSize: "0.78rem",
                    }}
                  >
                    {n.action}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#7F8C9A",
                      fontSize: "0.72rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.date}
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <BusinessAction
                      kind="review"
                      id={n.id}
                      className="btn-secondary"
                    >
                      <Translated value="Vérifier" />
                    </BusinessAction>
                    <BusinessAction
                      kind="link-account"
                      id={n.id}
                      className="btn-secondary"
                    >
                      <Translated value="Relier le compte" />
                    </BusinessAction>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ padding: 14, color: "#7F8C9A" }}>
            {filtered.length}
            <Translated value="dossier(s) affiché(s)" />
          </p>
        </div>

        {/* Pipeline + Blockers */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* NEET Pipeline */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
              <Translated value="NEET Pipeline (Status Distribution)" />
            </h2>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#27AE60",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              <Translated value="Insertion constatée :" />{" "}
              {metrics.identified
                ? Math.round((metrics.integrated / metrics.identified) * 100)
                : 0}
              %{" "}
              <span style={{ color: "#E74C3C", marginLeft: 6 }}>
                <Translated value="Données enregistrées" />
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {pipelineData.map((p, i) => (
                <div key={p.stage}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        background: p.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        color: "white",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.8125rem",
                        color: "#4A5568",
                        fontWeight: 500,
                      }}
                    >
                      {p.stage}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#1A2B3C",
                        fontSize: "0.875rem",
                      }}
                    >
                      {p.count}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#7F8C9A",
                        width: 38,
                        textAlign: "right",
                      }}
                    >
                      {p.pct}%
                    </span>
                  </div>
                  <FunnelBar pct={p.pct * 3.67} color={p.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Common Blockers */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 className="section-title">
                <Translated value="Common Blockers" />
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
                <Translated value="View all" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {commonBlockers.map((b) => (
                <div
                  key={b.name}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#4A5568",
                      width: 150,
                      flexShrink: 0,
                    }}
                  >
                    {b.name}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: "#F4F6F9",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${b.pct * 4}%`,
                        height: "100%",
                        background: b.color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#7F8C9A",
                      width: 30,
                      textAlign: "right",
                    }}
                  >
                    {b.pct}%
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: "#1A2B3C",
                      width: 32,
                      textAlign: "right",
                    }}
                  >
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Local Opportunities */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Recent Activity */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              <Translated value="Recent Activity & Follow-ups" />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom:
                      i < recentActivity.length - 1
                        ? "1px solid #F4F6F9"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#E0F7F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {a.neet}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#4A5568" }}>
                      {a.action}{" "}
                      <span style={{ color: "#7F8C9A" }}>
                        <Translated value="by" />
                        {a.by}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                      {a.date}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#A0ADB8" }}>
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{
                marginTop: 12,
                width: "100%",
                padding: "9px",
                border: "1px solid #E8ECF0",
                borderRadius: 8,
                background: "white",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#4A5568",
                cursor: "pointer",
              }}
            >
              <Translated value="View All Activities" />
            </button>
          </div>

          {/* Local Opportunities */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 className="section-title">
                <Translated value="Local Opportunities Matching" />
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
                <Translated value="View all" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {localOpportunities.map((o, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px",
                    border: "1px solid #F4F6F9",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#F4F6F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {i === 0 ? "🔧" : i === 1 ? "💻" : "🚀"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {o.title}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                      {o.org}
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        background: "#E0F7F5",
                        color: "#00B8A9",
                        borderRadius: 20,
                        padding: "1px 7px",
                        fontWeight: 600,
                      }}
                    >
                      📍 {o.tag}
                    </span>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div
                      style={{ position: "relative", width: 48, height: 48 }}
                    >
                      <PieChart width={48} height={48}>
                        <Pie
                          data={[{ v: 0 }, { v: 100 }]}
                          cx={20}
                          cy={20}
                          innerRadius={14}
                          outerRadius={22}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="v"
                          strokeWidth={0}
                        >
                          <Cell fill={o.matchColor} />
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
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          color: "#1A2B3C",
                        }}
                      >
                        {o.match}%
                      </div>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#7F8C9A" }}>
                      <Translated value="match" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{
                marginTop: 12,
                width: "100%",
                padding: "9px",
                border: "1px solid #E8ECF0",
                borderRadius: 8,
                background: "white",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#4A5568",
                cursor: "pointer",
              }}
            >
              <Translated value="View All Opportunities" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
