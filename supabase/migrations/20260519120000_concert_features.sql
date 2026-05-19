-- Setlist, map coordinates, and update/delete policies

ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS setlist_text text,
  ADD COLUMN IF NOT EXISTS setlist_file_path text,
  ADD COLUMN IF NOT EXISTS latitude numeric(10, 7),
  ADD COLUMN IF NOT EXISTS longitude numeric(10, 7);

CREATE POLICY "Users can update own concerts"
  ON public.concerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own concerts"
  ON public.concerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Private bucket for setlist uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'setlists',
  'setlists',
  false,
  5242880,
  ARRAY['text/plain', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own setlists"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'setlists'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own setlists"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'setlists'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own setlists"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'setlists'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own setlists"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'setlists'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
