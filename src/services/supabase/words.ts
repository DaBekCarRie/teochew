import { supabase } from './client';
import type { WordDetail, WordEntry } from '../../types/dictionary';

const WORD_SELECT =
  'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio';

export async function searchWords(query: string, category?: string | null): Promise<WordEntry[]> {
  const pattern = `%${query}%`;

  let q = supabase
    .from('words')
    .select(WORD_SELECT)
    .or(
      `teochew_char.ilike.${pattern},` +
        `teochew_pengim.ilike.${pattern},` +
        `thai_meaning.ilike.${pattern},` +
        `english_meaning.ilike.${pattern},` +
        `mandarin_char.ilike.${pattern},` +
        `mandarin_pinyin.ilike.${pattern}`,
    )
    .eq('verified', true);

  if (category) q = q.eq('category', category);

  const { data, error } = await q.limit(50);
  if (error) throw error;
  return (data as WordEntry[]) ?? [];
}

export async function getRandomWords(limit = 10, category?: string | null): Promise<WordEntry[]> {
  let q = supabase.from('words').select(WORD_SELECT).order('created_at', { ascending: false });

  if (category) q = q.eq('category', category);

  const { data, error } = await q.limit(limit);
  if (error) return [];
  return (data as WordEntry[]) ?? [];
}

const PAGE_SIZE = 20;

export async function getCategoryWords(
  category: string | null,
  offset: number,
): Promise<{ words: WordEntry[]; hasMore: boolean }> {
  let q = supabase
    .from('words')
    .select(WORD_SELECT)
    .eq('verified', true)
    .order('teochew_pengim')
    .range(offset, offset + PAGE_SIZE - 1);

  if (category) q = q.eq('category', category);

  const { data, error } = await q;
  if (error) return { words: [], hasMore: false };
  const words = (data as WordEntry[]) ?? [];
  return { words, hasMore: words.length === PAGE_SIZE };
}

export async function getFlashcardWords(
  category?: string | null,
  limit = 30,
): Promise<WordEntry[]> {
  let q = supabase.from('words').select(WORD_SELECT).eq('verified', true);
  if (category) q = q.eq('category', category);
  const { data, error } = await q.limit(limit);
  if (error) throw error;
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

  // console.log('[getWordDetail] raw response', JSON.stringify({ data, error }, null, 2));

  if (error || !data) return null;

  const { word_usage_examples, ...word } = data as any;
  const usage_examples = (word_usage_examples ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map(({ sort_order: _, ...ex }: any) => ex);

  return { ...word, usage_examples } as WordDetail;
}
