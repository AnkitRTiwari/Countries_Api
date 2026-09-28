import { createContext, useLayoutEffect, useState } from "react";

export const ThemeContext = createContext();

// Keep in sync with the inline script in index.html
export const THEME_STORAGE_KEY = "wanderlust-theme";

export function ThemeProvider({ children }) {
  // index.html sets data-theme before first paint (saved choice or OS preference)
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === "dark"
  );

  // Layout effect so the attribute flips inside the theme view transition's DOM update
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <ThemeContext.Provider value={[isDark, setIsDark]}>
      {children}
    </ThemeContext.Provider>
  );
}
