import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadBookmarks,
  addBookmark as serviceAdd,
  removeBookmark as serviceRemove,
} from '../services/bookmarks';
import type { BookmarkItem, WordEntry } from '../types/dictionary';

type AddBookmarkInput = WordEntry | BookmarkItem;

interface UseBookmarksResult {
  bookmarks: BookmarkItem[];
  bookmarkedIds: Set<string>;
  isLoading: boolean;
  addBookmark: (entry: AddBookmarkInput) => Promise<void>;
  removeBookmark: (wordId: string) => Promise<void>;
}

export function useBookmarks(): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadBookmarks();
      if (!cancelled) {
        setBookmarks(data);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  const addBookmark = useCallback(async (entry: AddBookmarkInput) => {
    // Optimistic update
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === entry.id)) return prev;
      return [
        {
          id: entry.id,
          teochew_char: entry.teochew_char,
          teochew_pengim: entry.teochew_pengim,
          thai_meaning: entry.thai_meaning,
          english_meaning: entry.english_meaning,
          category: entry.category,
          bookmarked_at: new Date().toISOString(),
        },
        ...prev,
      ];
    });
    try {
      const updated = await serviceAdd(entry);
      setBookmarks(updated);
    } catch (err) {
      console.error('useBookmarks: addBookmark failed', err);
      // Revert on failure
      setBookmarks((prev) => prev.filter((b) => b.id !== entry.id));
    }
  }, []);

  const removeBookmark = useCallback(async (wordId: string) => {
    // Optimistic update
    setBookmarks((prev) => prev.filter((b) => b.id !== wordId));
    try {
      const updated = await serviceRemove(wordId);
      setBookmarks(updated);
    } catch (err) {
      console.error('useBookmarks: removeBookmark failed', err);
      // Revert — reload from storage to restore state
      const data = await loadBookmarks();
      setBookmarks(data);
    }
  }, []);

  return { bookmarks, bookmarkedIds, isLoading, addBookmark, removeBookmark };
}
