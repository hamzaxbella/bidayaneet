"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import BusinessAction from "@/components/workspace/BusinessAction";
import { useAdminData } from "@/components/workspace/AdminData";

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

export default function ProgramsPage() {
  const { text: uiText } = useUiTranslation();

  const {
    programs,
    totalPrograms,
    activePrograms,
    totalEnrolled,
    completionRate,
    enrollmentTrend,
    metrics,
    data,
  } = useAdminData();

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
              <Translated value="Programs" />
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Manage collaborating programs and track NEET enrollment across partners" />
            </p>
          </div>
          <BusinessAction kind="program">
            <Plus size={15} />
            <Translated value="Add Program" />
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
        {/* KPIs */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <KPISimple
            title={uiText("Total Programs")}
            value={String(totalPrograms)}
            change={0}
            color="#8E44AD"
            bg="#F5EEF8"
          />
          <KPISimple
            title={uiText("Active Programs")}
            value={String(activePrograms)}
            change={0}
            color="#27AE60"
            bg="#EAFAF1"
          />
          <KPISimple
            title={uiText("NEETs Enrolled")}
            value={totalEnrolled.toLocaleString()}
            change={0}
            color="#00B8A9"
            bg="#E0F7F5"
          />
          <KPISimple
            title={uiText("Avg Completion Rate")}
            value={`${completionRate}%`}
            change={0}
            color="#F5A623"
            bg="#FEF9E7"
          />
        </div>

        {/* Program Cards */}
        <div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            <Translated value="Collaborating Programs" />
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
                        <Translated value="Active" />
                      </span>
                    </div>
                    <BusinessAction
                      kind="program"
                      id={p.id}
                      className="btn-secondary"
                    >
                      <Translated value="Modifier" />
                    </BusinessAction>
                  </div>
                  <BusinessAction
                    kind="membership"
                    id={p.id}
                    className="btn-secondary"
                  >
                    <Translated value="Gérer les inscriptions" />
                  </BusinessAction>
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
                      <span>
                        <Translated value="Enrollment" />
                      </span>
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
                      <span style={{ color: "#7F8C9A" }}>
                        <Translated value="Completed" />
                      </span>
                      <strong style={{ color: "#1A2B3C" }}>
                        {p.completed}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#7F8C9A" }}>
                        <Translated value="Dropout" />
                      </span>
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
            <Translated value="Enrollment Trend (2025)" />
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
