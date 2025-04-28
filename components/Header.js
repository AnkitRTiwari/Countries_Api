import { useContext } from "react";
import { ThemeContext } from "../contexts/Theme";

const Header = () => {
  const [isDark, setIsDark] = useContext(ThemeContext);
  return (
    <header className={`header-container ${isDark ? "dark" : ""} `}>
      <div className="header-content">
        <h2 className="title">
          <a href="/">Where in the world?</a>
        </h2>
        <p
          className="theme-changer"
          onClick={() => {
            console.log("clicked");
            setIsDark(!isDark);
            localStorage.setItem("isDarkMode", !isDark);
          }}
        >
          <i className={`fa-solid fa-${!isDark ? "moon" : "sun"}`} />
          &nbsp;&nbsp;{!isDark ? "Dark" : "Light"} Mode
        </p>
      </div>
    </header>
  );
};

export default Header;
