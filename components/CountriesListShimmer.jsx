import React from "react";

import "./CountriesListShimmer.css";
import { ITEMS_PER_PAGE } from "../utilis/countries";

export default function CountriesListShimmer() {
  return (
    <section className="results" aria-busy="true" aria-label="Loading countries">
      <div className="skeleton sk-meta"></div>
      <div className="countries-container">
        {Array.from({ length: ITEMS_PER_PAGE }).map((el, i) => {
          return (
            <div key={i} className="country-card shimmer-card" style={{ "--i": i }}>
              <div className="card-flag skeleton"></div>
              <div className="card-body">
                <div className="skeleton sk-title"></div>
                <div className="sk-row">
                  <div className="skeleton sk-label"></div>
                  <div className="skeleton sk-value"></div>
                </div>
                <div className="sk-row">
                  <div className="skeleton sk-label"></div>
                  <div className="skeleton sk-value short"></div>
                </div>
                <div className="sk-row">
                  <div className="skeleton sk-label"></div>
                  <div className="skeleton sk-value"></div>
                </div>
                <div className="skeleton sk-cta"></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
