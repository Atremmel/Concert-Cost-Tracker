export type GeocodeResult = {
  latitude: number;
  longitude: number;
  displayName: string;
};

export function buildGeocodeQuery(
  venue: string | null | undefined,
  city: string | null | undefined,
  state: string | null | undefined,
): string | null {
  const parts = [venue, city, state].filter((p) => p?.trim());
  if (parts.length === 0) return null;
  return parts.join(", ");
}

export async function geocodeWithNominatim(
  query: string,
): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "ConcertCostTracker/1.0 (student project)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    lat: string;
    lon: string;
    display_name: string;
  }[];

  if (!data.length) return null;

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
    displayName: data[0].display_name,
  };
}
