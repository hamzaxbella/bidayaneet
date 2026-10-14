"use client";
import Translated from "@/components/Translated";

import Link from "next/link";
import { useWorkspace } from "@/components/workspace/LiveProvider";
import { useAdminData } from "@/components/workspace/AdminData";

import { AlertTriangle, Info, CheckCircle, X, Settings } from "lucide-react";
import { useState } from "react";

const alertRules = [
  {
    name: "Suivis en retard",
    trigger: "Échéance dépassée et suivi non clôturé",
    severity: "warning",
    enabled: true,
  },
];

const tabs = ["All", "Critical", "Warning", "Info", "Success"];

const severityConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  critical: {
    color: "#E74C3C",
    bg: "#FDEDEC",
    icon: <AlertTriangle size={16} />,
    label: "Critical",
  },
  warning: {
    color: "#F5A623",
    bg: "#FEF9E7",
    icon: <AlertTriangle size={16} />,
    label: "Warning",
  },
  info: {
    color: "#2E86C1",
    bg: "#EBF5FB",
    icon: <Info size={16} />,
    label: "Info",
  },
  success: {
    color: "#27AE60",
    bg: "#EAFAF1",
    icon: <CheckCircle size={16} />,
    label: "Success",
  },
};

export default function AlertsPage() {
  const { allAlerts, metrics, data } = useAdminData();
  const { command } = useWorkspace();

  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? allAlerts
      : allAlerts.filter((a) => a.severity === activeTab.toLowerCase());
  const unread = allAlerts.filter((a) => !a.read).length;

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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 800,
                  color: "#1A2B3C",
                }}
              >
                <Translated value="Alerts" />
              </h1>
              {unread > 0 && (
                <span
                  style={{
                    background: "#E74C3C",
                    color: "white",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {unread}
                </span>
              )}
            </div>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Monitor system alerts, risk signals, and program notifications" />
            </p>
          </div>
          <button
            className="btn-outline"
            style={{ fontSize: "0.78rem", padding: "7px 14px" }}
          >
            <Settings size={13} />
            <Translated value="Manage Rules" />
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              void command({
                action: "alert-read",
                payload: allAlerts.map((a) => a.id),
              })
            }
          >
            <Translated value="Mark All Read" />
          </button>
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
          {tabs.map((t) => {
            const count =
              t === "All"
                ? allAlerts.length
                : allAlerts.filter((a) => a.severity === t.toLowerCase())
                    .length;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: "8px 18px",
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
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {t}
                <span
                  style={{
                    background: activeTab === t ? "#E0F7F5" : "#F4F6F9",
                    color: activeTab === t ? "#00B8A9" : "#7F8C9A",
                    borderRadius: 20,
                    padding: "1px 7px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
        {/* Alert Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((alert) => {
            const cfg = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className="card"
                style={{
                  padding: 18,
                  borderLeft: `4px solid ${cfg.color}`,
                  background: alert.read ? "white" : `${cfg.bg}`,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: cfg.color,
                      flexShrink: 0,
                    }}
                  >
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "#1A2B3C",
                        }}
                      >
                        {alert.title}
                      </span>
                      {!alert.read && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: cfg.color,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        style={{
                          background: cfg.bg,
                          color: cfg.color,
                          borderRadius: 20,
                          padding: "2px 8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#4A5568",
                        lineHeight: 1.5,
                        marginBottom: 10,
                      }}
                    >
                      {alert.desc}
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span style={{ fontSize: "0.72rem", color: "#A0ADB8" }}>
                        {alert.time}
                      </span>
                      {alert.neets && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#7F8C9A",
                            background: "#F4F6F9",
                            borderRadius: 20,
                            padding: "2px 8px",
                          }}
                        >
                          {alert.neets}
                          <Translated value="NEETs affected" />
                        </span>
                      )}
                      <button
                        style={{
                          padding: "5px 14px",
                          background: cfg.color,
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {alert.action}
                      </button>
                    </div>
                  </div>
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#A0ADB8",
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Rules */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            <Translated value="Alert Rules" />
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
                {["Rule Name", "Trigger Condition", "Severity", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#7F8C9A",
                        borderBottom: "1px solid #E8ECF0",
                        fontSize: "0.72rem",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {alertRules.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < alertRules.length - 1 ? "1px solid #F4F6F9" : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 600,
                      color: "#1A2B3C",
                    }}
                  >
                    {r.name}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "#7F8C9A",
                      fontSize: "0.75rem",
                    }}
                  >
                    {r.trigger}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background: severityConfig[r.severity].bg,
                        color: severityConfig[r.severity].color,
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {severityConfig[r.severity].label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: 10,
                          background: r.enabled ? "#00B8A9" : "#E8ECF0",
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "white",
                            position: "absolute",
                            top: 3,
                            left: r.enabled ? 18 : 3,
                            transition: "left 0.2s",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: r.enabled ? "#27AE60" : "#7F8C9A",
                        }}
                      >
                        {r.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
