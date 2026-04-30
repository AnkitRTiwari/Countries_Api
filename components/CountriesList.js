import React, { useEffect, useState } from "react";
import CountriesCard from "./CountriesCard";
import CountriesListShimmer from "./CountriesListShimmer";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 12;

const CountriesList = ({ entry }) => {
  const [countriesdata, setCountriesdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true")
      .then((data) => data.json())
      .then((data) => {
        console.log(data)
        setCountriesdata(data);
      });
  }, []);

  // Reset to page 1 whenever search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entry]);

  const filtered = countriesdata.filter(
    (country) =>
      country.name.common.toLowerCase().includes(entry) ||
      country.region.toLowerCase().includes(entry)
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (countriesdata.length === 0) return <CountriesListShimmer />;

  return (
    <>
      <div className="countries-container">
        {paginated.map((country) => (
          <CountriesCard
            key={country.name.common}
            name={country.name.common}
            flag={country.flags.svg}
            population={country.population}
            region={country.region}
            capital={country.capital?.[0]}
            data={country}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default CountriesList;
