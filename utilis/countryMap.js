import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { feature } from "topojson-client";

// Lazy-loaded by the country page's MapCard: a 3D globe that flies to the
// country, outlines it in the brand colour and shades its neighbours.

// MapLibre finds its web worker next to its own file, which doesn't survive
// bundling (and Parcel can't produce a self-contained worker for it). Load the
// exact matching worker from the npm CDN — MapLibre wraps cross-origin worker
// URLs in a same-origin blob itself.
maplibregl.setWorkerUrl(
  `https://cdn.jsdelivr.net/npm/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs`
);

const STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

const FILL_OPACITY = 0.24;
const GLOW_OPACITY = 0.55;

// World borders (Natural Earth 1:50m), keyed by ISO 3166 numeric code (ccn3) — loaded once
let atlasPromise = null;
function loadAtlas() {
  if (!atlasPromise) {
    atlasPromise = import("world-atlas/countries-50m.json").then((m) => m.default || m);
  }
  return atlasPromise;
}

// Rings crossing the antimeridian jump from +180° to -180°, which MapLibre draws
// as bands across the whole globe. Keep longitudes continuous instead (e.g. 190°).
function unwrapRing(ring) {
  let offset = 0;
  for (let i = 1; i < ring.length; i++) {
    const delta = ring[i][0] + offset - ring[i - 1][0];
    if (delta > 180) offset -= 360;
    else if (delta < -180) offset += 360;
    ring[i] = [ring[i][0] + offset, ring[i][1]];
  }
}

function shapesFor(topology, codes) {
  const wanted = new Set(codes.filter(Boolean));
  const geometries = topology.objects.countries.geometries.filter((g) => wanted.has(g.id));
  const shapes = feature(topology, { type: "GeometryCollection", geometries });
  shapes.features.forEach((f) => {
    if (!f.geometry) return;
    const polygons =
      f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    // A shape that runs to the pole (Antarctica's mainland) can't be drawn on the
    // globe without artefacts — drop it and frame the region from space instead
    const drawable = polygons.filter((rings) => !rings[0].some(([, lat]) => Math.abs(lat) >= 89));
    if (drawable.length < polygons.length) shapes.touchesPole = true;
    drawable.forEach((rings) => rings.forEach(unwrapRing));
    f.geometry = { type: "MultiPolygon", coordinates: drawable };
  });
  return shapes;
}

