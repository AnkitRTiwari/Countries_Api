import { Link, useViewTransitionState } from "react-router";
import LazyImage from "./LazyImage";
import useReveal from "../utilis/useReveal";
import { countryPath } from "../utilis/countries";

const CountriesCard = ({ index, name, flag, population, region, capital, area, data }) => {
  const to = countryPath(name);
  const [ref, visible] = useReveal();
  // Only the clicked card's flag is named, so it morphs into the detail page flag
  const isTransitioning = useViewTransitionState(to);

  return (
    <Link
      ref={ref}
      className={`country-card reveal ${visible ? "is-visible" : ""}`}
      to={to}
      state={data}
      viewTransition
      style={{ "--reveal-delay": `${(index % 4) * 80}ms` }}
    >
      <LazyImage
        className="card-flag"
        src={flag}
        alt={name + " Flag"}
        style={{ viewTransitionName: isTransitioning ? "country-flag" : undefined }}
      >
        <span className="card-region">{region}</span>
      </LazyImage>
      <div className="card-body">
        <h3 className="card-title" title={name}>
          {name}
        </h3>
        <ul className="card-stats">
          <li>
            <i className="fa-solid fa-users" />
            <span>Population</span>
            <b>{population.toLocaleString("en-IN")}</b>
          </li>
          <li>
            <i className="fa-solid fa-landmark" />
            <span>Capital</span>
            <b title={capital}>{capital || "—"}</b>
          </li>
          <li>
            <i className="fa-solid fa-ruler-combined" />
            <span>Area</span>
            <b>{area.toLocaleString("en-IN")} km²</b>
          </li>
        </ul>
        <span className="card-cta">
          View details <i className="fa-solid fa-arrow-right" />
        </span>
      </div>
    </Link>
  );
};

export default CountriesCard;
