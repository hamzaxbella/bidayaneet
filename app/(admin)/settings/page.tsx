"use client";

import { User, MapPin, Shield, Bell, Link, Check } from "lucide-react";
import { useState } from "react";

const settingsTabs = [
  { id: "profile", label: "Profile & Account", icon: <User size={16} /> },
  { id: "region", label: "Region & Communes", icon: <MapPin size={16} /> },
  { id: "roles", label: "Roles & Permissions", icon: <Shield size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "integrations", label: "Integrations & API", icon: <Link size={16} /> },
];

const roles = [
  {
    name: "Amina El Mansouri",
    email: "amina@bidayaneet.ma",
    role: "Regional Admin",
    commune: "All Communes",
    avatar: "AE",
    status: "active",
  },
  {
    name: "Khalid Benhima",
    email: "khalid@bidayaneet.ma",
    role: "Mediator",
    commune: "Inezgane",
    avatar: "KB",
    status: "active",
  },
  {
    name: "Imane Rachidi",
    email: "imane@bidayaneet.ma",
    role: "Mediator",
    commune: "Agadir",
    avatar: "IR",
    status: "active",
  },
  {
    name: "Saad El Fassi",
    email: "saad@bidayaneet.ma",
    role: "Viewer",
    commune: "Chtouka",
    avatar: "SF",
    status: "inactive",
  },
];

const integrations = [
  {
    name: "WhatsApp Business API",
    desc: "Chatbot for NEET communication and opportunity delivery",
    status: "connected",
    color: "#25D366",
    icon: "💬",
  },
  {
    name: "ANAPEC Portal",
    desc: "Data sync with national employment agency portal",
    status: "connected",
    color: "#E74C3C",
    icon: "🏛️",
  },
  {
    name: "INDH Platform",
    desc: "Integration with INDH programs and beneficiary data",
    status: "pending",
    color: "#1B8A5A",
    icon: "🌿",
  },
  {
    name: "SMS Gateway",
    desc: "Fallback SMS notifications for NEETs without WhatsApp",
    status: "connected",
    color: "#2E86C1",
    icon: "📱",
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

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
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1A2B3C" }}>
          Settings
        </h1>
        <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
          Manage your platform configuration, users, and integrations
        </p>
      </div>

      <div
        className="admin-settings-layout"
        style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 24 }}
      >
        {/* Sidebar tabs */}
        <div
          className="settings-navigation"
          style={{ width: 220, flexShrink: 0 }}
        >
          <div className="card" style={{ padding: 12 }}>
            {settingsTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: activeTab === t.id ? "#E0F7F5" : "transparent",
                  color: activeTab === t.id ? "#00B8A9" : "#4A5568",
                  fontSize: "0.8125rem",
                  fontWeight: activeTab === t.id ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                }}
              >
                <span
                  style={{ color: activeTab === t.id ? "#00B8A9" : "#A0ADB8" }}
                >
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}
        >
          {activeTab === "profile" && (
            <div className="card" style={{ padding: 28 }}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>
                Profile & Account
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 28,
                  paddingBottom: 24,
                  borderBottom: "1px solid #E8ECF0",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00B8A9, #1B4F72)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                  }}
                >
                  AE
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      color: "#1A2B3C",
                    }}
                  >
                    Amina El Mansouri
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#7F8C9A" }}>
                    Regional Admin · Souss-Massa
                  </div>
                  <button
                    style={{
                      marginTop: 8,
                      padding: "5px 14px",
                      background: "#E0F7F5",
                      color: "#00B8A9",
                      border: "none",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  { label: "Full Name", value: "Amina El Mansouri" },
                  { label: "Email", value: "amina@bidayaneet.ma" },
                  { label: "Phone", value: "+212 6 12 34 56 78" },
                  { label: "Role", value: "Regional Admin" },
                  { label: "Region", value: "Souss-Massa" },
                  { label: "Language", value: "French / Arabic" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#7F8C9A",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      defaultValue={value}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1px solid #E8ECF0",
                        borderRadius: 8,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                        outline: "none",
                        background: "#F9FAFB",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <button className="btn-primary">
                  <Check size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="card" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h2 className="section-title">Users & Roles</h2>
                <button className="btn-primary">+ Invite User</button>
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
                    {["Name", "Email", "Role", "Commune", "Status"].map((h) => (
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
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < roles.length - 1 ? "1px solid #F4F6F9" : "none",
                      }}
                    >
                      <td style={{ padding: "10px 12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Avatar initials={r.avatar} size={28} />
                          <span style={{ fontWeight: 600 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#7F8C9A" }}>
                        {r.email}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background: "#E0F7F5",
                            color: "#00B8A9",
                            borderRadius: 20,
                            padding: "3px 10px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                          }}
                        >
                          {r.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#4A5568" }}>
                        {r.commune}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background:
                              r.status === "active" ? "#EAFAF1" : "#F2F3F4",
                            color:
                              r.status === "active" ? "#1E8449" : "#717D7E",
                            borderRadius: 20,
                            padding: "3px 10px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                          }}
                        >
                          {r.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="card" style={{ padding: 20 }}>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Integrations & API Keys
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {integrations.map((intg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 16,
                      border: "1px solid #E8ECF0",
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${intg.color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}
                    >
                      {intg.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "#1A2B3C",
                        }}
                      >
                        {intg.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#7F8C9A",
                          marginTop: 2,
                        }}
                      >
                        {intg.desc}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          background:
                            intg.status === "connected" ? "#EAFAF1" : "#FEF9E7",
                          color:
                            intg.status === "connected" ? "#1E8449" : "#D4AC0D",
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {intg.status === "connected"
                          ? "● Connected"
                          : "● Pending"}
                      </span>
                      <button
                        style={{
                          padding: "6px 14px",
                          border: "1px solid #E8ECF0",
                          borderRadius: 8,
                          background: "white",
                          fontSize: "0.75rem",
                          color: "#4A5568",
                          cursor: "pointer",
                        }}
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* API Key section */}
              <div
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: "#F9FAFB",
                  borderRadius: 12,
                }}
              >
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#1A2B3C",
                    marginBottom: 10,
                  }}
                >
                  API Access Key
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value="sk-bidayaneet-•••••••••••••••••"
                    readOnly
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      border: "1px solid #E8ECF0",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      color: "#7F8C9A",
                      background: "white",
                      fontFamily: "monospace",
                    }}
                  />
                  <button
                    className="btn-outline"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Copy
                  </button>
                  <button
                    style={{
                      padding: "8px 14px",
                      background: "#FDEDEC",
                      color: "#E74C3C",
                      border: "none",
                      borderRadius: 8,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "region" || activeTab === "notifications") && (
            <div
              className="card"
              style={{
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                minHeight: 300,
              }}
            >
              <div style={{ fontSize: "3rem" }}>
                {activeTab === "region" ? "🗺️" : "🔔"}
              </div>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#1A2B3C",
                }}
              >
                {activeTab === "region"
                  ? "Region & Commune Management"
                  : "Notification Preferences"}
              </h2>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "#7F8C9A",
                  textAlign: "center",
                  maxWidth: 380,
                }}
              >
                {activeTab === "region"
                  ? "Configure commune boundaries, assign mediators to zones, and manage regional hierarchy."
                  : "Customize when and how you receive alerts via email, SMS, and in-app notifications."}
              </p>
              <button className="btn-primary">Configure Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
