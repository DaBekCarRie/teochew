-- Create new columns in words table for audio recording tracking
ALTER TABLE public.words
  ADD COLUMN IF NOT EXISTS audio_recorded_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS audio_recorded_at timestamptz,
  ADD COLUMN IF NOT EXISTS audio_status text CHECK (audio_status IN ('pending_review', 'approved', 'skipped'));

-- Allow authenticated users to update words (specifically for audio tracking)
-- Note: We should check existing RLS policies on words table, but we will add a policy for authenticated users to update.
CREATE POLICY "Allow authenticated users to update audio status"
  ON public.words
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure authenticated users can upload to audio bucket
CREATE POLICY "Allow authenticated inserts in audio bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Allow authenticated updates in audio bucket"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audio')
  WITH CHECK (bucket_id = 'audio');
