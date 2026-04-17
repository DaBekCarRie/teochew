import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBookmarks } from '../hooks/useBookmarks';
import type { WordEntry } from '../types/dictionary';

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

const mockWord2: WordEntry = {
  id: 'word-002',
  teochew_char: '火',
  teochew_pengim: 'hue2',
  thai_meaning: 'ไฟ',
  english_meaning: 'fire',
  verified: true,
  category: 'ธรรมชาติ',
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('useBookmarks', () => {
  it('starts loading and then resolves with empty bookmarks', async () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.isLoading).toBe(true);

    await act(async () => {});
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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    expect(result.current.bookmarks).toEqual(stored);
    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
  });

  it('addBookmark adds entry and updates bookmarkedIds', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });

    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
  });

  it('addBookmark persists to storage', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    await act(async () => {
      await result.current.addBookmark(mockWord);
    });

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const stored = JSON.parse(raw!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('word-001');
  });

  it('addBookmark does not duplicate an existing bookmark', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    await act(async () => {
      await result.current.addBookmark(mockWord);
      await result.current.addBookmark(mockWord);
    });

    expect(result.current.bookmarks).toHaveLength(1);
  });

  it('removeBookmark removes entry and updates bookmarkedIds', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

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

  it('bookmarkedIds reflects multiple bookmarks correctly', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    await act(async () => {
      await result.current.addBookmark(mockWord);
      await result.current.addBookmark(mockWord2);
    });

    expect(result.current.bookmarkedIds.has('word-001')).toBe(true);
    expect(result.current.bookmarkedIds.has('word-002')).toBe(true);
    expect(result.current.bookmarkedIds.has('word-999')).toBe(false);
  });

  it('optimistic update: bookmark appears before storage resolves', async () => {
    const { result } = renderHook(() => useBookmarks());
    await act(async () => {});

    // Start add without awaiting
    let addPromise: Promise<void>;
    act(() => {
      addPromise = result.current.addBookmark(mockWord);
    });

    // Optimistic update should be visible immediately
    expect(result.current.bookmarks.some((b) => b.id === 'word-001')).toBe(true);

    await act(async () => {
      await addPromise!;
    });
  });
});
