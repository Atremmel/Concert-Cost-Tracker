import type { Concert, ConcertCosts } from "./types";
import { COST_FIELDS } from "./types";

export function getCostValues(concert: ConcertCosts): number[] {
  return COST_FIELDS.map(({ key }) => Number(concert[key]) || 0);
}

export function totalCost(concert: ConcertCosts): number {
  return getCostValues(concert).reduce((sum, value) => sum + value, 0);
}

export function costPerHour(
  concert: ConcertCosts & { hours_at_event?: number | null },
): number | null {
  const hours = Number(concert.hours_at_event);
  if (!hours || hours <= 0) return null;
  return totalCost(concert) / hours;
}

export function funPointsPer100(
  concert: ConcertCosts & { fun_rating: number },
): number | null {
  const total = totalCost(concert);
  if (!total || total <= 0) return null;
  return (concert.fun_rating / total) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getTopCostCategories(concert: Concert, limit = 3): string[] {
  return COST_FIELDS.filter(({ key }) => Number(concert[key]) > 0)
    .sort((a, b) => Number(concert[b.key]) - Number(concert[a.key]))
    .slice(0, limit)
    .map(({ label }) => label);
}

export function aggregateCategorySpending(concerts: Concert[]) {
  return COST_FIELDS.map(({ key, label }) => ({
    category: label,
    amount: concerts.reduce((sum, c) => sum + (Number(c[key]) || 0), 0),
  })).filter((item) => item.amount > 0);
}

export type DashboardStats = {
  totalConcerts: number;
  totalSpent: number;
  avgCostPerConcert: number;
  avgFunRating: number;
  avgCostPerHour: number | null;
  bestValue: Concert | null;
  mostExpensive: Concert | null;
  highestFun: Concert | null;
};

export function computeDashboardStats(concerts: Concert[]): DashboardStats {
  if (concerts.length === 0) {
    return {
      totalConcerts: 0,
      totalSpent: 0,
      avgCostPerConcert: 0,
      avgFunRating: 0,
      avgCostPerHour: null,
      bestValue: null,
      mostExpensive: null,
      highestFun: null,
    };
  }

  const totals = concerts.map((c) => totalCost(c));
  const totalSpent = totals.reduce((a, b) => a + b, 0);
  const costPerHourValues = concerts
    .map((c) => costPerHour(c))
    .filter((v): v is number => v !== null);

  let bestValue: Concert | null = null;
  let bestScore = -Infinity;
  let mostExpensive: Concert | null = null;
  let maxCost = -Infinity;
  let highestFun: Concert | null = null;
  let maxFun = -Infinity;

  for (const concert of concerts) {
    const funScore = funPointsPer100(concert);
    if (funScore !== null && funScore > bestScore) {
      bestScore = funScore;
      bestValue = concert;
    }
    const cost = totalCost(concert);
    if (cost > maxCost) {
      maxCost = cost;
      mostExpensive = concert;
    }
    if (concert.fun_rating > maxFun) {
      maxFun = concert.fun_rating;
      highestFun = concert;
    }
  }

  return {
    totalConcerts: concerts.length,
    totalSpent,
    avgCostPerConcert: totalSpent / concerts.length,
    avgFunRating:
      concerts.reduce((sum, c) => sum + c.fun_rating, 0) / concerts.length,
    avgCostPerHour:
      costPerHourValues.length > 0
        ? costPerHourValues.reduce((a, b) => a + b, 0) / costPerHourValues.length
        : null,
    bestValue,
    mostExpensive,
    highestFun,
  };
}
