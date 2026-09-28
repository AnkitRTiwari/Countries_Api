import React, { useMemo, useRef } from "react";
import CountriesCard from "./CountriesCard";
import CountriesListShimmer from "./CountriesListShimmer";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE, SORT_OPTIONS, useCountries } from "../utilis/countries";

const matchesQuery = (country, q) =>
  [
    country.name.common,
    country.name.official,
    country.region,
    country.subregion,
    ...(country.capital || []),
  ].some((value) => value?.toLowerCase().includes(q));

const CountriesList = ({ query, region, sort, page, onPageChange, onClearFilters }) => {
  const { countries, error } = useCountries();
  const resultsRef = useRef(null);

  const filtered = useMemo(() => {
    if (!countries) return [];
    const q = query.trim().toLowerCase();
    const { compare } =
      SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];
    return countries
      .filter((country) => !region || country.region === region)
      .filter((country) => !q || matchesQuery(country, q))
      .sort(compare);
  }, [countries, query, region, sort]);

  if (error) {
    return (
      <EmptyState icon="triangle-exclamation" title="Couldn't load countries">
        Please refresh the page to try again.
      </EmptyState>
    );
  }

  if (!countries) return <CountriesListShimmer />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  function changePage(p) {
    onPageChange(p);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="results" ref={resultsRef}>
      {filtered.length === 0 ? (
        <EmptyState
          icon="map-location-dot"
          title="No countries found"
          action={
            <button type="button" className="button" onClick={onClearFilters}>
              <i className="fa-solid fa-rotate-left" /> Clear filters
            </button>
          }
        >
          Try a different search term or region.
        </EmptyState>
      ) : (
        <>
          <p className="results-meta">
            Showing{" "}
            <b>
              {start + 1}–{start + paginated.length}
            </b>{" "}
            of <b>{filtered.length}</b>{" "}
            {filtered.length === 1 ? "country" : "countries"}
          </p>
          <div className="countries-container">
            {paginated.map((country, index) => (
              <CountriesCard
                key={country.cca3}
                index={index}
                name={country.name.common}
                flag={country.flags.svg}
                population={country.population}
                region={country.region}
                capital={country.capital?.[0]}
                area={country.area}
                data={country}
              />
            ))}
          </div>
        </>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}
      />
    </section>
  );
};

export default CountriesList;
