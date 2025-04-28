import React, { useEffect, useState } from "react";
// import countriesdata from "../countriesdata";
import CountriesCard from "./CountriesCard";

const CountriesList = ({ entry }) => {
  const [countriesdata, setCountriesdata] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((data) => data.json())
      .then((data) => {
        setCountriesdata(data);
      });
  }, []);

  return (
    <>
      <div className="countries-container">
        {countriesdata
          .filter(
            (country) =>
              country.name.common.toLowerCase().includes(entry) ||
              country.region.toLowerCase().includes(entry)
          )
          .map((country) => {
            return (
              <CountriesCard
                key={country.name.common}
                name={country.name.common}
                flag={country.flags.svg}
                population={country.population}
                region={country.region}
                capital={country.capital?.[0]}
                data={country}
              />
            );
          })}
      </div>
    </>
  );
};
// console.log(array);

export default CountriesList;
