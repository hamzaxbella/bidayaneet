"use client";

import { AlertTriangle, Database, Info, Layers, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const GEOBOUNDARIES_API = 'https://www.geoboundaries.org/api/current/gbOpen/MAR/ADM1';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_HEAT_JS = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';

type LeafletMap = {
  fitBounds: (bounds: unknown, options?: unknown) => void;
  remove: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  bindTooltip: (content: string, options?: unknown) => LeafletLayer;
  getBounds: () => unknown;
  on: (event: string, handler: () => void) => LeafletLayer;
  openTooltip: () => void;
};

type LeafletNamespace = {
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => LeafletLayer;
  geoJSON: (feature: GeoFeature, options: Record<string, unknown>) => LeafletLayer;
  heatLayer: (points: number[][], options: Record<string, unknown>) => LeafletLayer;
  circleMarker: (coordinates: [number, number], options: Record<string, unknown>) => LeafletLayer;
};

type GeoFeature = {
  properties?: Record<string, unknown>;
  [key: string]: unknown;
};

declare global {
  interface Window {
    L?: unknown;
  }
}

type LayerKey = 'neets' | 'mediators' | 'programs';

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
  { name: 'Agadir', province: 'Agadir-Ida-Ou-Tanane', lat: 30.4278, lng: -9.5981, neets: 680, mediators: 12, programs: 4 },
  { name: 'Inezgane', province: 'Inezgane-Ait Melloul', lat: 30.3563, lng: -9.5364, neets: 420, mediators: 8, programs: 3 },
  { name: 'Ait Melloul', province: 'Inezgane-Ait Melloul', lat: 30.3342, lng: -9.4979, neets: 140, mediators: 4, programs: 2 },
  { name: 'Aourir', province: 'Agadir-Ida-Ou-Tanane', lat: 30.4926, lng: -9.6372, neets: 118, mediators: 3, programs: 1 },
  { name: 'Oulad Teima', province: 'Taroudannt', lat: 30.3947, lng: -9.2089, neets: 210, mediators: 5, programs: 2 },
  { name: 'Taroudant', province: 'Taroudannt', lat: 30.4727, lng: -8.8749, neets: 280, mediators: 6, programs: 2 },
  { name: 'Biougra', province: 'Chtouka-Ait Baha', lat: 30.2144, lng: -9.3711, neets: 87, mediators: 3, programs: 1 },
  { name: 'Massa', province: 'Chtouka-Ait Baha', lat: 29.9457, lng: -9.6334, neets: 94, mediators: 2, programs: 1 },
  { name: 'Tiznit', province: 'Tiznit', lat: 29.6974, lng: -9.7316, neets: 215, mediators: 5, programs: 2 },
  { name: 'Tafraout', province: 'Tiznit', lat: 29.7244, lng: -8.9747, neets: 76, mediators: 2, programs: 1 },
  { name: 'Tata', province: 'Tata', lat: 29.7441, lng: -7.9736, neets: 120, mediators: 3, programs: 1 },
  { name: 'Akka', province: 'Tata', lat: 29.4071, lng: -8.2521, neets: 68, mediators: 1, programs: 1 },
];

const layerConfig: Record<LayerKey, { label: string; color: string; radius: number; blur: number; max: number }> = {
  neets: { label: 'NEET Density', color: '#E74C3C', radius: 72, blur: 48, max: 700 },
  mediators: { label: 'Mediator Coverage', color: '#00B8A9', radius: 62, blur: 42, max: 12 },
  programs: { label: 'Program Reach', color: '#8E44AD', radius: 58, blur: 40, max: 4 },
};

const provinceTotals = communes.reduce<Record<string, { neets: number; mediators: number; programs: number }>>((acc, commune) => {
  if (!acc[commune.province]) acc[commune.province] = { neets: 0, mediators: 0, programs: 0 };
  acc[commune.province].neets += commune.neets;
  acc[commune.province].mediators += commune.mediators;
  acc[commune.province].programs += commune.programs;
  return acc;
}, {});

