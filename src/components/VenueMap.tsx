"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";
import { buildGeocodeQuery } from "@/lib/geocode";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "./EmptyState";

const VenueMapInner = dynamic(
  () => import("./VenueMapInner").then((m) => m.VenueMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-xl bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    ),
  },
);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function VenueMap() {
  const supabase = createClient();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const loadConcerts = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("concerts")
      .select("*")
      .order("concert_date", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return [];
    }
    return (data as Concert[]) ?? [];
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const rows = await loadConcerts();
      if (cancelled) return;

      const needsGeocode = rows.filter(
        (c) =>
          (c.latitude == null || c.longitude == null) &&
          buildGeocodeQuery(c.venue, c.city, c.state),
      );

      if (needsGeocode.length > 0) {
        setGeocoding(true);
        setGeocodeProgress({ done: 0, total: needsGeocode.length });

        const updated = [...rows];

        for (let i = 0; i < needsGeocode.length; i++) {
          if (cancelled) break;
          const concert = needsGeocode[i];

          const response = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              concertId: concert.id,
              venue: concert.venue,
              city: concert.city,
              state: concert.state,
            }),
          });

          if (response.ok) {
            const body = (await response.json()) as {
              latitude: number;
              longitude: number;
            };
            const idx = updated.findIndex((c) => c.id === concert.id);
            if (idx >= 0) {
              updated[idx] = {
                ...updated[idx],
                latitude: body.latitude,
                longitude: body.longitude,
              };
            }
          }

          setGeocodeProgress({ done: i + 1, total: needsGeocode.length });
          await sleep(1100);
        }

        if (!cancelled) {
          setConcerts(updated);
          setGeocoding(false);
        }
      } else {
        setConcerts(rows);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadConcerts]);

  const mappable = concerts.filter(
    (c) => c.latitude != null && c.longitude != null,
  );
  const withVenue = concerts.filter((c) =>
    buildGeocodeQuery(c.venue, c.city, c.state),
  );

  if (loading || geocoding) {
    return (
      <LoadingState
        message={
          geocoding
            ? `Locating venues… ${geocodeProgress.done}/${geocodeProgress.total}`
            : "Loading your concert map…"
        }
      />
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-error/10 p-4 text-error">{error}</p>
    );
  }

  if (concerts.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Venue map"
          subtitle="See every venue you have visited."
        />
        <EmptyState message="Log a concert with a venue and city to see it on the map." />
      </div>
    );
  }

  if (mappable.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Venue map"
          subtitle="See every venue you have visited."
        />
        <EmptyState message="Add venue and city when logging concerts so we can place them on the map." />
        {withVenue.length > 0 && (
          <p className="text-sm text-base-content/70">
            We could not find map coordinates for your saved venues. Try adding
            a clearer city or state on your concerts.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Venue map"
        subtitle={`${mappable.length} venue${mappable.length === 1 ? "" : "s"} on your concert journey.`}
      />
      <VenueMapInner concerts={mappable} />
      <p className="text-xs text-base-content/60">
        Map data ©{" "}
        <Link
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          OpenStreetMap
        </Link>{" "}
        contributors. Geocoding via Nominatim.
      </p>
    </div>
  );
}
