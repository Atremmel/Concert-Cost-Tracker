"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Concert } from "@/lib/types";
import { formatDate } from "@/lib/concert-math";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type MapPoint = Concert & { latitude: number; longitude: number };

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 12);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((p) => [p.latitude, p.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

type VenueMapInnerProps = {
  concerts: Concert[];
};

export function VenueMapInner({ concerts }: VenueMapInnerProps) {
  const points = useMemo(
    () =>
      concerts.filter(
        (c): c is MapPoint =>
          c.latitude != null &&
          c.longitude != null &&
          !Number.isNaN(c.latitude) &&
          !Number.isNaN(c.longitude),
      ),
    [concerts],
  );

  const center: [number, number] =
    points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [39.8283, -98.5795];

  return (
    <MapContainer
      center={center}
      zoom={points.length === 1 ? 12 : 4}
      className="h-[min(70vh,560px)] w-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {points.map((concert) => (
        <Marker
          key={concert.id}
          position={[concert.latitude, concert.longitude]}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{concert.venue ?? "Venue"}</p>
              <p>{concert.concert_name}</p>
              {concert.artist && (
                <p className="text-base-content/70">{concert.artist}</p>
              )}
              <p>{formatDate(concert.concert_date)}</p>
              {[concert.city, concert.state].filter(Boolean).join(", ") && (
                <p className="text-base-content/60">
                  {[concert.city, concert.state].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
