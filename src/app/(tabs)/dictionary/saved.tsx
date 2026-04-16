import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { SavedWordCard } from '../../../components/dictionary/SavedWordCard';
import { EmptyBookmarkState } from '../../../components/dictionary/EmptyBookmarkState';
import { UndoToast } from '../../../components/dictionary/UndoToast';
import type { BookmarkItem } from '../../../types/dictionary';

type SortBy = 'newest' | 'oldest' | 'az';

export default function SavedWordsScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark, addBookmark } = useBookmarks();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [pendingRemove, setPendingRemove] = useState<BookmarkItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Derive unique categories from bookmarks
  const categories = useMemo(() => {
    const cats = bookmarks.map((b) => b.category).filter((c): c is string => Boolean(c));
    return ['all', ...Array.from(new Set(cats))];
  }, [bookmarks]);

  // Filter + sort
  const displayedBookmarks = useMemo(() => {
    const filtered =
      filterCategory === 'all' ? bookmarks : bookmarks.filter((b) => b.category === filterCategory);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.bookmarked_at).getTime() - new Date(b.bookmarked_at).getTime();
      }
      // az — sort by teochew_char
      return a.teochew_char.localeCompare(b.teochew_char, 'zh');
    });
  }, [bookmarks, filterCategory, sortBy]);

  function handleRemove(id: string) {
    const item = bookmarks.find((b) => b.id === id);
    if (!item) return;
    setPendingRemove(item);
    removeBookmark(id);
    setToastVisible(true);
  }

  function handleUndo() {
    if (!pendingRemove) return;
    addBookmark(pendingRemove);
    setToastVisible(false);
    setPendingRemove(null);
  }

  function handleToastDismiss() {
    setToastVisible(false);
    setPendingRemove(null);
  }

  function handleCardPress(id: string) {
    router.push({ pathname: '/dictionary/[wordId]', params: { wordId: id } });
  }

  const sortLabels: { key: SortBy; label: string }[] = [
    { key: 'newest', label: 'ใหม่สุด' },
    { key: 'oldest', label: 'เก่าสุด' },
    { key: 'az', label: 'ก-ฮ / A-Z' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <Stack.Screen options={{ title: 'คำที่บันทึกไว้', headerShown: true }} />

      {bookmarks.length > 0 && (
        <>
          {/* Category filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5 pt-3"
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map((cat) => {
              const isActive = filterCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-full ${isActive ? 'bg-gold-500' : 'bg-cream-100 border border-cream-300'}`}
                >
                  <Text
                    className={`text-xs ${isActive ? 'text-cream-50 font-medium' : 'text-brown-600'}`}
                  >
                    {cat === 'all' ? 'ทั้งหมด' : cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Sort chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5 pt-2 pb-1"
            contentContainerStyle={{ gap: 8 }}
          >
            {sortLabels.map(({ key, label }) => {
              const isActive = sortBy === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSortBy(key)}
                  className={`px-3 py-1.5 rounded-full ${isActive ? 'bg-gold-500' : 'bg-cream-100 border border-cream-300'}`}
                >
                  <Text
                    className={`text-xs ${isActive ? 'text-cream-50 font-medium' : 'text-brown-600'}`}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      <FlatList<BookmarkItem>
        data={displayedBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavedWordCard item={item} onPress={handleCardPress} onRemove={handleRemove} />
        )}
        ListEmptyComponent={<EmptyBookmarkState onGoToDictionary={() => router.back()} />}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      <UndoToast
        message={pendingRemove ? `ลบ "${pendingRemove.teochew_char}" ออกจากรายการบันทึก` : ''}
        visible={toastVisible}
        onUndo={handleUndo}
        onDismiss={handleToastDismiss}
      />

      {/* TODO: S1-7 edit mode (batch delete) — deferred */}
    </SafeAreaView>
  );
}
