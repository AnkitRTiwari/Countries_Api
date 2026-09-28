import React from "react";

import "./CountryDetailShimmer.css";

export default function CountryDetailShimmer() {
  return (
    <div className="detail-shimmer" aria-busy="true" aria-label="Loading country">
      <section className="country-details">
        <div className="detail-flag skeleton"></div>
        <div className="details-text-container">
          <div className="detail-badges">
            <span className="skeleton sk-badge"></span>
            <span className="skeleton sk-badge short"></span>
          </div>
          <div className="skeleton sk-title"></div>
          <div className="skeleton sk-subtitle"></div>
          <div className="stat-grid">
            {Array.from({ length: 4 }).map((el, i) => (
              <div key={i} className="skeleton sk-tile"></div>
            ))}
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel">
          <div className="skeleton sk-panel-title"></div>
          <div className="info-list">
            {Array.from({ length: 8 }).map((el, i) => (
              <div key={i}>
                <div className="skeleton sk-dt"></div>
                <div className="skeleton sk-dd"></div>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="skeleton sk-panel-title"></div>
          <div className="border-countries">
            {Array.from({ length: 4 }).map((el, i) => (
              <span key={i} className="skeleton sk-chip"></span>
            ))}
          </div>
        </section>
      </div>

      <div className="map-card">
        <div className="map-card-header">
          <div className="skeleton sk-panel-title"></div>
        </div>
        <div className="map-frame skeleton"></div>
      </div>
    </div>
  );
}
