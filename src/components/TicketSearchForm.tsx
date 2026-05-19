"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, Ticket } from "lucide-react";
import { buildTicketSiteLinks } from "@/lib/ticket-links";
import { FormField } from "./FormField";
import { PageHeader } from "@/components/ui/PageHeader";

export function TicketSearchForm() {
  const [artist, setArtist] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState(false);

  const links = useMemo(() => {
    if (!searched || !artist.trim()) return [];
    return buildTicketSiteLinks({ artist, city, state, date });
  }, [searched, artist, city, state, date]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist.trim()) return;
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find tickets"
        subtitle="Compare prices on official ticket sites. We open each site with your search — check each one for the lowest price."
      />

      <section className="surface-card">
        <form onSubmit={handleSearch} className="card-body space-y-4">
          <FormField label="Artist or band" htmlFor="ticket_artist" required>
            <input
              id="ticket_artist"
              className="input input-bordered input-md w-full"
              value={artist}
              onChange={(e) => {
                setArtist(e.target.value);
                setSearched(false);
              }}
              placeholder="e.g. Taylor Swift"
              required
            />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="City" htmlFor="ticket_city">
              <input
                id="ticket_city"
                className="input input-bordered input-md w-full"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setSearched(false);
                }}
              />
            </FormField>
            <FormField label="State" htmlFor="ticket_state">
              <input
                id="ticket_state"
                className="input input-bordered input-md w-full"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setSearched(false);
                }}
              />
            </FormField>
          </div>
          <FormField
            label="Event date (optional)"
            htmlFor="ticket_date"
            helper="Helps you spot the right show when comparing sites."
          >
            <input
              id="ticket_date"
              type="date"
              className="input input-bordered input-md w-full"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSearched(false);
              }}
            />
          </FormField>
          <button
            type="submit"
            className="btn btn-primary min-h-11 gap-2"
            disabled={!artist.trim()}
          >
            <Search className="h-4 w-4" aria-hidden />
            Find lowest prices
          </button>
        </form>
      </section>

      {searched && links.length > 0 && (
        <section className="space-y-3">
          <p className="text-sm text-base-content/70">
            Prices are shown on each site. Open every link and compare — we do
            not scrape or guarantee the lowest price.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card-interactive block"
              >
                <div className="card-body gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" aria-hidden />
                      <h3 className="font-semibold">{site.name}</h3>
                    </div>
                    <ExternalLink
                      className="h-4 w-4 shrink-0 text-base-content/50"
                      aria-hidden
                    />
                  </div>
                  <p className="text-sm text-base-content/70">
                    {site.description}
                  </p>
                  <span className="btn btn-outline btn-sm w-fit">
                    Open {site.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
