import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  highlight?: boolean;
};

export function StatCard({
  title,
  value,
  description,
  icon,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`stat min-h-[7.5rem] rounded-2xl bg-base-100 shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 ${
        highlight
          ? "ring-2 ring-primary/25"
          : "border border-base-300/50 hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >
      {icon && <div className="stat-figure text-primary">{icon}</div>}
      <div className="stat-title text-xs font-medium uppercase tracking-wide opacity-70">
        {title}
      </div>
      <div
        className="stat-value line-clamp-2 text-lg md:text-2xl"
        title={value}
      >
        {value}
      </div>
      {description && (
        <div className="stat-desc line-clamp-2 text-xs" title={description}>
          {description}
        </div>
      )}
    </div>
  );
}
