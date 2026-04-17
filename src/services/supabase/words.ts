import { supabase } from './client';
import type { WordDetail, WordEntry } from '../../types/dictionary';

export async function searchWords(query: string): Promise<WordEntry[]> {
  const pattern = `%${query}%`;

  const { data, error } = await supabase
    .from('words')
    .select(
      'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio',
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

export async function getRandomWords(limit = 10): Promise<WordEntry[]> {
  const { data, error } = await supabase
    .from('words')
    .select(
      'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio',
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as WordEntry[]) ?? [];
}

export async function getWordDetail(wordId: string): Promise<WordDetail | null> {
  const { data, error } = await supabase
    .from('words')
    .select(
      `id, teochew_char, teochew_pengim, thai_meaning, english_meaning,
       mandarin_char, mandarin_pinyin, category, verified, notes, teochew_audio,
       word_usage_examples (teochew_char, teochew_pengim, thai_meaning, english_meaning, sort_order)`,
    )
    .eq('id', wordId)
    .single();

  console.log('[getWordDetail] raw response', JSON.stringify({ data, error }, null, 2));

  if (error || !data) return null;

  const { word_usage_examples, ...word } = data as any;
  const usage_examples = (word_usage_examples ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map(({ sort_order: _, ...ex }: any) => ex);

  return { ...word, usage_examples } as WordDetail;
}