function loadStylesheet(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function heatValue(point: CommunePoint, layer: LayerKey) {
  return point[layer];
}

function heatColor(value: number, layer: LayerKey) {
  const normalized = value / layerConfig[layer].max;
  if (normalized > 0.72) return '#E74C3C';
  if (normalized > 0.38) return '#F5A623';
  if (normalized > 0.18) return '#00B8A9';
  return '#2E86C1';
}

function buildHeatField(layer: LayerKey) {
  const max = layerConfig[layer].max;
  const offsets = [
    [0, 0, 1],
    [0.035, 0, 0.78],
    [-0.035, 0, 0.78],
    [0, 0.045, 0.78],
    [0, -0.045, 0.78],
    [0.027, 0.034, 0.64],
    [0.027, -0.034, 0.64],
    [-0.027, 0.034, 0.64],
    [-0.027, -0.034, 0.64],
    [0.07, 0, 0.38],
    [-0.07, 0, 0.38],
    [0, 0.09, 0.38],
    [0, -0.09, 0.38],
    [0.052, 0.067, 0.28],
    [0.052, -0.067, 0.28],
    [-0.052, 0.067, 0.28],
    [-0.052, -0.067, 0.28],
  ];

  return communes.flatMap((point) => {
    const intensity = Math.max(0.18, heatValue(point, layer) / max);
    return offsets.map(([latOffset, lngOffset, falloff]) => [
      point.lat + latOffset,
      point.lng + lngOffset,
      Math.min(1, intensity * falloff),
    ]);
  });
}

async function fetchSoussMassaBoundary() {
  const metaResponse = await fetch(GEOBOUNDARIES_API);
  if (!metaResponse.ok) throw new Error('GeoBoundaries metadata request failed');
  const metadata = await metaResponse.json();
  const geoJsonUrl = metadata.simplifiedGeometryGeoJSON || metadata.geoJSON;
  if (!geoJsonUrl) throw new Error('GeoBoundaries response did not include a GeoJSON URL');

  const geoResponse = await fetch(geoJsonUrl);
  if (!geoResponse.ok) throw new Error('GeoBoundaries GeoJSON request failed');
  const collection = await geoResponse.json() as { features?: GeoFeature[] };
  const feature = collection.features?.find((item: GeoFeature) => {
    const text = JSON.stringify(item.properties ?? {}).toLowerCase();
    return text.includes('souss') && text.includes('massa');
  });

  if (!feature) throw new Error('Souss-Massa boundary was not found in GeoBoundaries ADM1 data');
  return feature;
}

function HeatMapCanvas({ activeLayer, onSelect }: { activeLayer: LayerKey; onSelect: (name: string) => void }) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [sourceStatus, setSourceStatus] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    async function initMap() {
      if (!mapEl.current) return;

      loadStylesheet('leaflet-css', LEAFLET_CSS);
      await loadScript('leaflet-js', LEAFLET_JS);
      await loadScript('leaflet-heat-js', LEAFLET_HEAT_JS);
      if (cancelled || !mapEl.current || !window.L) return;

      const L = window.L as LeafletNamespace;
      const leafletMap = L.map(mapEl.current, {
        center: [30.05, -8.86],
        zoom: 8,
        minZoom: 7,
        maxZoom: 12,
        scrollWheelZoom: true,
        zoomControl: false,
        attributionControl: true,
      });
      map = leafletMap;
      mapRef.current = leafletMap;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap);

      try {
        const feature = await fetchSoussMassaBoundary();
        if (cancelled) return;
        const boundary = L.geoJSON(feature, {
          style: {
            color: '#1B4F72',
            weight: 2,
            fillColor: '#00B8A9',
            fillOpacity: 0.06,
          },
        }).addTo(leafletMap);
        leafletMap.fitBounds(boundary.getBounds(), { padding: [24, 24] });
        setSourceStatus('live');
      } catch {
        if (!cancelled) setSourceStatus('fallback');
      }

      L.heatLayer(
        buildHeatField(activeLayer),
        {
          radius: layerConfig[activeLayer].radius,
          blur: layerConfig[activeLayer].blur,
          max: 1,
          minOpacity: 0.32,
          maxZoom: 11,
          gradient: {
            0.12: '#2E86C1',
            0.34: '#00B8A9',
            0.58: '#F5A623',
            1: '#E74C3C',
          },
        }
      ).addTo(leafletMap);

      communes.forEach((point) => {
        const value = heatValue(point, activeLayer);
        const color = heatColor(value, activeLayer);
        L.circleMarker([point.lat, point.lng], {
          radius: 12,
          color: 'transparent',
          weight: 0,
          fillColor: color,
          fillOpacity: 0,
        })
          .addTo(leafletMap)
          .bindTooltip(`${point.name}: ${value} ${activeLayer === 'neets' ? 'NEETs' : activeLayer}`, {
            direction: 'top',
            offset: [0, -8],
          })
          .on('click', () => onSelect(point.name));
      });
    }

    initMap().catch(() => setSourceStatus('fallback'));

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [activeLayer, onSelect]);

  return (
    <div style={{ position: 'relative', minHeight: 500, borderRadius: 12, overflow: 'hidden', border: '1px solid #DCEAF0', background: '#DDEEF5' }}>
      <div ref={mapEl} style={{ width: '100%', minHeight: 500 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 500 }}>
        <button aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()} style={{ border: '1px solid #E8ECF0', borderRadius: 6, padding: '6px 8px', background: 'white', cursor: 'pointer', display: 'flex' }}><ZoomIn size={14} /></button>
        <button aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()} style={{ border: '1px solid #E8ECF0', borderRadius: 6, padding: '6px 8px', background: 'white', cursor: 'pointer', display: 'flex' }}><ZoomOut size={14} /></button>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'white', borderRadius: 8, padding: '8px 12px', fontSize: '0.68rem', border: '1px solid #E8ECF0', display: 'flex', gap: 8, alignItems: 'center', zIndex: 500 }}>
        <span style={{ color: '#2E86C1', fontWeight: 700 }}>Low</span>
        <div style={{ width: 76, height: 6, background: 'linear-gradient(to right, #2E86C1, #00B8A9, #F5A623, #E74C3C)', borderRadius: 3 }} />
        <span style={{ color: '#E74C3C', fontWeight: 700 }}>High</span>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.94)', borderRadius: 8, padding: '8px 10px', fontSize: '0.68rem', color: '#4A5568', border: '1px solid #E8ECF0', display: 'flex', gap: 6, alignItems: 'center', zIndex: 500 }}>
        {sourceStatus === 'live' ? <Database size={12} color="#00B8A9" /> : sourceStatus === 'fallback' ? <AlertTriangle size={12} color="#F5A623" /> : <Info size={12} color="#2E86C1" />}
        {sourceStatus === 'live' ? 'GeoBoundaries ADM1 outline + OSM tiles' : sourceStatus === 'fallback' ? 'Live boundary unavailable; using OSM tiles and coordinates' : 'Loading regional boundary'}
      </div>
    </div>
  );
}

