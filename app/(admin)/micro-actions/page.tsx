"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import BusinessAction from "@/components/workspace/BusinessAction";
import { useAdminData } from "@/components/workspace/AdminData";

import {
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronLeft,
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

const calendarDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  hasAction: [3, 6, 10, 12, 15, 18, 20, 24, 27].includes(i + 1),
}));

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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>
      <div className={up ? "badge-up" : "badge-down"}>
        {up ? <TrendingUp size={12} /> : null} {change !== 0 && up ? "+" : ""}
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

export default function MicroActionsPage() {
  const { text: uiText } = useUiTranslation();

  const { actions, impactData, metrics, data } = useAdminData();

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
              <Translated value="Micro-actions" />
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Schedule and track local micro-activities for NEET engagement" />
            </p>
          </div>
          <BusinessAction kind="activity">
            <Plus size={15} />
            <Translated value="Add Action" />
          </BusinessAction>
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
            title={uiText("Total Actions")}
            value={String(metrics.activities)}
            change={0}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title={uiText("Scheduled")}
            value={String(
              data.activities.filter(
                (a) => a.data.date >= new Date().toISOString().slice(0, 10),
              ).length,
            )}
            change={0}
            color="#2E86C1"
            bg="#EBF5FB"
          />
          <KPISimple
            title={uiText("Présences enregistrées")}
            value={String(data.participations.filter((p) => p.attended).length)}
            change={0}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title={uiText("NEETs Reached")}
            value={String(
              new Set(
                data.participations
                  .filter((p) => p.attended)
                  .map((p) => p.youth_id),
              ).size,
            )}
            change={0}
            color="#8E44AD"
            bg="#F5EEF8"
          />
        </div>

        {/* Calendar + Actions */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Mini Calendar */}
          <div className="card" style={{ padding: 20, flex: "0 0 280px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <h2
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#1A2B3C",
                }}
              >
                <Translated value="June 2025" />
              </h2>
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
              }}
            >
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    fontSize: "0.68rem",
                    color: "#7F8C9A",
                    fontWeight: 600,
                    padding: "4px 0",
                  }}
                >
                  {d}
                </div>
              ))}
              {calendarDays.map(({ day, hasAction }) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    padding: "5px 2px",
                    borderRadius: 6,
                    background: hasAction ? "#00B8A9" : "transparent",
                    color: hasAction ? "white" : "#1A2B3C",
                    fontSize: "0.75rem",
                    fontWeight: hasAction ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Actions */}
          <div className="card" style={{ flex: 1, padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              <Translated value="Upcoming Actions" />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {actions.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px",
                    border: "1px solid #E8ECF0",
                    borderRadius: 12,
                    borderLeft: `4px solid ${a.color}`,
                  }}
                >
                  <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {a.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#7F8C9A",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <MapPin size={10} />
                        {a.commune}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#7F8C9A",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Calendar size={10} />
                        {a.date}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
                        <Translated value="By" />
                        {a.organizer}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#1A2B3C",
                      }}
                    >
                      {a.enrolled}/{a.capacity}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#7F8C9A" }}>
                      <Translated value="enrolled" />
                    </div>
                    <span
                      style={{
                        background: `${a.color}18`,
                        color: a.color,
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                      }}
                    >
                      {a.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact chart */}
        <div className="card" style={{ padding: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            <Translated value="NEETs Reached by Action Type" />
          </h2>
          <ResponsiveContainer
            width="100%"
            height={200}
            initialDimension={{ width: 640, height: 200 }}
          >
            <BarChart
              data={impactData}
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
                dataKey="reached"
                fill="#00B8A9"
                radius={[4, 4, 0, 0]}
                name="NEETs Reached"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
