"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource, Marker } from "maplibre-gl";
import type { Feature, Polygon, FeatureCollection, Point } from "geojson";
import {
  ExternalLink,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import geographicBoundary from "@/lib/morocco-boundary.json";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useSimulatedState } from "@/lib/simulated-backend";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

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
  { name: "Fès", lat: 34.03, lng: -5 },
  { name: "Casablanca", lat: 33.57, lng: -7.59 },
  { name: "Marrakech", lat: 31.63, lng: -8 },
  { name: "Agadir", lat: 30.43, lng: -9.6 },
  { name: "Guelmim", lat: 28.99, lng: -10.06 },
  { name: "Laâyoune", lat: 27.15, lng: -13.2 },
  { name: "Dakhla", lat: 23.71, lng: -15.93 },
];
// Geographic longitude/latitude perimeter from Natural Earth 1:50m.
// Source and edge-dissolve procedure are documented in docs/map-data-provenance.md.
const country = geographicBoundary as Feature<Polygon>;
function pointCollection(points: MapPoint[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: points.map((point) => ({
      type: "Feature",
      properties: { name: point.name, value: point.value },
      geometry: { type: "Point", coordinates: [point.lng, point.lat] },
    })),
  };
}
const nationalBounds: [number, number, number, number] = [
  -17.25, 20.55, -1.05, 36.05,
];
const regionalBounds: [number, number, number, number] = [
  -10.65, 28.3, -6.55, 31.5,
];

