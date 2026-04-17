import { supabase } from './client';

const BUCKET = 'audio';

/**
 * Returns a signed URL for a word's audio file (valid for 60 seconds).
 * Files are stored as `<wordId>.mp3` in the `audio` bucket.
 * Returns null if the file does not exist or the request fails.
 */
export async function getAudioUrl(wordId: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(`${wordId}.mp3`, 60);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
