"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";
import { ConcertCard } from "./ConcertCard";
import { EmptyState } from "./EmptyState";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";

export function ConcertsList() {
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
      <div className="space-y-4">
        <p className="text-center text-sm text-base-content/60">
          Loading your concerts…
        </p>
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (error) {
    return <FeedbackAlert variant="error" message={error} />;
  }

  if (concerts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/60">Newest first</p>
      <StaggerGrid className="grid gap-4 md:grid-cols-2">
        {concerts.map((concert) => (
          <StaggerItem key={concert.id}>
            <ConcertCard concert={concert} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
