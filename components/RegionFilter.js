import { REGIONS } from "../utilis/countries";

const RegionFilter = ({ value, onChange }) => {
  return (
    <div className="region-filter" role="group" aria-label="Filter by region">
      {REGIONS.map((region) => {
        const active = region.value === value;
        return (
          <button
            key={region.label}
            type="button"
            className={`chip ${active ? "active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(region.value)}
          >
            <i className={`fa-solid fa-${region.icon}`} />
            {region.label}
          </button>
        );
      })}
    </div>
  );
};

export default RegionFilter;
