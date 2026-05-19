"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Music,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";
import {
  computeDashboardStats,
  formatCurrency,
  formatNumber,
  funPointsPer100,
  totalCost,
} from "@/lib/concert-math";
import { StatCard } from "./StatCard";
import { EmptyState } from "./EmptyState";
import { DashboardCharts } from "./DashboardCharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export function DashboardView() {
  const supabase = createClient();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error: fetchError } = await supabase
        .from("concerts")
        .select("*")
        .order("concert_date", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setConcerts((data as Concert[]) ?? []);
      }
      setLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Your concert spending at a glance"
        />
        <LoadingState message="Loading your dashboard…" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-base-300" />
          ))}
        </div>
        <SkeletonGrid count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Dashboard" />
        <FeedbackAlert variant="error" message={error} />
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Your concert spending at a glance"
        />
        <EmptyState />
      </div>
    );
  }

  const stats = computeDashboardStats(concerts);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Your concert spending at a glance"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total concerts"
          value={String(stats.totalConcerts)}
          icon={<Music className="h-6 w-6" />}
        />
        <StatCard
          title="Total spent"
          value={formatCurrency(stats.totalSpent)}
          icon={<DollarSign className="h-6 w-6" />}
          highlight
        />
        <StatCard
          title="Avg cost per concert"
          value={formatCurrency(stats.avgCostPerConcert)}
        />
        <StatCard
          title="Avg fun rating"
          value={formatNumber(stats.avgFunRating, 1)}
          icon={<Star className="h-6 w-6" />}
        />
        <StatCard
          title="Avg cost per hour"
          value={
            stats.avgCostPerHour !== null
              ? formatCurrency(stats.avgCostPerHour)
              : "—"
          }
          icon={<Timer className="h-6 w-6" />}
        />
        <StatCard
          title="Best value"
          value={stats.bestValue?.concert_name ?? "—"}
          description={
            stats.bestValue
              ? `${formatNumber(funPointsPer100(stats.bestValue) ?? 0)} Fun Points per $100`
              : undefined
          }
          icon={<Trophy className="h-6 w-6" />}
        />
        <StatCard
          title="Most expensive"
          value={stats.mostExpensive?.concert_name ?? "—"}
          description={
            stats.mostExpensive
              ? formatCurrency(totalCost(stats.mostExpensive))
              : undefined
          }
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Highest fun"
          value={stats.highestFun?.concert_name ?? "—"}
          description={
            stats.highestFun
              ? `${stats.highestFun.fun_rating}/10`
              : undefined
          }
          icon={<Sparkles className="h-6 w-6" />}
        />
      </div>

      <div>
        <h3 className="mb-1 text-lg font-semibold">Charts</h3>
        <p className="mb-4 text-sm text-base-content/60">
          How your spending and fun ratings compare across shows.
        </p>
        <DashboardCharts concerts={concerts} />
      </div>
    </div>
  );
}
