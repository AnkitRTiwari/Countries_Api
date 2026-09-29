import { useEffect, useState } from "react";

export const ITEMS_PER_PAGE = 12;

// Pre-encoded so it matches the router's (encoded) location — otherwise names
// with spaces or accents never match in useViewTransitionState
export const countryPath = (name) => `/${encodeURIComponent(name)}`;

export const REGIONS = [
  { value: "", label: "All", icon: "globe" },
  { value: "Africa", label: "Africa", icon: "earth-africa" },
  { value: "Americas", label: "Americas", icon: "earth-americas" },
  { value: "Asia", label: "Asia", icon: "earth-asia" },
  { value: "Europe", label: "Europe", icon: "earth-europe" },
  { value: "Oceania", label: "Oceania", icon: "earth-oceania" },
  { value: "Antarctic", label: "Antarctic", icon: "snowflake" },
];

export const SORT_OPTIONS = [
  {
    value: "name",
    label: "Name (A–Z)",
    icon: "arrow-down-a-z",
    compare: (a, b) => a.name.common.localeCompare(b.name.common),
  },
  {
    value: "population-desc",
    label: "Population (high → low)",
    icon: "arrow-down-wide-short",
    compare: (a, b) => b.population - a.population,
  },
  {
    value: "population-asc",
    label: "Population (low → high)",
    icon: "arrow-up-short-wide",
    compare: (a, b) => a.population - b.population,
  },
  {
    value: "area-desc",
    label: "Area (largest first)",
    icon: "maximize",
    compare: (a, b) => b.area - a.area,
  },
];

let cache = null;
let pending = null;

// The dataset is ~1MB, so it's loaded as a separate chunk instead of being
// bundled into the app shell. The page renders immediately with a shimmer.
function loadCountries() {
  if (!pending) {
    pending = import("../countriesdata").then((module) => {
      cache = module.default;
      return cache;
    });
  }
  return pending;
}

export function useCountries() {
  const [countries, setCountries] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let active = true;
    loadCountries()
      .then((data) => active && setCountries(data))
      .catch((err) => {
        console.error(err);
        pending = null;
        if (active) setError(err);
      });
    return () => {
      active = false;
    };
  }, []);

  return { countries, error };
}
