import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-hooks';
import { useBookmarks } from '../hooks/useBookmarks';
import type { WordEntry } from '../types/dictionary';

const mockWord: WordEntry = {
  id: 'word-001',
  teochew_char: '水',
  teochew_pengim: 'zui2',
  thai_meaning: 'น้ำ',
  english_meaning: 'water',
  verified: true,
  category: 'ธรรมชาติ',
};

const mockWord2: WordEntry = {
  id: 'word-002',
  teochew_char: '火',
  teochew_pengim: 'hue2',
  thai_meaning: 'ไฟ',
  english_meaning: 'fire',
  verified: true,
  category: 'ธรรมชาติ',
};

/** Flush all pending promises (AsyncStorage mock resolves synchronously but still defers via microtask) */
const flushPromises = () => act(async () => {});

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('useBookmarks', () => {
  it('starts loading and resolves to empty bookmarks', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.bookmarks).toEqual([]);
  });

  it('loads existing bookmarks from storage on mount', async () => {
    const stored = [
      {
        id: 'word-001',
        teochew_char: '水',
        teochew_pengim: 'zui2',
        thai_meaning: 'น้ำ',
        english_meaning: 'water',
        category: 'ธรรมชาติ',
        bookmarked_at: '2024-01-01T00:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem('@teochew/bookmarks', JSON.stringify(stored));

    const { result } = renderHook(() => useBookmarks());
    await flushPromises();
    expect(result.current.bookmarks).toEqual(stored);
    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
  });

  it('addBookmark adds entry and updates bookmarkedIds', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });

    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
  });

  it('addBookmark persists to AsyncStorage', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });

    const raw = await AsyncStorage.getItem('@teochew/bookmarks');
    const stored = JSON.parse(raw!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('word-001');
  });

  it('addBookmark does not duplicate an existing bookmark', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
      await result.current.addBookmark(mockWord);
    });

    expect(result.current.bookmarks).toHaveLength(1);
  });

  it('removeBookmark removes entry and updates bookmarkedIds', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });
    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);

    await act(async () => {
      await result.current.removeBookmark('word-001');
    });

    expect(result.current.bookmarks).toHaveLength(0);
    expect(result.current.bookmarkedIds.has('word-001')).toBe(false);
  });

  it('removeBookmarks removes multiple entries at once', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
      await result.current.addBookmark(mockWord2);
    });
    expect(result.current.bookmarks).toHaveLength(2);

    await act(async () => {
      await result.current.removeBookmarks(['word-001', 'word-002']);
    });

    expect(result.current.bookmarks).toHaveLength(0);
  });

  it('bookmarkedIds reflects multiple bookmarks correctly', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
      await result.current.addBookmark(mockWord2);
    });

    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
    expect(result.current.bookmarkedIds.has('word-002')).toBe(true);
    expect(result.current.bookmarkedIds.has('word-999')).toBe(false);
  });

  it('bookmark appears after addBookmark resolves', async () => {
    const { result } = renderHook(() => useBookmarks());
    await flushPromises();

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });

    expect(result.current.bookmarks.some((b) => b.id === 'word-001')).toBe(true);
  });
});
