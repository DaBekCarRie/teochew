import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookmarkItem, WordEntry } from '../types/dictionary';

const STORAGE_KEY = '@teochew/bookmarks';

export async function loadBookmarks(): Promise<BookmarkItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookmarkItem[];
  } catch {
    return [];
  }
}

export async function saveBookmarks(items: BookmarkItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function addBookmark(
  entry: WordEntry | BookmarkItem,
  restoredAt?: string,
): Promise<BookmarkItem[]> {
  const current = await loadBookmarks();
  if (current.some((b) => b.id === entry.id)) return current;
  const item: BookmarkItem = {
    id: entry.id,
    teochew_char: entry.teochew_char,
    teochew_pengim: entry.teochew_pengim,
    thai_meaning: entry.thai_meaning,
    english_meaning: entry.english_meaning,
    category: entry.category,
    bookmarked_at: restoredAt ?? new Date().toISOString(),
  };
  const updated = [item, ...current];
  await saveBookmarks(updated);
  return updated;
}

export async function removeBookmark(wordId: string): Promise<BookmarkItem[]> {
  const current = await loadBookmarks();
  const updated = current.filter((b) => b.id !== wordId);
  await saveBookmarks(updated);
  return updated;
}

export async function removeBookmarks(wordIds: string[]): Promise<BookmarkItem[]> {
  const idSet = new Set(wordIds);
  const current = await loadBookmarks();
  const updated = current.filter((b) => !idSet.has(b.id));
  await saveBookmarks(updated);
  return updated;
}
