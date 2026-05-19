"use client";

import { createContext, useContext, useEffect, useState } from "react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "forest",
  "synthwave",
  "retro",
] as const;

export type ThemeName = (typeof THEMES)[number];

const STORAGE_KEY = "concert-theme";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: readonly ThemeName[];
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  themes: THEMES,
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && (THEMES as readonly string[]).includes(stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  const setTheme = (next: ThemeName) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, themes: THEMES, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
