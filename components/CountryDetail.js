import { useMemo } from "react";
import "./CountryDetail.css";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import CountryDetailShimmer from "./CountryDetailShimmer";
import EmptyState from "./EmptyState";
import LazyImage from "./LazyImage";
import MapCard from "./MapCard";
import Reveal from "./Reveal";
import { REGIONS, countryPath, useCountries } from "../utilis/countries";
import { useDocumentTitle } from "../utilis/brand";

const formatNumber = (n) => n.toLocaleString("en-IN");

const StatTile = ({ icon, label, value }) => (
  <div className="stat-tile">
    <span className="stat-icon">
      <i className={`fa-solid fa-${icon}`} />
    </span>
    <div className="stat-text">
      <span className="stat-label">{label}</span>
      <span className="stat-value" title={value}>
        {value}
      </span>
    </div>
  </div>
);

const CountryDetail = () => {
  const { country: countryName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { countries, error } = useCountries();

  // Cards pass the country as router state; direct visits look it up locally
  const data = useMemo(() => {
    if (state?.name?.common === countryName) return state;
    const target = countryName.toLowerCase();
    return countries?.find(
      (c) =>
        c.name.common.toLowerCase() === target ||
        c.name.official.toLowerCase() === target
    );
  }, [state, countryName, countries]);

  // null while the dataset is still loading
  const borders = useMemo(() => {
    if (!countries) return error ? [] : null;
    return (data?.borders || [])
      .map((code) => countries.find((c) => c.cca3 === code))
      .filter(Boolean);
  }, [countries, error, data]);

  const isLoading = !data && !countries && !error;
  useDocumentTitle(data ? data.name.common : isLoading ? null : "Country not found");

  function goBack() {
    // Direct visits have no in-app history entry to go back to
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/", { viewTransition: true });
  }

  let content;
  if (isLoading) {
    content = <CountryDetailShimmer />;
  } else if (!data) {
    content = (
      <EmptyState
        icon="map-location-dot"
        title="Country not found"
        action={
          <Link to="/" className="button">
            <i className="fa-solid fa-house" /> Explore all countries
          </Link>
        }
      >
        We couldn't find "{countryName}". Check the spelling or head back to
        browse every country.
      </EmptyState>
    );
  } else {
    const name = data.name.common;
    const nativeName =
      Object.values(data.name.nativeName || {})[0]?.common || name;
    const regionIcon =
      REGIONS.find((r) => r.value === data.region)?.icon || "globe";
    const callingCode =
      data.idd?.root &&
      data.idd.root + (data.idd.suffixes?.length === 1 ? data.idd.suffixes[0] : "");
    const timezones = data.timezones || [];

    const info = [
      ["Native Name", nativeName],
      ["Sub Region", data.subregion],
      ["Top Level Domain", data.tld?.join(", ")],
      [
        "Currencies",
        Object.values(data.currencies || {})
          .map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
          .join(", "),
      ],
      ["Languages", Object.values(data.languages || {}).join(", ")],
      ["Demonym", data.demonyms?.eng?.m],
      ["Calling Code", callingCode],
      ["Drives On", data.car?.side && `${data.car.side[0].toUpperCase()}${data.car.side.slice(1)}`],
    ];

    // Keyed so the entrance animation replays when hopping between countries
    content = (
      <div key={data.cca3} className="detail-content">
        <section className="country-details">
          <LazyImage
            className="detail-flag"
            src={data.flags.svg}
            alt={data.flags.alt || `${name} flag`}
            loading="eager"
            style={{ viewTransitionName: "country-flag" }}
          />
          <div className="details-text-container">
            <div className="detail-badges">
              <span className="badge badge-primary">
                <i className={`fa-solid fa-${regionIcon}`} /> {data.region}
              </span>
              {data.unMember && <span className="badge">UN Member</span>}
              {data.landlocked && <span className="badge">Landlocked</span>}
            </div>
            <div className="name-coat">
              <div>
                <h1 className="detail-title">{name}</h1>
                {data.name.official !== name && (
                  <p className="detail-subtitle">{data.name.official}</p>
                )}
              </div>
              {data.coatOfArms?.svg && (
                <img
                  className="coat-of-arms"
                  src={data.coatOfArms.svg}
                  alt={`${name} coat of arms`}
                />
              )}
            </div>
            <div className="stat-grid">
              <StatTile icon="users" label="Population" value={formatNumber(data.population)} />
              <StatTile icon="ruler-combined" label="Area" value={`${formatNumber(data.area)} km²`} />
              <StatTile icon="landmark" label="Capital" value={data.capital?.join(", ") || "—"} />
              <StatTile
                icon="clock"
                label={timezones.length > 1 ? `Timezones (${timezones.length})` : "Timezone"}
                value={timezones[0] || "—"}
              />
            </div>
          </div>
        </section>

        <div className="detail-grid">
          <Reveal as="section" className="panel">
            <h2 className="panel-title">
              <i className="fa-solid fa-circle-info" /> Overview
            </h2>
            <dl className="info-list">
              {info.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="section" className="panel" delay={120}>
            <h2 className="panel-title">
              <i className="fa-solid fa-route" /> Border Countries
            </h2>
            {borders === null ? (
              <div className="border-countries">
                {Array.from({ length: 4 }).map((el, i) => (
                  <span key={i} className="skeleton sk-chip" />
                ))}
              </div>
            ) : borders.length ? (
              <div className="border-countries">
                {borders.map((border) => (
                  <Link
                    key={border.cca3}
                    className="border-chip"
                    to={countryPath(border.name.common)}
                    state={border}
                    viewTransition
                  >
                    <img src={border.flags.svg} alt="" loading="lazy" />
                    {border.name.common}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="panel-empty">
                <i className="fa-solid fa-water" /> {name} has no land borders.
              </p>
            )}
          </Reveal>
        </div>

        {data.latlng?.length === 2 && (
          <MapCard data={data} neighbours={borders || []} />
        )}
      </div>
    );
  }

  return (
    <main className="country-page">
      <div className="country-details-container">
        <button type="button" className="back-button" onClick={goBack}>
          <i className="fa-solid fa-arrow-left" /> Back
        </button>
        {content}
      </div>
    </main>
  );
};

export default CountryDetail;
