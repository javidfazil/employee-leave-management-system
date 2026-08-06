import { useEffect, useMemo, useState } from "react";

import ThemeContext from "./themeContext.js";

const THEME_STORAGE_KEY = "leaveflow-theme-mode";
const THEME_MODES = ["system", "light", "dark"];

const getStoredMode = () => {
  const storedMode = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_MODES.includes(storedMode) ? storedMode : "system";
};

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getStoredMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const theme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setSystemTheme(event.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode, theme]);

  const value = useMemo(() => ({ mode, setMode, theme }), [mode, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider };
