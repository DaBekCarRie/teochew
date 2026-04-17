import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadBookmarks, addBookmark, removeBookmark, saveBookmarks } from '../services/bookmarks';
import type { BookmarkItem, WordEntry } from '../types/dictionary';

const STORAGE_KEY = '@teochew/bookmarks';

const mockWord: WordEntry = {
  id: 'word-001',
  teochew_char: '水',
  teochew_pengim: 'zui2',
  thai_meaning: 'น้ำ',
  english_meaning: 'water',
  verified: true,
  category: 'ธรรมชาติ',
};

const mockBookmark: BookmarkItem = {
  id: 'word-001',
  teochew_char: '水',
  teochew_pengim: 'zui2',
  thai_meaning: 'น้ำ',
  english_meaning: 'water',
  category: 'ธรรมชาติ',
  bookmarked_at: '2024-01-01T00:00:00.000Z',
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('loadBookmarks', () => {
  it('returns empty array when storage is empty', async () => {
    const result = await loadBookmarks();
    expect(result).toEqual([]);
  });

  it('returns parsed bookmarks from storage', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([mockBookmark]));
    const result = await loadBookmarks();
    expect(result).toEqual([mockBookmark]);
  });

  it('returns empty array when storage contains invalid JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'not-json{{{');
    const result = await loadBookmarks();
    expect(result).toEqual([]);
  });
});

describe('saveBookmarks', () => {
  it('persists bookmarks to storage', async () => {
    await saveBookmarks([mockBookmark]);
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw!)).toEqual([mockBookmark]);
  });

  it('overwrites existing bookmarks', async () => {
    await saveBookmarks([mockBookmark]);
    const second: BookmarkItem = { ...mockBookmark, id: 'word-002' };
    await saveBookmarks([second]);
    const result = await loadBookmarks();
    expect(result).toEqual([second]);
  });
});

describe('addBookmark', () => {
  it('adds a word entry as a bookmark', async () => {
    const result = await addBookmark(mockWord);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('word-001');
    expect(result[0].teochew_char).toBe('水');
    expect(result[0].bookmarked_at).toBeDefined();
  });

  it('prepends new bookmark to existing list', async () => {
    const existing: BookmarkItem = { ...mockBookmark, id: 'word-000' };
    await saveBookmarks([existing]);

    const result = await addBookmark(mockWord);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('word-001'); // newest first
    expect(result[1].id).toBe('word-000');
  });

  it('does not add duplicate bookmark', async () => {
    await addBookmark(mockWord);
    const result = await addBookmark(mockWord);
    expect(result).toHaveLength(1);
  });

  it('persists added bookmark to storage', async () => {
    await addBookmark(mockWord);
    const loaded = await loadBookmarks();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('word-001');
  });

  it('uses restoredAt timestamp when provided', async () => {
    const timestamp = '2020-06-15T12:00:00.000Z';
    const result = await addBookmark(mockWord, timestamp);
    expect(result[0].bookmarked_at).toBe(timestamp);
  });
});

describe('removeBookmark', () => {
  it('removes an existing bookmark', async () => {
    await saveBookmarks([mockBookmark]);
    const result = await removeBookmark('word-001');
    expect(result).toEqual([]);
  });

  it('does nothing when bookmark does not exist', async () => {
    await saveBookmarks([mockBookmark]);
    const result = await removeBookmark('word-999');
    expect(result).toHaveLength(1);
  });

  it('removes only the specified bookmark from a list', async () => {
    const second: BookmarkItem = { ...mockBookmark, id: 'word-002' };
    await saveBookmarks([mockBookmark, second]);
    const result = await removeBookmark('word-001');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('word-002');
  });

  it('persists removal to storage', async () => {
    await saveBookmarks([mockBookmark]);
    await removeBookmark('word-001');
    const loaded = await loadBookmarks();
    expect(loaded).toEqual([]);
  });
});
