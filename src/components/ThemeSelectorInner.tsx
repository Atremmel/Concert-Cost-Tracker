"use client";

import { Palette } from "lucide-react";
import { useTheme, type ThemeName } from "./ThemeProvider";

export function ThemeSelectorInner({ className = "" }: { className?: string }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <label className={`form-control w-full max-w-xs ${className}`}>
      <div className="label py-1">
        <span className="label-text flex items-center gap-1.5 text-xs font-medium">
          <Palette className="h-3.5 w-3.5" aria-hidden />
          Theme
        </span>
      </div>
      <select
        className="select select-bordered select-sm w-full capitalize"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        aria-label="Choose app theme"
        suppressHydrationWarning
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
