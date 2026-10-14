"use client";

import { Layers, MapPin } from "lucide-react";
import MoroccoMap from "@/components/MoroccoMap";
import { AdminHeader } from "@/components/admin/AdminUI";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
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

const communes: CommunePoint[] = [
  {
    name: "Agadir",
    province: "Agadir-Ida-Ou-Tanane",
    lat: 30.4278,
    lng: -9.5981,
    neets: 680,
    mediators: 12,
    programs: 4,
  },
  {
    name: "Inezgane",
    province: "Inezgane-Ait Melloul",
    lat: 30.3563,
    lng: -9.5364,
    neets: 420,
    mediators: 8,
    programs: 3,
  },
  {
    name: "Ait Melloul",
    province: "Inezgane-Ait Melloul",
    lat: 30.3342,
    lng: -9.4979,
    neets: 140,
    mediators: 4,
    programs: 2,
  },
  {
    name: "Aourir",
    province: "Agadir-Ida-Ou-Tanane",
    lat: 30.4926,
    lng: -9.6372,
    neets: 118,
    mediators: 3,
    programs: 1,
  },
  {
    name: "Oulad Teima",
    province: "Taroudannt",
    lat: 30.3947,
    lng: -9.2089,
    neets: 210,
    mediators: 5,
    programs: 2,
  },
  {
    name: "Taroudant",
    province: "Taroudannt",
    lat: 30.4727,
    lng: -8.8749,
    neets: 280,
    mediators: 6,
    programs: 2,
  },
  {
    name: "Biougra",
    province: "Chtouka-Ait Baha",
    lat: 30.2144,
    lng: -9.3711,
    neets: 87,
    mediators: 3,
    programs: 1,
  },
  {
    name: "Massa",
    province: "Chtouka-Ait Baha",
    lat: 29.9457,
    lng: -9.6334,
    neets: 94,
    mediators: 2,
    programs: 1,
  },
  {
    name: "Tiznit",
    province: "Tiznit",
    lat: 29.6974,
    lng: -9.7316,
    neets: 215,
    mediators: 5,
    programs: 2,
  },
  {
    name: "Tafraout",
    province: "Tiznit",
    lat: 29.7244,
    lng: -8.9747,
    neets: 76,
    mediators: 2,
    programs: 1,
  },
  {
    name: "Tata",
    province: "Tata",
    lat: 29.7441,
    lng: -7.9736,
    neets: 120,
    mediators: 3,
    programs: 1,
  },
  {
    name: "Akka",
    province: "Tata",
    lat: 29.4071,
    lng: -8.2521,
    neets: 68,
    mediators: 1,
    programs: 1,
  },
];

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

const provinceTotals = communes.reduce<
  Record<string, { neets: number; mediators: number; programs: number }>
>((acc, commune) => {
  if (!acc[commune.province])
    acc[commune.province] = { neets: 0, mediators: 0, programs: 0 };
  acc[commune.province].neets += commune.neets;
  acc[commune.province].mediators += commune.mediators;
  acc[commune.province].programs += commune.programs;
  return acc;
}, {});

function heatValue(point: CommunePoint, layer: LayerKey) {
  return point[layer];
}



export default function HeatmapPage() {
  const [selected, setSelected] = useState<string | null>("Agadir");
  const [activeLayer, setActiveLayer] = useState<LayerKey>("neets");
  const selectedCommune = communes.find((commune) => commune.name === selected);
  const selectedMetricMax = Math.max(...Object.values(provinceTotals).map((value) => value[activeLayer]));
  const sortedCommunes = useMemo(() => [...communes].sort((a, b) => b[activeLayer] - a[activeLayer]), [activeLayer]);
  const selectCommune = useCallback((name: string) => setSelected(name), []);
  return (
    <div className="admin-page admin-heatmap-page">
      <AdminHeader title="Heatmap" description="National geography and sample coverage in Souss-Massa" />
      <div className="admin-content">
        <ToggleGroup type="single" value={activeLayer} onValueChange={(value) => { if (value) setActiveLayer(value as LayerKey); }} aria-label="Coverage layer" variant="outline" className="admin-map-layers">
          {(Object.keys(layerConfig) as LayerKey[]).map((layer) => <ToggleGroupItem key={layer} value={layer}>{layerConfig[layer].label}</ToggleGroupItem>)}
        </ToggleGroup>
        <div className="admin-heatmap-grid">
          <section className="card admin-insight-card admin-heatmap-card">
            <div className="admin-section-header"><div><h2 className="section-title">{layerConfig[activeLayer].label}</h2><p className="admin-muted">Explore the national view or focus on Souss-Massa.</p></div><span className="admin-location"><Layers size={14} />{communes.length} mapped points</span></div>
            <MoroccoMap height={470} points={communes.map((point) => ({ ...point, value: point[activeLayer] }))} onSelect={selectCommune} selected={selected} />
          </section>
          <div className="admin-heatmap-details">
            {selectedCommune && <section className="card admin-insight-card"><div className="admin-section-header"><div><h2 className="section-title">{selectedCommune.name}</h2><p className="admin-muted">{selectedCommune.province}</p></div><MapPin size={20} /></div><div className="admin-map-metrics">{[{ label: "Total NEETs", value: selectedCommune.neets, max: layerConfig.neets.max }, { label: "Active Mediators", value: selectedCommune.mediators, max: layerConfig.mediators.max }, { label: "Programs Available", value: selectedCommune.programs, max: layerConfig.programs.max }].map((item) => <div key={item.label}><div className="admin-row"><span className="admin-muted">{item.label}</span><strong>{item.value}</strong></div><div className="admin-progress"><div style={{ width: `${Math.min(item.value / item.max * 100, 100)}%` }} /></div></div>)}</div></section>}
            <section className="card admin-insight-card"><h2 className="section-title">Province Rollup</h2><div className="admin-map-metrics">{Object.entries(provinceTotals).sort(([, a], [, b]) => b[activeLayer] - a[activeLayer]).map(([province, totals]) => <div key={province}><div className="admin-row"><span className="admin-muted">{province}</span><strong>{totals[activeLayer]}</strong></div><div className="admin-progress"><div style={{ width: `${totals[activeLayer] / selectedMetricMax * 100}%` }} /></div></div>)}</div></section>
          </div>
        </div>
        <section className="card admin-insight-card"><div className="admin-section-header"><h2 className="section-title">Mapped Communes</h2><p className="admin-muted">Select a commune to inspect its coverage.</p></div><div className="admin-commune-grid">{sortedCommunes.map((commune) => <Button key={commune.name} variant={selected === commune.name ? "secondary" : "outline"} aria-pressed={selected === commune.name} onClick={() => setSelected(commune.name)}><MapPin data-icon="inline-start" /><span>{commune.name}</span><strong>{heatValue(commune, activeLayer)}</strong></Button>)}</div></section>
        <p className="admin-muted">Coverage values are sample data. Map and heat controls are interactive.</p>
      </div>
    </div>
  );
}
