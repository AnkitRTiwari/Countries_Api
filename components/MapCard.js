import { useContext, useEffect, useRef, useState } from "react";
import "./MapCard.css";
import { ThemeContext } from "../contexts/Theme";
import useReveal from "../utilis/useReveal";

const formatCoord = (value, positive, negative) =>
  `${Math.abs(value).toFixed(1)}°${value >= 0 ? positive : negative}`;

// Interactive globe (MapLibre, lazy-loaded) with the plain OpenStreetMap embed as a fallback
const MapCard = ({ data, neighbours }) => {
  const [isDark] = useContext(ThemeContext);
  const [revealRef, visible] = useReveal();
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;
  const [status, setStatus] = useState("loading"); // loading | ready | fallback
  const [isFullscreen, setIsFullscreen] = useState(false);

  const name = data.name.common;
  const [lat, lng] = data.latlng;
  const capital = data.capital?.[0];
  const [pinLat, pinLng] =
    data.capitalInfo?.latlng?.length === 2 ? data.capitalInfo.latlng : data.latlng;

  // Only build the map once the card scrolls into view
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let controller = null;
    import("../utilis/countryMap")
      .then(({ createCountryMap }) => {
        if (cancelled) return;
        controller = createCountryMap(canvasRef.current, {
          center: [lng, lat],
          marker: [pinLng, pinLat],
          markerLabel: capital,
          area: data.area,
          code: data.ccn3,
          neighbourCodes: neighbours.map((n) => n.ccn3),
          isDark: isDarkRef.current,
          reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onReady: () => !cancelled && setStatus("ready"),
          onError: () => !cancelled && setStatus("fallback"),
        });
        mapRef.current = controller;
      })
      .catch((err) => {
        // e.g. WebGL unavailable or the map chunk failed to load
        console.error(err);
        if (!cancelled) setStatus("fallback");
      });
    return () => {
      cancelled = true;
      controller?.destroy();
      mapRef.current = null;
    };
  }, [visible]);

  useEffect(() => {
    mapRef.current?.setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else frameRef.current?.requestFullscreen?.();
  }

  return (
    <section ref={revealRef} className={`map-card reveal ${visible ? "is-visible" : ""}`}>
      <div className="map-card-header">
        <div>
          <h2 className="panel-title">
            <i className="fa-solid fa-location-dot" /> Location on Map
          </h2>
          <p className="map-card-subtitle">
            {capital && <>{capital} · </>}
            {formatCoord(pinLat, "N", "S")}, {formatCoord(pinLng, "E", "W")}
          </p>
        </div>
        <div className="map-links">
          {data.maps?.googleMaps && (
            <a
              className="map-open-link"
              href={data.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          )}
          <a
            className="map-open-link"
            href={
              data.maps?.openStreetMaps ||
              `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=5/${lat}/${lng}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
        </div>
      </div>

      <div
        ref={frameRef}
        className={`map-frame ${status === "loading" ? "skeleton" : `is-${status}`}`}
      >
        <div ref={canvasRef} className="map-canvas" />

        {status === "fallback" && (
          <iframe
            title={`${name} location`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 10},${lat - 10},${lng + 10},${lat + 10}&layer=mapnik&marker=${lat},${lng}`}
            className="map-iframe"
            loading="lazy"
          />
        )}

        {status === "ready" && (
          <>
            <div className="map-legend" aria-hidden="true">
              <span>
                <i className="legend-swatch is-country" /> {name}
              </span>
              {neighbours.length > 0 && (
                <span>
                  <i className="legend-swatch is-neighbour" /> Neighbours
                </span>
              )}
              {capital && (
                <span>
                  <i className="legend-dot" /> Capital
                </span>
              )}
            </div>

            <div className="map-controls">
              <button
                type="button"
                className="map-control"
                aria-label="Zoom in"
                onClick={() => mapRef.current?.zoomIn()}
              >
                <i className="fa-solid fa-plus" />
              </button>
              <button
                type="button"
                className="map-control"
                aria-label="Zoom out"
                onClick={() => mapRef.current?.zoomOut()}
              >
                <i className="fa-solid fa-minus" />
              </button>
              <button
                type="button"
                className="map-control"
                aria-label={`Fly to ${name} again`}
                title="Replay flight"
                onClick={() => mapRef.current?.replay()}
              >
                <i className="fa-solid fa-plane-departure" />
              </button>
              <button
                type="button"
                className="map-control"
                aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
                onClick={toggleFullscreen}
              >
                <i className={`fa-solid fa-${isFullscreen ? "compress" : "expand"}`} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MapCard;
