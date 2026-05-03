import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadBookmarks,
  addBookmark as serviceAdd,
  removeBookmark as serviceRemove,
  removeBookmarks as serviceRemoveMany,
} from '../services/bookmarks';
import type { BookmarkItem, WordEntry } from '../types/dictionary';

type AddBookmarkInput = WordEntry | BookmarkItem;

interface UseBookmarksResult {
  bookmarks: BookmarkItem[];
  bookmarkedIds: Set<string>;
  isLoading: boolean;
  addBookmark: (entry: AddBookmarkInput) => Promise<void>;
  removeBookmark: (wordId: string) => Promise<void>;
  removeBookmarks: (wordIds: string[]) => Promise<void>;
}

export function useBookmarks(): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks().then((items) => {
      setBookmarks(items);
      setIsLoading(false);
    });
  }, []);

  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  const addBookmark = useCallback(async (entry: AddBookmarkInput) => {
    const updated = await serviceAdd(entry);
    setBookmarks(updated);
  }, []);

  const removeBookmark = useCallback(async (wordId: string) => {
    const updated = await serviceRemove(wordId);
    setBookmarks(updated);
  }, []);

  const removeBookmarks = useCallback(async (wordIds: string[]) => {
    const updated = await serviceRemoveMany(wordIds);
    setBookmarks(updated);
  }, []);

  return { bookmarks, bookmarkedIds, isLoading, addBookmark, removeBookmark, removeBookmarks };
}