const boxOf = (ring) =>
  ring.reduce(
    ([w, s, e, n], [lng, lat]) => [
      Math.min(w, lng),
      Math.min(s, lat),
      Math.max(e, lng),
      Math.max(n, lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

const ringArea = (ring) =>
  Math.abs(
    ring.reduce((sum, [x1, y1], i) => {
      const [x2, y2] = ring[(i + 1) % ring.length];
      return sum + x1 * y2 - x2 * y1;
    }, 0) / 2
  );

// Frame the main landmass (ignoring far-flung territories, e.g. French Guiana for
// France) plus the capital, so island nations don't frame an atoll far from it
function mainBounds(shapes, capital) {
  const polygons = shapes.features
    .filter((f) => f.geometry)
    .flatMap(({ geometry }) =>
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates
  );
  if (!polygons.length) return null;

  const outlines = polygons.map((rings) => ({
    ring: rings[0],
    area: ringArea(rings[0]),
    box: boxOf(rings[0]),
  }));
  const main = outlines.reduce((a, b) => (b.area > a.area ? b : a));
  // Keep other big shapes, plus anything close to the main one (Sicily, NZ's
  // North Island) — but not distant territories of any size
  const [w, s, e, n] = main.box;
  const padX = (e - w) * 0.5;
  const padY = (n - s) * 0.5;
  const isNear = ([bw, bs, be, bn]) =>
    bw <= e + padX && be >= w - padX && bs <= n + padY && bn >= s - padY;
  const bounds = new maplibregl.LngLatBounds();
  outlines
    .filter((o) => o.area >= main.area * 0.25 || isNear(o.box))
    .forEach((o) => o.ring.forEach((point) => bounds.extend(point)));

  if (capital) {
    // Shift the capital by ±360° if that puts it on the same side of the antimeridian
    const middle = (bounds.getWest() + bounds.getEast()) / 2;
    let [capitalLng, capitalLat] = capital;
    while (capitalLng - middle > 180) capitalLng -= 360;
    while (capitalLng - middle < -180) capitalLng += 360;
    bounds.extend([capitalLng, capitalLat]);
  }

  // Anything spanning half the planet (antimeridian) frames badly — use the area fallback
  return bounds.getEast() - bounds.getWest() > 180 ? null : bounds;
}

// Rough zoom that shows a country of this size comfortably
const zoomForArea = (area) =>
  Math.min(7, Math.max(2, Math.log2(28000 / Math.sqrt(Math.max(area || 1, 1)))));

function brandColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    primary: css.getPropertyValue("--primary").trim() || "#4f46e5",
    accent: css.getPropertyValue("--accent").trim() || "#06b6d4",
  };
}

function createMarker(label) {
  const el = document.createElement("div");
  el.className = "map-marker";
  const pulse = document.createElement("span");
  pulse.className = "map-marker-pulse";
  const dot = document.createElement("span");
  dot.className = "map-marker-dot";
  el.append(pulse, dot);
  if (label) {
    const tag = document.createElement("span");
    tag.className = "map-marker-label";
    const star = document.createElement("i");
    star.className = "fa-solid fa-star";
    tag.append(star, document.createTextNode(` ${label}`));
    el.append(tag);
  }
  return el;
}

/**
 * @param {HTMLElement} container
 * @param {{ center: [number, number], marker: [number, number], markerLabel?: string,
 *   area: number, code?: string, neighbourCodes: string[], isDark: boolean,
 *   reduceMotion: boolean, onReady: () => void, onError: (err) => void }} options
 */
export function createCountryMap(container, options) {
  const { center, marker, markerLabel, area, code, neighbourCodes, reduceMotion } = options;
  let isDark = options.isDark;
  let shapes = null;
  let target = null;
  let landed = false;
  let destroyed = false;

  // Start with the globe turned away from the country, then fly in
  const start = { center: [center[0] - 70, center[1] * 0.4], zoom: 0.9 };
  // Used when there's no outline to frame. Polar regions read best from further
  // out on the globe (and the poles themselves can't be centred)
  const polar = Math.abs(center[1]) > 60;
  const fallbackCamera = {
    center: [center[0], Math.max(-72, Math.min(72, center[1]))],
    zoom: polar ? Math.min(zoomForArea(area), 1.8) : zoomForArea(area),
  };

  const map = new maplibregl.Map({
    container,
    style: STYLES[isDark ? "dark" : "light"],
    center: reduceMotion ? fallbackCamera.center : start.center,
    zoom: reduceMotion ? fallbackCamera.zoom : start.zoom,
    attributionControl: { compact: true },
    cooperativeGestures: true,
    maxZoom: 12,
  });

  // Pin the capital (places without one, like Antarctica, just get the outline)
  const markerEl = createMarker(markerLabel);
  if (markerLabel) {
    new maplibregl.Marker({ element: markerEl, anchor: "center" }).setLngLat(marker).addTo(map);
  }

  // Retry a failed basemap style request once (e.g. a network blip) before giving up
  let styleRetried = false;
  map.on("error", ({ error }) => {
    if (destroyed) return;
    if (!String(error?.url || "").includes("style.json")) {
      // Tile/network hiccups (AJAX errors carry a status) are expected; surface the rest
      if (!(error && "status" in error)) console.warn("[map]", error?.message || error);
      return;
    }
    if (styleRetried) {
      options.onError(error);
      return;
    }
    styleRetried = true;
    map.setStyle(STYLES[isDark ? "dark" : "light"], { diff: false });
  });

  function addLayers() {
    if (!shapes || map.getSource("country")) return;
    const colors = brandColors();
    // Keep place names above our highlight
    const firstLabel = map.getStyle().layers.find((layer) => layer.type === "symbol")?.id;

    map.addSource("neighbours", { type: "geojson", data: shapes.neighbours });
    map.addSource("country", { type: "geojson", data: shapes.country });
    map.addLayer(
      {
        id: "neighbours-fill",
        type: "fill",
        source: "neighbours",
        paint: { "fill-color": colors.accent, "fill-opacity": 0.12 },
      },
      firstLabel
    );
    map.addLayer(
      {
        id: "neighbours-line",
        type: "line",
        source: "neighbours",
        paint: {
          "line-color": colors.accent,
          "line-width": 1.2,
          "line-dasharray": [3, 2],
          "line-opacity": 0.85,
        },
      },
      firstLabel
    );
    map.addLayer(
      {
        id: "country-fill",
        type: "fill",
        source: "country",
        paint: {
          "fill-color": colors.primary,
          "fill-opacity": landed ? FILL_OPACITY : 0,
          "fill-opacity-transition": { duration: 900 },
        },
      },
      firstLabel
    );
    map.addLayer(
      {
        id: "country-glow",
        type: "line",
        source: "country",
        paint: {
          "line-color": colors.primary,
          "line-width": 10,
          "line-blur": 8,
          "line-opacity": landed ? GLOW_OPACITY : 0,
          "line-opacity-transition": { duration: 900 },
        },
      },
      firstLabel
    );
    map.addLayer(
      {
        id: "country-line",
        type: "line",
        source: "country",
        paint: { "line-color": colors.primary, "line-width": 2 },
      },
      firstLabel
    );
  }

  function land() {
    landed = true;
    markerEl.classList.add("is-landed");
    if (map.getLayer("country-fill")) {
      map.setPaintProperty("country-fill", "fill-opacity", FILL_OPACITY);
      map.setPaintProperty("country-glow", "line-opacity", GLOW_OPACITY);
    }
  }

  function flyToCountry() {
    if (reduceMotion) {
      map.jumpTo(target);
      land();
      return;
    }
    map.flyTo({ ...target, duration: 3200, curve: 1.3, essential: true });
    map.once("moveend", land);
  }

  // Runs for the first style and again after every theme switch (setStyle)
  map.on("style.load", () => {
    map.setProjection({ type: "globe" });
    try {
      map.setSky({ "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 7, 0] });
    } catch {
      // Older styles without sky support still render fine
    }
    addLayers();
  });

  const mapLoaded = new Promise((resolve) => map.once("load", resolve));
  const shapesLoaded = loadAtlas()
    .then((topology) => ({
      country: shapesFor(topology, [code]),
      neighbours: shapesFor(topology, neighbourCodes),
    }))
    // No borders for this country — the flight and marker still work
    .catch(() => null);

  // If the basemap never arrives (offline, blocked), let the card fall back
  const timeout = setTimeout(() => !destroyed && options.onError(new Error("Map timed out")), 12000);

  Promise.all([mapLoaded, shapesLoaded]).then(([, loadedShapes]) => {
    if (destroyed) return;
    clearTimeout(timeout);
    shapes = loadedShapes;
    addLayers();
    const bounds =
      shapes && !shapes.country.touchesPole && mainBounds(shapes.country, markerLabel && marker);
    // Leave room for the legend (top-left) and controls (right) on wider cards
    const wide = container.clientWidth > 640;
    const camera =
      bounds &&
      map.cameraForBounds(bounds, {
        padding: { top: 70, bottom: 40, left: wide ? 190 : 40, right: wide ? 90 : 60 },
        maxZoom: 8,
      });
    target = camera ? { center: camera.center, zoom: camera.zoom } : fallbackCamera;
    options.onReady();
    flyToCountry();
  });

  return {
    zoomIn: () => map.zoomIn(),
    zoomOut: () => map.zoomOut(),
    // Swing back out to the globe and fly in again
    replay() {
      if (!target) return;
      if (reduceMotion) return map.jumpTo(target);
      map.stop();
      map.easeTo({ ...start, duration: 900 });
      map.once("moveend", () => !destroyed && map.flyTo({ ...target, duration: 2600, curve: 1.3, essential: true }));
    },
    setTheme(nextIsDark) {
      if (nextIsDark === isDark) return;
      isDark = nextIsDark;
      // diff: false forces a full reload so style.load re-adds our layers
      map.setStyle(STYLES[isDark ? "dark" : "light"], { diff: false });
    },
    destroy() {
      destroyed = true;
      clearTimeout(timeout);
      map.remove();
    },
  };
}