export default function HeatmapPage() {
  const [selected, setSelected] = useState<string | null>('Agadir');
  const [activeLayer, setActiveLayer] = useState<LayerKey>('neets');
  const selectedCommune = communes.find(c => c.name === selected);
  const selectedMetricMax = Math.max(...Object.values(provinceTotals).map(v => v[activeLayer]));
  const sortedCommunes = useMemo(() => [...communes].sort((a, b) => b[activeLayer] - a[activeLayer]), [activeLayer]);
  const selectCommune = useCallback((name: string) => setSelected(name), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #E8ECF0', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1A2B3C' }}>Heatmap</h1>
            <p style={{ fontSize: '0.78rem', color: '#7F8C9A', marginTop: 2 }}>Live map-backed density layer for NEETs, mediators, and programs across Souss-Massa</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.keys(layerConfig) as LayerKey[]).map((id) => (
              <button key={id} onClick={() => setActiveLayer(id)}
                style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${activeLayer === id ? layerConfig[id].color : '#E8ECF0'}`, background: activeLayer === id ? `${layerConfig[id].color}12` : 'white', color: activeLayer === id ? layerConfig[id].color : '#4A5568', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                {layerConfig[id].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', gap: 20 }}>
        <div className="card" style={{ flex: 2, padding: 20, minHeight: 560 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
            <div>
              <h2 className="section-title">Souss-Massa Region - {layerConfig[activeLayer].label}</h2>
              <p style={{ marginTop: 4, color: '#7F8C9A', fontSize: '0.75rem' }}>Heat intensity is rendered from point coordinates and regional context from OpenStreetMap and GeoBoundaries.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4A5568', fontSize: '0.72rem', fontWeight: 600 }}>
              <Layers size={14} color={layerConfig[activeLayer].color} />
              {communes.length} mapped points
            </div>
          </div>
          <HeatMapCanvas activeLayer={activeLayer} onSelect={selectCommune} />
        </div>

        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>Province Rollup</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {Object.entries(provinceTotals).sort(([, a], [, b]) => b[activeLayer] - a[activeLayer]).map(([province, totals]) => (
                <div key={province} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: '#4A5568', fontWeight: 600 }}>{province}</span>
                    <span style={{ color: '#1A2B3C', fontWeight: 800 }}>{totals[activeLayer]}</span>
                  </div>
                  <div style={{ height: 7, background: '#F4F6F9', borderRadius: 4 }}>
                    <div style={{ width: `${Math.min((totals[activeLayer] / selectedMetricMax) * 100, 100)}%`, height: '100%', borderRadius: 4, background: layerConfig[activeLayer].color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, flex: 1 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>Mapped Communes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sortedCommunes.map(c => {
                const value = heatValue(c, activeLayer);
                const color = heatColor(value, activeLayer);
                return (
                  <div key={c.name} onClick={() => setSelected(c.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', background: selected === c.name ? '#E0F7F5' : 'transparent', border: selected === c.name ? '1px solid #00B8A9' : '1px solid transparent' }}>
                    <MapPin size={14} color={color} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: selected === c.name ? 700 : 500, color: '#1A2B3C' }}>{c.name}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1A2B3C' }}>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedCommune && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <MapPin size={16} color={heatColor(selectedCommune[activeLayer], activeLayer)} />
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1A2B3C' }}>{selectedCommune.name}</h2>
                  <p style={{ fontSize: '0.7rem', color: '#7F8C9A' }}>{selectedCommune.province}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Total NEETs', value: selectedCommune.neets, color: '#E74C3C', max: layerConfig.neets.max },
                  { label: 'Active Mediators', value: selectedCommune.mediators, color: '#00B8A9', max: layerConfig.mediators.max },
                  { label: 'Programs Available', value: selectedCommune.programs, color: '#8E44AD', max: layerConfig.programs.max },
                ].map(({ label, value, color, max }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: '#4A5568' }}>{label}</span>
                      <span style={{ fontWeight: 700, color }}>{value}</span>
                    </div>
                    <div style={{ height: 6, background: '#F4F6F9', borderRadius: 3 }}>
                      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', background: color, borderRadius: 3 }} />
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
