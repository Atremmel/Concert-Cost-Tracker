"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Concert } from "@/lib/types";
import {
  aggregateCategorySpending,
  formatCurrency,
  formatNumber,
  funPointsPer100,
  totalCost,
} from "@/lib/concert-math";

const CHART_COLORS = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
};

function truncateLabel(label: string, max = 14) {
  return label.length > max ? `${label.slice(0, max)}…` : label;
}

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="surface-card">
      <div className="card-body">
        <h3 className="card-title text-base">{title}</h3>
        <div className="h-56 w-full sm:h-64">{children}</div>
      </div>
    </div>
  );
}

export function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  const categoryData = aggregateCategorySpending(concerts);

  const byConcert = concerts.map((c) => ({
    name: truncateLabel(c.concert_name),
    fullName: c.concert_name,
    totalCost: totalCost(c),
    funRating: c.fun_rating,
    funPer100: funPointsPer100(c) ?? 0,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Spending by cost category">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              interval={0}
              height={56}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Bar
              dataKey="amount"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Total cost by concert">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byConcert}
            margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullName ?? ""
              }
            />
            <Bar
              dataKey="totalCost"
              fill={CHART_COLORS.secondary}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Fun rating by concert">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byConcert}
            margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullName ?? ""
              }
            />
            <Bar
              dataKey="funRating"
              fill={CHART_COLORS.accent}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Fun Points per $100 by concert">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byConcert}
            margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => formatNumber(v)}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullName ?? ""
              }
            />
            <Bar
              dataKey="funPer100"
              fill={CHART_COLORS.success}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
