import { useCallback, useEffect, useState } from "react";

// Three states, matching tokens.css:
//   "system" → nothing stamped, prefers-color-scheme decides
//   "light"  → data-theme="light"
//   "dark"   → data-theme="dark"
// The choice persists per browser. Storage access can throw (privacy
// modes), so every touch is guarded and the hook degrades to "system".

const KEY = "portfolio.theme";
const VALID = ["system", "light", "dark"];

function read() {
  try {
    const v = localStorage.getItem(KEY);
    return VALID.includes(v) ? v : "system";
  } catch {
    return "system";
  }
}

function apply(theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState(read);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    const value = VALID.includes(next) ? next : "system";
    setThemeState(value);
    try {
      if (value === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, value);
    } catch {
      /* storage unavailable; in-memory state still applies */
    }
  }, []);

  const cycle = useCallback(() => {
    setTheme(VALID[(VALID.indexOf(theme) + 1) % VALID.length]);
  }, [theme, setTheme]);

  return { theme, setTheme, cycle };
}
