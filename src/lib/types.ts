export type Concert = {
  id: string;
  user_id: string;
  concert_name: string;
  artist: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  concert_date: string;
  distance_from_home: number | null;
  hours_at_event: number | null;
  ticket_cost: number;
  ticket_fees: number;
  parking_cost: number;
  food_drink_cost: number;
  merchandise_cost: number;
  lodging_cost: number;
  travel_cost: number;
  other_cost: number;
  fun_rating: number;
  notes: string | null;
  setlist_text: string | null;
  setlist_file_path: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type ConcertCosts = {
  ticket_cost: number;
  ticket_fees: number;
  parking_cost: number;
  food_drink_cost: number;
  merchandise_cost: number;
  lodging_cost: number;
  travel_cost: number;
  other_cost: number;
};

export type ConcertInsert = Omit<Concert, "id" | "created_at">;

export const COST_FIELDS = [
  { key: "ticket_cost" as const, label: "Ticket cost" },
  { key: "ticket_fees" as const, label: "Ticket fees" },
  { key: "parking_cost" as const, label: "Parking" },
  { key: "food_drink_cost" as const, label: "Food & drink" },
  { key: "merchandise_cost" as const, label: "Merchandise" },
  { key: "lodging_cost" as const, label: "Hotel / lodging" },
  { key: "travel_cost" as const, label: "Travel / gas" },
  { key: "other_cost" as const, label: "Other" },
];
