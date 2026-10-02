"use client";

import { useId, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import outline from "@/lib/morocco-outline.json";

export type MapPoint = {
  name: string;
  lat: number;
  lng: number;
  value: number;
};
const cities = [
  { name: "Tanger", lat: 35.76, lng: -5.8 },
  { name: "Oujda", lat: 34.68, lng: -1.91 },
  { name: "Rabat", lat: 34.02, lng: -6.84 },
  { name: "Fès", lat: 34.03, lng: -5.0 },
  { name: "Casablanca", lat: 33.57, lng: -7.59 },
  { name: "Marrakech", lat: 31.63, lng: -8.0 },
  { name: "Agadir", lat: 30.43, lng: -9.6 },
  { name: "Guelmim", lat: 28.99, lng: -10.06 },
  { name: "Laâyoune", lat: 27.15, lng: -13.2 },
  { name: "Dakhla", lat: 23.71, lng: -15.93 },
];
function project(lat: number, lng: number) {
  return { x: 40 + (lng + 17.5) * 38, y: 30 + (36 - lat) * 33 };
}
const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

/** Self-hosted country-wide coverage overview, with an optional Google Maps view. */
export default function MoroccoMap({
  points = [],
  height = 430,
  onSelect,
  selected,
}: {
  points?: MapPoint[];
  height?: number;
  onSelect?: (name: string) => void;
  selected?: string | null;
}) {
  const [scope, setScope] = useState<"national" | "regional">("national");
  const [provider, setProvider] = useState<"overview" | "google">("overview");
  const [focused, setFocused] = useState<string | null>(null);
  const uid = useId().replaceAll(":", "");
  const max = Math.max(1, ...points.map((point) => point.value));
  const center = scope === "national" ? "28,-10" : "30.1,-9.1";
  const zoom = scope === "national" ? (height < 350 ? "4" : "5") : "8";
  const mapUrl = mapsKey
    ? `https://www.google.com/maps/embed/v1/view?${new URLSearchParams({ key: mapsKey, center, zoom, region: "ma", language: "fr", maptype: "roadmap" })}`
    : null;
  const selectedPoint = points.find(
    (point) => point.name === (selected ?? focused),
  );
  const viewBox = scope === "national" ? "0 0 720 560" : "310 189 160 104";
  const regionScale = scope === "regional" ? 0.29 : 1;
  return (
    <div className="national-map">
      <div className="map-toolbar">
        <div
          className="filter-tabs"
          role="group"
          aria-label="Étendue de la carte"
        >
          <button
            className={scope === "national" ? "active" : ""}
            aria-pressed={scope === "national"}
            onClick={() => setScope("national")}
          >
            Maroc entier
          </button>
          <button
            className={scope === "regional" ? "active" : ""}
            aria-pressed={scope === "regional"}
            onClick={() => setScope("regional")}
          >
            Souss-Massa
          </button>
        </div>
        {mapsKey && (
          <div className="filter-tabs" role="group" aria-label="Fond de carte">
            <button
              className={provider === "overview" ? "active" : ""}
              aria-pressed={provider === "overview"}
              onClick={() => setProvider("overview")}
            >
              Couverture
            </button>
            <button
              className={provider === "google" ? "active" : ""}
              aria-pressed={provider === "google"}
              onClick={() => setProvider("google")}
            >
              Google Maps
            </button>
          </div>
        )}
      </div>
      <div className="map-body" style={{ height }}>
        {provider === "google" && mapUrl ? (
          <iframe
            title={`Google Maps · ${scope === "national" ? "Maroc entier" : "Souss-Massa"}`}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <svg
            viewBox={viewBox}
            role="group"
            aria-label="Aperçu géographique du Maroc, de Tanger à Dakhla, avec les points de couverture Souss-Massa"
          >
            <defs>
              <pattern
                id={`grid-${uid}`}
                width="35"
                height="35"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 35 0 L 0 0 0 35"
                  fill="none"
                  stroke="#dce5e0"
                  strokeWidth=".6"
                />
              </pattern>
              <radialGradient id={`heat-${uid}`}>
                <stop offset="0" stopColor="#dc9963" stopOpacity=".55" />
                <stop offset="1" stopColor="#dc9963" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="720"
              height="560"
              fill={`url(#grid-${uid})`}
            />
            {outline.paths.map((path, index) => (
              <path
                key={index}
                d={path}
                fill="#d2e3d7"
                stroke="#89ad99"
                strokeWidth={scope === "national" ? 1.3 : 0.5}
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}
            {scope === "national" && (
              <>
                <text
                  x="135"
                  y="200"
                  fill="#8ba9a1"
                  fontSize="13"
                  letterSpacing="2"
                  transform="rotate(-42 135 200)"
                >
                  OCÉAN ATLANTIQUE
                </text>
                <text
                  x="440"
                  y="420"
                  fill="#95ad9d"
                  fontSize="11"
                  letterSpacing="2"
                >
                  APERÇU NATIONAL
                </text>
                {cities.map((city) => {
                  const { x, y } = project(city.lat, city.lng);
                  return (
                    <g key={city.name}>
                      <circle cx={x} cy={y} r="2.5" fill="#67877b" />
                      <text x={x + 8} y={y - 4} fontSize="11" fill="#49665d">
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
            {points.map((point) => {
              const { x, y } = project(point.lat, point.lng);
              const active = (selected ?? focused) === point.name;
              const radius = (12 + (point.value / max) * 24) * regionScale;
              return (
                <g
                  className="map-point"
                  key={point.name}
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.name} : ${point.value}, données de démonstration`}
                  pointerEvents="bounding-box"
                  onClick={() => {
                    setFocused(point.name);
                    onSelect?.(point.name);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setFocused(point.name);
                      onSelect?.(point.name);
                    }
                  }}
                >
                  <circle cx={x} cy={y} r={radius} fill={`url(#heat-${uid})`} />
                  <circle
                    cx={x}
                    cy={y}
                    r={(active ? 5 : 3.5) * regionScale}
                    fill={active ? "#dd8250" : "#087e72"}
                    stroke="#fff"
                    strokeWidth={1.2 * regionScale}
                  />
                  <title>{`${point.name} · ${point.value}`}</title>
                  {scope === "regional" &&
                    (active ||
                      ["Agadir", "Taroudant", "Tiznit", "Tata"].includes(
                        point.name,
                      )) && (
                      <text
                        x={x + 3}
                        y={y - 2}
                        style={{ fontSize: 4, strokeWidth: 1 }}
                      >
                        {point.name}
                      </text>
                    )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
      {selectedPoint && provider === "overview" && (
        <div className="map-selection" role="status">
          <MapPin
            size={12}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 6,
            }}
          />
          {selectedPoint.name} · {selectedPoint.value} dans la couche
          sélectionnée
        </div>
      )}
      <div className="map-attribution">
        <span>
          {provider === "google"
            ? "Google Maps · région MA"
            : "Aperçu géographique · Natural Earth · données démo"}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(scope === "national" ? "Morocco" : "Souss-Massa Morocco")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir Google Maps{" "}
          <ExternalLink
            size={10}
            style={{ display: "inline", verticalAlign: "middle" }}
          />
        </a>
      </div>
    </div>
  );
}
