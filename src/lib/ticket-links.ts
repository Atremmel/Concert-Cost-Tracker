export type TicketSearchParams = {
  artist: string;
  city?: string;
  state?: string;
  date?: string;
};

export type TicketSiteLink = {
  id: string;
  name: string;
  description: string;
  url: string;
};

function encode(q: string) {
  return encodeURIComponent(q.trim());
}

function buildQuery(params: TicketSearchParams): string {
  const parts = [params.artist];
  if (params.city) parts.push(params.city);
  if (params.state) parts.push(params.state);
  return parts.join(" ");
}

export function buildTicketSiteLinks(
  params: TicketSearchParams,
): TicketSiteLink[] {
  const artist = params.artist.trim();
  if (!artist) return [];

  const query = buildQuery(params);
  const q = encode(query);
  const artistOnly = encode(artist);
  const hasLocation = !!(params.city?.trim() || params.state?.trim());
  const links: TicketSiteLink[] = [
    {
      id: "ticketmaster",
      name: "Ticketmaster",
      description: "Official tickets and events",
      url: hasLocation
        ? `https://www.ticketmaster.com/search?q=${q}`
        : `https://www.ticketmaster.com/search?q=${artistOnly}`,
    },
    {
      id: "stubhub",
      name: "StubHub",
      description: "Resale marketplace",
      url: `https://www.stubhub.com/find/s/?q=${q}`,
    },
    {
      id: "seatgeek",
      name: "SeatGeek",
      description: "Tickets with deal scores",
      url: `https://seatgeek.com/search?search=${q}`,
    },
    {
      id: "vividseats",
      name: "Vivid Seats",
      description: "Concert and sports tickets",
      url: `https://www.vividseats.com/search?searchTerm=${q}`,
    },
    {
      id: "tickpick",
      name: "TickPick",
      description: "No-fee ticket marketplace",
      url: `https://www.tickpick.com/search?q=${q}`,
    },
  ];

  if (params.date) {
    const dateNote = ` (${params.date})`;
    return links.map((link) => ({
      ...link,
      description: `${link.description}${dateNote}`,
    }));
  }

  return links;
}
