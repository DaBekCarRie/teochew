import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase/client';
import type { WordEntry } from '../types/dictionary';

const KEY_PREFIX = '@teochew/cache_word_';
const METADATA_KEY = '@teochew/cache_metadata';
const INDEX_KEY = '@teochew/cache_index';

const BATCH_SIZE = 100;
const TARGET_WORDS = 500;

export interface CacheMetadata {
  wordCount: number;
  lastSyncAt: string | null;
  version: number;
}

export async function getCacheMetadata(): Promise<CacheMetadata> {
  try {
    const raw = await AsyncStorage.getItem(METADATA_KEY);
    if (!raw) return { wordCount: 0, lastSyncAt: null, version: 1 };
    return JSON.parse(raw) as CacheMetadata;
  } catch {
    return { wordCount: 0, lastSyncAt: null, version: 1 };
  }
}

async function saveCacheMetadata(meta: CacheMetadata): Promise<void> {
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(meta));
}

async function getWordIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

async function saveWordIndex(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

async function cacheWord(word: WordEntry): Promise<void> {
  await AsyncStorage.setItem(KEY_PREFIX + word.id, JSON.stringify(word));
}

export async function getCachedWords(): Promise<WordEntry[]> {
  const ids = await getWordIndex();
  const words: WordEntry[] = [];
  for (const id of ids) {
    try {
      const raw = await AsyncStorage.getItem(KEY_PREFIX + id);
      if (raw) words.push(JSON.parse(raw) as WordEntry);
    } catch {
      // skip corrupt entry
    }
  }
  return words;
}

export async function searchCachedWords(
  query: string,
  category?: string | null,
): Promise<WordEntry[]> {
  const q = query.toLowerCase().trim();
  const all = await getCachedWords();
  return all
    .filter((w) => {
      if (category && w.category !== category) return false;
      const fields = [
        w.teochew_char,
        w.teochew_pengim,
        w.thai_meaning,
        w.english_meaning,
        w.mandarin_char,
        w.mandarin_pinyin,
      ];
      return fields.some((val) => typeof val === 'string' && val.toLowerCase().includes(q));
    })
    .slice(0, 20);
}

export async function isCachePopulated(): Promise<boolean> {
  const meta = await getCacheMetadata();
  return meta.wordCount > 0;
}

export async function clearCache(): Promise<void> {
  const ids = await getWordIndex();
  const keys = ids.map((id) => KEY_PREFIX + id);
  await AsyncStorage.multiRemove([...keys, INDEX_KEY, METADATA_KEY]);
}

const WORD_SELECT =
  'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio';

export async function downloadCache(onProgress?: (progress: number) => void): Promise<number> {
  let offset = 0;
  const allWords: WordEntry[] = [];

  while (allWords.length < TARGET_WORDS) {
    const { data, error } = await supabase
      .from('words')
      .select(WORD_SELECT)
      .eq('verified', true)
      .order('id')
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allWords.push(...(data as WordEntry[]));
    offset += BATCH_SIZE;

    onProgress?.(Math.min(allWords.length / TARGET_WORDS, 0.99));
    if (data.length < BATCH_SIZE) break;
  }

  // Write all words and index
  await Promise.all(allWords.map((word) => cacheWord(word)));
  await saveWordIndex(allWords.map((w) => w.id));
  await saveCacheMetadata({
    wordCount: allWords.length,
    lastSyncAt: new Date().toISOString(),
    version: 1,
  });

  onProgress?.(1);
  return allWords.length;
}

export async function syncCacheBackground(
  onProgress?: (progress: number) => void,
): Promise<number> {
  const existingIds = new Set(await getWordIndex());
  let offset = 0;
  const newWords: WordEntry[] = [];
  const updatedWords: WordEntry[] = [];

  while (true) {
    const { data, error } = await supabase
      .from('words')
      .select(WORD_SELECT)
      .eq('verified', true)
      .order('id')
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const word of data as WordEntry[]) {
      if (existingIds.has(word.id)) {
        updatedWords.push(word);
      } else {
        newWords.push(word);
        existingIds.add(word.id);
      }
    }

    offset += BATCH_SIZE;
    onProgress?.(Math.min(offset / TARGET_WORDS, 0.95));
    if (data.length < BATCH_SIZE) break;
  }

  await Promise.all([...newWords, ...updatedWords].map((w) => cacheWord(w)));
  if (newWords.length > 0) {
    await saveWordIndex(Array.from(existingIds));
  }
  await saveCacheMetadata({
    wordCount: existingIds.size,
    lastSyncAt: new Date().toISOString(),
    version: 1,
  });

  onProgress?.(1);
  return newWords.length;
}
