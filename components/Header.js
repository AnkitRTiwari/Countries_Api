import { useContext } from "react";
import { Link } from "react-router";
import { THEME_STORAGE_KEY, ThemeContext } from "../contexts/Theme";
import { APP_NAME } from "../utilis/brand";
import { switchThemeWithTransition } from "../utilis/themeTransition";

const Header = () => {
  const [isDark, setIsDark] = useContext(ThemeContext);
  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="brand" viewTransition>
          <span className="brand-logo">
            <i className="fa-solid fa-earth-americas" />
          </span>
          <span className="title">{APP_NAME}</span>
        </Link>
        <button
          type="button"
          className="theme-changer"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          onClick={(e) =>
            switchThemeWithTransition(e, () => {
              setIsDark(!isDark);
              localStorage.setItem(THEME_STORAGE_KEY, isDark ? "light" : "dark");
            })
          }
        >
          {/* Keyed so the new icon remounts and spins in */}
          <i
            key={isDark ? "sun" : "moon"}
            className={`fa-solid fa-${isDark ? "sun" : "moon"} theme-icon`}
          />
          <span className="theme-changer-label">
            {isDark ? "Light" : "Dark"} Mode
          </span>
        </button>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  );
};

export default Header;
