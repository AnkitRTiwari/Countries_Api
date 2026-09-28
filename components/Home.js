import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CountriesList from "./CountriesList";
import SearchBar from "./SearchBar";
import SelectMenu from "./SelectMenu";
import RegionFilter from "./RegionFilter";
import { SORT_OPTIONS } from "../utilis/countries";
import { APP_TAGLINE, useDocumentTitle } from "../utilis/brand";

// The hero entrance only plays the first time Home mounts, not on every "Back"
let heroHasPlayed = false;

const Home = () => {
  useDocumentTitle();
  const [animateHero] = useState(() => !heroHasPlayed);
  useEffect(() => {
    heroHasPlayed = true;
  }, []);

  // Filters live in the URL so "Back" from a country returns to the same view
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const region = searchParams.get("region") || "";
  const sort = searchParams.get("sort") || SORT_OPTIONS[0].value;
  const page = Number(searchParams.get("page")) || 1;

  function updateParams(updates) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) =>
          value ? next.set(key, value) : next.delete(key)
        );
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  }

  const words = APP_TAGLINE.split(" ");

  return (
    <main className={`home ${animateHero ? "is-entering" : ""}`}>
      <section className="hero">
        <span className="hero-eyebrow">
          <i className="fa-solid fa-compass" /> Explore the globe
        </span>
        <h1 className="hero-title">
          {words.map((word, i) => (
            <Fragment key={i}>
              <span className="word" style={{ "--w": i }}>
                <span className={i === words.length - 1 ? "gradient-text" : undefined}>
                  {word}
                </span>
              </span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </h1>
        <p className="hero-subtitle">
          Search countries by name or capital, filter by region and dive into
          flags, populations, languages and neighbours.
        </p>
      </section>

      <div className="toolbar">
        <div className="toolbar-row">
          <SearchBar
            value={query}
            onChange={(q) => updateParams({ q: q.trim(), page: null })}
          />
          <SelectMenu
            label="Sort by"
            icon="arrow-down-wide-short"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(value) =>
              updateParams({
                sort: value === SORT_OPTIONS[0].value ? null : value,
                page: null,
              })
            }
          />
        </div>
        <RegionFilter
          value={region}
          onChange={(value) => updateParams({ region: value, page: null })}
        />
      </div>

      <CountriesList
        query={query}
        region={region}
        sort={sort}
        page={page}
        onPageChange={(p) => updateParams({ page: p > 1 ? p : null })}
        onClearFilters={() =>
          setSearchParams({}, { replace: true, preventScrollReset: true })
        }
      />
    </main>
  );
};

export default Home;
