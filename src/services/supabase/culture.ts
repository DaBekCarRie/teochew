import { supabase } from './client';
import type { WordEntry } from '../../types/dictionary';

export interface CultureArticleData {
  id: string;
  category: 'festival' | 'food' | 'wedding' | 'religion' | 'tradition';
  title_th: string;
  title_en?: string;
  cover_image_url: string;
  content_th: string;
  related_word_ids: string[];
}

export async function fetchWordOfDay(): Promise<{ date: string; word: WordEntry } | null> {
  const todayStr = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('word_of_day')
    .select(
      `
      date,
      words (
        id,
        mandarin_char,
        mandarin_pinyin,
        thai_meaning,
        english_meaning,
        teochew_char,
        teochew_pengim,
        teochew_audio,
        verified,
        category
      )
    `,
    )
    .eq('date', todayStr)
    .single();

  if (error || !data || !data.words) {
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching word of the day:', error);
    }
    return null;
  }

  // The PostgREST relation returns an array or single object depending on relation.
  // Since it's a many-to-one (one word per WOTD row), it might return an object or array.
  // Let's handle it safely.
  const wordData = Array.isArray(data.words) ? data.words[0] : data.words;

  return {
    date: data.date,
    word: wordData as unknown as WordEntry,
  };
}

export async function fetchCultureArticles(): Promise<CultureArticleData[]> {
  const { data, error } = await supabase
    .from('culture_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching culture articles:', error);
    return [];
  }

  return data as CultureArticleData[];
}