export default function MoroccoMap({
  points = [],
  height = 430,
  onSelect,
  selected,
  locale = "en",
}: {
  points?: MapPoint[];
  height?: number;
  onSelect?: (name: string) => void;
  selected?: string | null;
  locale?: "en" | "fr";
}) {
  const french = locale === "fr";
  const text = french ? {
    extent: "Étendue de la carte", national: "Maroc entier", regional: "Souss-Massa", heat: "Chaleur", radius: "Rayon", intensity: "Intensité", showHeat: "Afficher la chaleur", reset: "Réinitialiser", region: "Carte interactive du Maroc de Tanger à Dakhla", loading: "Chargement de la carte…", basemapLoading: "Chargement du fond satellite…", tileUnavailable: "Fond satellite indisponible · couverture et données toujours visibles", tilePartial: "Certaines tuiles satellite sont indisponibles · données visibles", webgl: "La carte interactive nécessite WebGL. Les données de couverture restent disponibles ci-dessous.", engine: "Le moteur de carte n’a pas pu être chargé. Rechargez la page pour réessayer.", demo: "données de démonstration", selection: "dans la couche sélectionnée", low: "Faible", high: "Forte densité · données démo", points: "Communes et valeurs de couverture", attribution: "MapLibre · couverture nationale · Natural Earth", open: "Ouvrir Google Maps",
  } : {
    extent: "Map extent", national: "Whole Morocco", regional: "Souss-Massa", heat: "Heat controls", radius: "Radius", intensity: "Intensity", showHeat: "Show heat layer", reset: "Reset heat controls", region: "Interactive map of Morocco from Tanger to Dakhla", loading: "Loading the map…", basemapLoading: "Loading satellite basemap…", tileUnavailable: "Satellite basemap unavailable · coverage data remain visible", tilePartial: "Some satellite tiles are unavailable · coverage data remain visible", webgl: "The interactive map needs WebGL. Coverage values remain available below.", engine: "The map engine could not load. Reload the page to retry.", demo: "demonstration data", selection: "in the selected layer", low: "Low", high: "High density · demo data", points: "Communes and coverage values", attribution: "MapLibre · national coverage · Natural Earth", open: "Open Google Maps",
  };
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [tileError, setTileError] = useState(false);
  const [basemapReady, setBasemapReady] = useState(false);
  const [scope, setScope] = useState<"national" | "regional">("national");
  const scopeRef = useRef<"national" | "regional">("national");
  const [focused, setFocused] = useState<string | null>(null);
  const [settings, setSettings] = useSimulatedState("map.heat-settings", {
    radius: 30,
    intensity: 1,
    visible: true,
  });
  const chosen = points.find((point) => point.name === (selected ?? focused));

  useEffect(() => {
    let disposed = false;
    let rasterSucceeded = false;
    let rasterRequested = false;
    let resize: ResizeObserver | undefined;
    import("maplibre-gl")
      .then((maplibre) => {
        if (disposed || !container.current) return;
        try {
          maplibre.setWorkerUrl("/vendor/maplibre/maplibre-gl-worker.mjs");
          const map = new maplibre.Map({
            container: container.current,
            bounds: nationalBounds,
            fitBoundsOptions: { padding: 24 },
            minZoom: 2,
            renderWorldCopies: false,
            maxZoom: 15,
            attributionControl: false,
            style: {
              version: 8,
              sources: {
                satellite: {
                  type: "raster",
                  tiles: [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                  ],
                  tileSize: 256,
                  attribution:
                    "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
                },
                country: { type: "geojson", data: country },
                coverage: { type: "geojson", data: pointCollection([]) },
              },
              layers: [
                {
                  id: "satellite",
                  type: "raster",
                  source: "satellite",
                  paint: { "raster-saturation": -0.2, "raster-opacity": 0.94 },
                },
                {
                  id: "country-fill",
                  type: "fill",
                  source: "country",
                  paint: { "fill-color": "#cbece0", "fill-opacity": 0.1 },
                },
                {
                  id: "country-outline",
                  type: "line",
                  source: "country",
                  paint: { "line-color": "#008477", "line-width": 2 },
                },
                {
                  id: "coverage-heat",
                  type: "heatmap",
                  source: "coverage",
                  paint: {
                    "heatmap-weight": [
                      "interpolate",
                      ["linear"],
                      ["get", "value"],
                      0,
                      0,
                      800,
                      1,
                    ],
                    "heatmap-intensity": 1,
                    "heatmap-radius": 30,
                    "heatmap-opacity": 0.8,
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(0,132,119,0)",
                      0.2,
                      "rgba(0,160,144,.5)",
                      0.5,
                      "#6edaab",
                      0.8,
                      "#f5c553",
                      1,
                      "#ea764d",
                    ],
                  },
                },
              ],
            },
          });
          mapRef.current = map;
          map.addControl(
            new maplibre.NavigationControl({ showCompass: false }),
            "top-right",
          );
          map.addControl(
            new maplibre.AttributionControl({ compact: true }),
            "bottom-right",
          );
        map.on("style.load", () => {
            if (!disposed) setReady(true);
          });
          map.on("error", (event) => {
            const sourceId = (event as unknown as { sourceId?: string }).sourceId;
            if (!disposed && (sourceId === "satellite" || event.error?.message?.includes("/tile/"))) setTileError(true);
          });
          map.on("sourcedataloading", (event) => { if (event.sourceId === "satellite" && event.tile) rasterRequested = true; });
          map.on("sourcedata", (event) => {
            if (
              !disposed &&
              event.sourceId === "satellite" &&
              event.tile &&
              (event.tile as unknown as { state: string }).state === "loaded"
            ) { rasterSucceeded = true; setBasemapReady(true); }
            if (!disposed && event.sourceId === "satellite" && event.sourceDataType === "idle" && rasterRequested && !rasterSucceeded) setTileError(true);
          });
          cities.forEach((city) => {
            const label = document.createElement("span");
            label.className = "map-city-label";
            label.textContent = city.name;
            new maplibre.Marker({ element: label, anchor: "bottom-left" })
              .setLngLat([city.lng, city.lat])
              .addTo(map);
          });
          resize = new ResizeObserver(() => { map.resize(); map.fitBounds(scopeRef.current === "national" ? nationalBounds : regionalBounds, { padding: 24, duration: 0 }); });
          resize.observe(container.current);
        } catch {
          setError(text.webgl);
        }
      })
      .catch(() => {
        if (!disposed)
          setError(text.engine);
      });
    return () => {
      disposed = true;
      resize?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [text.engine, text.webgl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("coverage") as GeoJSONSource).setData(
      pointCollection(points),
    );
    let disposed = false;
    import("maplibre-gl").then((maplibre) => {
      if (disposed || mapRef.current !== map) return;
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      points.forEach((point) => {
        const button = document.createElement("button");
        button.className =
          "map-value-marker" +
          ((selected ?? focused) === point.name ? " is-selected" : "");
        button.type = "button";
        button.setAttribute(
          "aria-label",
          point.name + " : " + point.value + ", " + text.demo,
        );
        button.setAttribute(
          "aria-pressed",
          String((selected ?? focused) === point.name),
        );
        button.title = point.name + " · " + point.value;
        button.addEventListener("click", () => {
          setFocused(point.name);
          onSelect?.(point.name);
        });
        markers.current.push(
          new maplibre.Marker({ element: button })
            .setLngLat([point.lng, point.lat])
            .addTo(map),
        );
      });
    });
    return () => {
      disposed = true;
    };
  }, [ready, points, selected, focused, onSelect, text.demo]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    scopeRef.current = scope;
    map.fitBounds(scope === "national" ? nationalBounds : regionalBounds, {
      padding: height < 350 ? 22 : 32,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 450,
    });
  }, [scope, ready, height]);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    map.setPaintProperty("coverage-heat", "heatmap-radius", settings.radius);
    map.setPaintProperty(
      "coverage-heat",
      "heatmap-intensity",
      settings.intensity,
    );
    map.setLayoutProperty(
      "coverage-heat",
      "visibility",
      settings.visible ? "visible" : "none",
    );
  }, [settings, ready]);

  return (
    <div className="national-map interactive-national-map" lang={locale} data-basemap={tileError ? (basemapReady ? "partial" : "unavailable") : basemapReady ? "ready" : "loading"}>
      <div className="map-toolbar">
        <ToggleGroup
          type="single"
          value={scope}
          onValueChange={(value) => {
            if (value) setScope(value as typeof scope);
          }}
          aria-label={text.extent}
        >
          <ToggleGroupItem value="national">{text.national}</ToggleGroupItem>
          <ToggleGroupItem value="regional">{text.regional}</ToggleGroupItem>
        </ToggleGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal data-icon="inline-start" />
              {text.heat}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="heat-radius">
                  {text.radius} · {settings.radius} px
                </FieldLabel>
                <input
                  id="heat-radius"
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={settings.radius}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      radius: Number(event.target.value),
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="heat-intensity">
                  {text.intensity} · {settings.intensity.toFixed(1)}
                </FieldLabel>
                <input
                  id="heat-intensity"
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.2}
                  value={settings.intensity}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      intensity: Number(event.target.value),
                    }))
                  }
                />
              </Field>
              <Field>
                <label className="map-heat-toggle">
                  <input
                    type="checkbox"
                    checked={settings.visible}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        visible: event.target.checked,
                      }))
                    }
                  />
                  {text.showHeat}
                </label>
              </Field>
              <Button
                variant="outline"
                onClick={() =>
                  setSettings({ radius: 30, intensity: 1, visible: true })
                }
              >
                <RotateCcw data-icon="inline-start" />
                {text.reset}
              </Button>
            </FieldGroup>
          </PopoverContent>
        </Popover>
      </div>
      <div className="map-body maplibre-body" style={{ height }}>
        <div
          ref={container}
          className="live-map-container"
          role="region"
          aria-label={text.region}
        />
        {!ready && !error && (
          <div className="map-loading" role="status">
            {text.loading}
          </div>
        )}
        {ready && !basemapReady && !tileError && !error && <div className="map-basemap-loading" role="status">{text.basemapLoading}</div>}
        {error && (
          <div className="map-load-error" role="status">
            {error}
          </div>
        )}
        {tileError && (
          <div className="map-tile-notice" role="status">
            {basemapReady ? text.tilePartial : text.tileUnavailable}
          </div>
        )}
      </div>
      {chosen && (
        <div className="map-selection" role="status">
          <MapPin size={12} />
          {chosen.name} · {chosen.value} {text.selection}
        </div>
      )}
      <div className="map-legend">
        <span className="heat-scale" />
        <span>{text.low}</span>
        <span>{text.high}</span>
      </div>
      <div
        className="map-point-list"
        aria-label={text.points}
      >
        {points.map((point) => (
          <button
            key={point.name}
            className={(selected ?? focused) === point.name ? "active" : ""}
            onClick={() => {
              setFocused(point.name);
              onSelect?.(point.name);
              mapRef.current?.easeTo({
                center: [point.lng, point.lat],
                duration: 300,
              });
            }}
          >
            {point.name}
            <b>{point.value}</b>
          </button>
        ))}
      </div>
      <div className="map-attribution">
        <span>{text.attribution}</span>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Morocco"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.open} <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
