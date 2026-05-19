-- Create concerts table for Concert Cost Tracker
CREATE TABLE public.concerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concert_name text NOT NULL,
  artist text,
  venue text,
  city text,
  state text,
  concert_date date NOT NULL,
  distance_from_home numeric(8, 2),
  hours_at_event numeric(6, 2),
  ticket_cost numeric(10, 2) NOT NULL DEFAULT 0,
  ticket_fees numeric(10, 2) NOT NULL DEFAULT 0,
  parking_cost numeric(10, 2) NOT NULL DEFAULT 0,
  food_drink_cost numeric(10, 2) NOT NULL DEFAULT 0,
  merchandise_cost numeric(10, 2) NOT NULL DEFAULT 0,
  lodging_cost numeric(10, 2) NOT NULL DEFAULT 0,
  travel_cost numeric(10, 2) NOT NULL DEFAULT 0,
  other_cost numeric(10, 2) NOT NULL DEFAULT 0,
  fun_rating smallint NOT NULL CHECK (fun_rating >= 1 AND fun_rating <= 10),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX concerts_user_id_idx ON public.concerts (user_id);
CREATE INDEX concerts_concert_date_idx ON public.concerts (concert_date DESC);

ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own concerts"
  ON public.concerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own concerts"
  ON public.concerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
