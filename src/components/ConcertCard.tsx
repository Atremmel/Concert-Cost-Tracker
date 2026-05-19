import type { Concert } from "@/lib/types";
import {
  costPerHour,
  formatCurrency,
  formatDate,
  formatNumber,
  funPointsPer100,
  getTopCostCategories,
  totalCost,
} from "@/lib/concert-math";
import { MapPin, Star } from "lucide-react";

export function ConcertCard({ concert }: { concert: Concert }) {
  const total = totalCost(concert);
  const perHour = costPerHour(concert);
  const funPer100 = funPointsPer100(concert);
  const categories = getTopCostCategories(concert);
  const location = [concert.venue, concert.city, concert.state]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="surface-card-interactive">
      <div className="card-body gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="card-title text-lg">{concert.concert_name}</h2>
            {concert.artist && (
              <p className="text-sm text-base-content/70">{concert.artist}</p>
            )}
          </div>
          <div className="badge badge-primary gap-1">
            <Star className="h-3 w-3" aria-hidden />
            {concert.fun_rating}/10
          </div>
        </div>

        {location && (
          <p className="flex items-center gap-1 text-sm text-base-content/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {location}
          </p>
        )}

        <p className="text-sm font-medium">{formatDate(concert.concert_date)}</p>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-base-200/50 p-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-base-content/60">Total cost</p>
            <p className="font-semibold">{formatCurrency(total)}</p>
          </div>
          <div>
            <p className="text-xs text-base-content/60">Cost per hour</p>
            <p className="font-semibold">
              {perHour !== null ? formatCurrency(perHour) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-base-content/60">Fun Points per $100</p>
            <p className="font-semibold">
              {funPer100 !== null ? formatNumber(funPer100) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-base-content/60">Distance</p>
            <p className="font-semibold">
              {concert.distance_from_home != null
                ? `${concert.distance_from_home} mi`
                : "—"}
            </p>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <span key={cat} className="badge badge-outline badge-sm">
                {cat}
              </span>
            ))}
          </div>
        )}

        {concert.notes && (
          <p className="rounded-lg bg-base-200 p-2 text-sm text-base-content/80 line-clamp-3">
            {concert.notes}
          </p>
        )}
      </div>
    </article>
  );
}
