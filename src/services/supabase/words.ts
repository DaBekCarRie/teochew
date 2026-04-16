import { supabase } from './client';
import type { WordEntry } from '../../types/dictionary';

export async function searchWords(query: string): Promise<WordEntry[]> {
  const pattern = `%${query}%`;

  const { data, error } = await supabase
    .from('words')
    .select(
      'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified',
    )
    .or(
      `teochew_char.ilike.${pattern},` +
        `teochew_pengim.ilike.${pattern},` +
        `thai_meaning.ilike.${pattern},` +
        `english_meaning.ilike.${pattern},` +
        `mandarin_char.ilike.${pattern},` +
        `mandarin_pinyin.ilike.${pattern}`,
    )
    .eq('verified', true)
    .limit(20);

  if (error) throw error;
  return (data as WordEntry[]) ?? [];
}
