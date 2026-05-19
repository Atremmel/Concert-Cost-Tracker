import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildGeocodeQuery, geocodeWithNominatim } from "@/lib/geocode";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { concertId?: string; venue?: string; city?: string; state?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { concertId, venue, city, state } = body;
  if (!concertId) {
    return NextResponse.json({ error: "concertId is required" }, { status: 400 });
  }

  const query = buildGeocodeQuery(venue, city, state);
  if (!query) {
    return NextResponse.json(
      { error: "Venue or city is required to geocode" },
      { status: 400 },
    );
  }

  const result = await geocodeWithNominatim(query);
  if (!result) {
    return NextResponse.json(
      { error: "Could not find coordinates for this venue" },
      { status: 404 },
    );
  }

  const { error: updateError } = await supabase
    .from("concerts")
    .update({
      latitude: result.latitude,
      longitude: result.longitude,
    })
    .eq("id", concertId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    latitude: result.latitude,
    longitude: result.longitude,
    displayName: result.displayName,
  });
}
