"use client";
import Translated from "@/components/Translated";

import { useAdminData } from "@/components/workspace/AdminData";

import { Layers, MapPin } from "lucide-react";
import MoroccoMap from "@/components/MoroccoMap";
import { useCallback, useMemo, useState } from "react";

type LayerKey = "neets" | "mediators" | "programs";

type CommunePoint = {
  name: string;
  province: string;
  lat: number;
  lng: number;
  neets: number;
  mediators: number;
  programs: number;
};

const layerConfig: Record<
  LayerKey,
  { label: string; color: string; radius: number; blur: number; max: number }
> = {
  neets: {
    label: "NEET Density",
    color: "#E74C3C",
    radius: 72,
    blur: 48,
    max: 700,
  },
  mediators: {
    label: "Mediator Coverage",
    color: "#00B8A9",
    radius: 62,
    blur: 42,
    max: 12,
  },
  programs: {
    label: "Program Reach",
    color: "#8E44AD",
    radius: 58,
    blur: 40,
    max: 4,
  },
};

function heatValue(point: CommunePoint, layer: LayerKey) {
  return point[layer];
}

function heatColor(value: number, layer: LayerKey) {
  const normalized = value / layerConfig[layer].max;
  if (normalized > 0.72) return "#E74C3C";
  if (normalized > 0.38) return "#F5A623";
  if (normalized > 0.18) return "#00B8A9";
  return "#2E86C1";
}

function HeatMapCanvas({
  activeLayer,
  onSelect,
  selected,
}: {
  activeLayer: LayerKey;
  onSelect: (name: string) => void;
  selected: string | null;
}) {
  const { communes } = useAdminData();

  return (
    <MoroccoMap
      height={490}
      points={communes.map((point) => ({
        ...point,
        value: point[activeLayer],
      }))}
      onSelect={onSelect}
      selected={selected}
    />
  );
}

export default function HeatmapPage() {
  const { mediators, programs, communes, provinceTotals, metrics, data } =
    useAdminData();

  const [selected, setSelected] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerKey>("neets");
  const selectedCommune = communes.find((c) => c.name === selected);
  const selectedMetricMax = Math.max(
    1,
    ...Object.values(provinceTotals).map((v) => v[activeLayer]),
  );
  const sortedCommunes = useMemo(
    () => [...communes].sort((a, b) => b[activeLayer] - a[activeLayer]),
    [activeLayer, communes],
  );
  const selectCommune = useCallback((name: string) => setSelected(name), []);

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
              <Translated value="Heatmap" />
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7F8C9A", marginTop: 2 }}>
              <Translated value="Country-wide overview with sample youth, mediator, and program coverage in Souss-Massa" />
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(Object.keys(layerConfig) as LayerKey[]).map((id) => (
              <button
                key={id}
                onClick={() => setActiveLayer(id)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${activeLayer === id ? layerConfig[id].color : "#E8ECF0"}`,
                  background:
                    activeLayer === id ? `${layerConfig[id].color}12` : "white",
                  color: activeLayer === id ? layerConfig[id].color : "#4A5568",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {layerConfig[id].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20 }}>
        <div className="card" style={{ flex: 2, padding: 20, minHeight: 560 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div>
              <h2 className="section-title">
                <Translated value="Souss-Massa Region -" />
                {layerConfig[activeLayer].label}
              </h2>
              <p
                style={{ marginTop: 4, color: "#7F8C9A", fontSize: "0.75rem" }}
              >
                <Translated value="Explore the full-country overview, including Laâyoune and Dakhla, or focus on Souss-Massa." />
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#4A5568",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              <Layers size={14} color={layerConfig[activeLayer].color} />
              {communes.length}
              <Translated value="mapped points" />
            </div>
          </div>
          <HeatMapCanvas
            activeLayer={activeLayer}
            onSelect={selectCommune}
            selected={selected}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div className="card" style={{ padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>
              <Translated value="Province Rollup" />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {Object.entries(provinceTotals)
                .sort(([, a], [, b]) => b[activeLayer] - a[activeLayer])
                .map(([province, totals]) => (
                  <div
                    key={province}
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.76rem",
                      }}
                    >
                      <span style={{ color: "#4A5568", fontWeight: 600 }}>
                        {province}
                      </span>
                      <span style={{ color: "#1A2B3C", fontWeight: 800 }}>
                        {totals[activeLayer]}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 7,
                        background: "#F4F6F9",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((totals[activeLayer] / selectedMetricMax) * 100, 100)}%`,
                          height: "100%",
                          borderRadius: 4,
                          background: layerConfig[activeLayer].color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, flex: 1 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>
              <Translated value="Mapped Communes" />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sortedCommunes.map((c) => {
                const value = heatValue(c, activeLayer);
                const color = heatColor(value, activeLayer);
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setSelected(c.name)}
                    aria-pressed={selected === c.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background:
                        selected === c.name ? "#E0F7F5" : "transparent",
                      border:
                        selected === c.name
                          ? "1px solid #00B8A9"
                          : "1px solid transparent",
                    }}
                  >
                    <MapPin size={14} color={color} style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.8125rem",
                        fontWeight: selected === c.name ? 700 : 500,
                        color: "#1A2B3C",
                      }}
                    >
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        color: "#1A2B3C",
                      }}
                    >
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCommune && (
            <div className="card" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <MapPin
                  size={16}
                  color={heatColor(selectedCommune[activeLayer], activeLayer)}
                />
                <div>
                  <h2
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#1A2B3C",
                    }}
                  >
                    {selectedCommune.name}
                  </h2>
                  <p style={{ fontSize: "0.7rem", color: "#7F8C9A" }}>
                    {selectedCommune.province}
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "Total NEETs",
                    value: selectedCommune.neets,
                    color: "#E74C3C",
                    max: layerConfig.neets.max,
                  },
                  {
                    label: "Active Mediators",
                    value: selectedCommune.mediators,
                    color: "#00B8A9",
                    max: layerConfig.mediators.max,
                  },
                  {
                    label: "Programs Available",
                    value: selectedCommune.programs,
                    color: "#8E44AD",
                    max: layerConfig.programs.max,
                  },
                ].map(({ label, value, color, max }) => (
                  <div key={label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: "#4A5568" }}>{label}</span>
                      <span style={{ fontWeight: 700, color }}>{value}</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "#F4F6F9",
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((value / max) * 100, 100)}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
