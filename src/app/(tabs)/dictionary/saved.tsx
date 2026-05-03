import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { SavedWordCard } from '../../../components/dictionary/SavedWordCard';
import { EmptyBookmarkState } from '../../../components/dictionary/EmptyBookmarkState';
import { UndoToast } from '../../../components/dictionary/UndoToast';
import type { BookmarkItem } from '../../../types/dictionary';

type SortBy = 'newest' | 'oldest' | 'az';

export default function SavedWordsScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark, removeBookmarks, addBookmark } = useBookmarks();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingRemove, setPendingRemove] = useState<BookmarkItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Category chips with counts
  const categoryChips = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      const cat = b.category ?? 'อื่นๆ';
      counts[cat] = (counts[cat] ?? 0) + 1;
    });
    const cats = Object.keys(counts).sort();
    return [
      { value: 'all', label: 'ทั้งหมด', count: bookmarks.length },
      ...cats.map((c) => ({ value: c, label: c, count: counts[c] })),
    ];
  }, [bookmarks]);

  // Filter + sort
  const displayedBookmarks = useMemo(() => {
    const filtered =
      filterCategory === 'all'
        ? bookmarks
        : bookmarks.filter((b) => (b.category ?? 'อื่นๆ') === filterCategory);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime();
      if (sortBy === 'oldest')
        return new Date(a.bookmarked_at).getTime() - new Date(b.bookmarked_at).getTime();
      return a.teochew_char.localeCompare(b.teochew_char, 'zh');
    });
  }, [bookmarks, filterCategory, sortBy]);

  function exitEditMode() {
    setIsEditMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(displayedBookmarks.map((b) => b.id)));
  }

  function handleBatchDelete() {
    const n = selectedIds.size;
    if (n === 0) return;
    if (n === 1) {
      // Single — no confirm needed per BR-6
      const [id] = Array.from(selectedIds);
      removeBookmark(id);
      exitEditMode();
      return;
    }
    Alert.alert(`ลบ ${n} คำที่เลือก?`, 'คำเหล่านี้จะถูกลบออกจากรายการบันทึก', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: () => {
          removeBookmarks(Array.from(selectedIds));
          exitEditMode();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  }

  function handleRemove(id: string) {
    const item = bookmarks.find((b) => b.id === id);
    if (!item) return;
    setPendingRemove(item);
    removeBookmark(id);
    setToastVisible(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    if (isEditMode) {
      toggleSelect(id);
      return;
    }
    router.push({ pathname: '/dictionary/[wordId]', params: { wordId: id } });
  }

  const sortLabels: { key: SortBy; label: string }[] = [
    { key: 'newest', label: 'ใหม่สุด' },
    { key: 'oldest', label: 'เก่าสุด' },
    { key: 'az', label: 'ก-ฮ / A-Z' },
  ];

  const allSelected = selectedIds.size > 0 && selectedIds.size === displayedBookmarks.length;

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: isEditMode ? '' : 'คำที่บันทึกไว้',
          headerLeft: isEditMode
            ? () => (
                <Pressable
                  onPress={allSelected ? () => setSelectedIds(new Set()) : selectAll}
                  hitSlop={8}
                  className="pl-1"
                >
                  <Text className="text-sm font-medium text-gold-700">
                    {allSelected ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
                  </Text>
                </Pressable>
              )
            : undefined,
          headerRight: () => (
            <Pressable onPress={isEditMode ? exitEditMode : () => setIsEditMode(true)} hitSlop={8}>
              <Text className="text-sm font-medium text-gold-700">
                {isEditMode ? 'เสร็จ' : 'จัดการ'}
              </Text>
            </Pressable>
          ),
        }}
      />

      {bookmarks.length > 0 && (
        <>
          {/* Category filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-cream-200"
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 8 }}
          >
            {categoryChips.map((chip) => {
              const isActive = filterCategory === chip.value;
              return (
                <Pressable
                  key={chip.value}
                  onPress={() => setFilterCategory(chip.value)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                >
                  <View
                    className={[
                      'flex-row items-center rounded-full px-3 py-1.5',
                      isActive ? 'bg-gold-500' : 'bg-cream-200',
                    ].join(' ')}
                  >
                    <Text
                      className={[
                        'text-xs',
                        isActive ? 'text-cream-50 font-medium' : 'text-brown-600',
                      ].join(' ')}
                    >
                      {chip.label}{' '}
                      <Text className={isActive ? 'text-cream-50' : 'text-brown-400'}>
                        ({chip.count})
                      </Text>
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Sort bar */}
          <View className="flex-row items-center px-5 py-2 gap-2">
            <Text className="text-xs text-brown-400">เรียงตาม:</Text>
            {sortLabels.map(({ key, label }) => {
              const isActive = sortBy === key;
              return (
                <Pressable key={key} onPress={() => setSortBy(key)} hitSlop={6}>
                  <Text
                    className={[
                      'text-xs font-medium',
                      isActive ? 'text-gold-700' : 'text-brown-400',
                    ].join(' ')}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <FlatList<BookmarkItem>
        data={displayedBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavedWordCard
            item={item}
            isEditMode={isEditMode}
            isSelected={selectedIds.has(item.id)}
            onPress={handleCardPress}
            onToggleSelect={toggleSelect}
            onRemove={handleRemove}
          />
        )}
        ListEmptyComponent={<EmptyBookmarkState onGoToDictionary={() => router.back()} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Edit mode bottom bar */}
      {isEditMode && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-cream-50 border-t border-cream-300 px-5 py-3"
          style={{ paddingBottom: 24 }}
        >
          <Pressable
            className="bg-brick-600 rounded-[10px] items-center justify-center py-3"
            style={({ pressed }) => [{ opacity: selectedIds.size === 0 ? 0.4 : pressed ? 0.8 : 1 }]}
            onPress={handleBatchDelete}
            disabled={selectedIds.size === 0}
            accessibilityLabel={`ลบ ${selectedIds.size} คำที่เลือก`}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="trash-outline" size={16} color="#FAF6EE" />
              <Text className="text-cream-50 text-sm font-semibold">
                ลบที่เลือก{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <UndoToast
        message={pendingRemove ? `ลบ "${pendingRemove.teochew_char}" ออกจากรายการบันทึก` : ''}
        visible={toastVisible}
        onUndo={handleUndo}
        onDismiss={handleToastDismiss}
      />
    </SafeAreaView>
  );
}
