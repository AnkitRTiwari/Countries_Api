import { useContext, useEffect, useState } from "react";
import CountriesList from "./CountriesList";
import SearchBar from "./SearchBar";
import SelectMenu from "./SelectMenu";
import { ThemeContext } from "../contexts/Theme";
import useWindow from "../utilis/useWindow";

const Home = () => {
  const [entry, setEntry] = useState("");
  const [isDark] = useContext(ThemeContext);
  const [dim] = useWindow();
  return (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="search-filter-container">
        {/* this is called "LIFTING   UP  THE STATE" */}
        <SearchBar setEntry={setEntry} />
        <SelectMenu setEntry={setEntry} />
      </div>
      {/* <h1 style={{ textAlign: "center" }}>{`${dim.width} X ${dim.height} `}</h1> */}
      <CountriesList entry={entry} />
    </main>
  );
};

export default Home;
