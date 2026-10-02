"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changePeriod: string;
  icon: React.ReactNode;
  iconBg: string;
  sparkData: { v: number }[];
  sparkColor: string;
}

export default function KPICard({
  title,
  value,
  change,
  changePeriod,
  icon,
  iconBg,
  sparkData,
  sparkColor,
}: KPICardProps) {
  const isUp = change >= 0;
  return (
    <div className="kpi-card" style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{ fontSize: "0.78rem", color: "#7F8C9A", fontWeight: 500 }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1A2B3C",
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </span>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {isUp ? (
          <span className="badge-up">
            <TrendingUp size={12} /> +{change}%
          </span>
        ) : (
          <span className="badge-down">
            <TrendingDown size={12} /> {change}%
          </span>
        )}
        <span style={{ fontSize: "0.72rem", color: "#7F8C9A" }}>
          {changePeriod}
        </span>
      </div>
      <div style={{ height: 44 }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 240, height: 44 }}
        >
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={sparkColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
