"use client";

import dynamic from "next/dynamic";
import { Palette } from "lucide-react";

function ThemeSelectorPlaceholder({ className = "" }: { className?: string }) {
  return (
    <label
      className={`form-control w-full max-w-xs ${className}`}
      aria-label="Theme selector loading"
    >
      <div className="label py-1">
        <span className="label-text flex items-center gap-1.5 text-xs font-medium">
          <Palette className="h-3.5 w-3.5" aria-hidden />
          Theme
        </span>
      </div>
      <div className="select select-bordered select-sm flex h-8 w-full items-center px-3">
        <span className="skeleton h-4 w-16" />
      </div>
    </label>
  );
}

const ThemeSelectorInner = dynamic(
  () =>
    import("./ThemeSelectorInner").then((mod) => mod.ThemeSelectorInner),
  {
    ssr: false,
    loading: () => <ThemeSelectorPlaceholder />,
  },
);

export function ThemeSelector({ className = "" }: { className?: string }) {
  return <ThemeSelectorInner className={className} />;
}
