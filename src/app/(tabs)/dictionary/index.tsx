import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SearchBar } from '../../../components/dictionary/SearchBar';
import { WordResultCard } from '../../../components/dictionary/WordResultCard';
import { SkeletonList } from '../../../components/dictionary/SkeletonList';
import { SearchEmptyState } from '../../../components/dictionary/SearchEmptyState';
import { SearchErrorState } from '../../../components/dictionary/SearchErrorState';
import { ResultsCountLabel } from '../../../components/dictionary/ResultsCountLabel';
import { CategoryFilter } from '../../../components/dictionary/CategoryFilter';
import { DownloadProgressModal } from '../../../components/cache/DownloadProgressModal';
import { OfflineBanner } from '../../../components/cache/OfflineBanner';
import { SyncingBanner } from '../../../components/cache/SyncingBanner';
import { useDebounce } from '../../../hooks/useDebounce';
import { useWordSearch } from '../../../hooks/useWordSearch';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { useOfflineCache } from '../../../hooks/useOfflineCache';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { getCategoryWords } from '../../../services/supabase/words';
import type { WordEntry } from '../../../types/dictionary';

export default function DictionaryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), 300);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Idle browse state (no active search query)
  const [browseWords, setBrowseWords] = useState<WordEntry[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseHasMore, setBrowseHasMore] = useState(false);
  const browseOffsetRef = useRef(0);
  const browseCategory = useRef<string | null>(null); // tracks which category the current list belongs to
  const flatListRef = useRef<FlatList<WordEntry>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isConnected = useNetworkStatus();
  const { cacheStatus, progress, wordCount, isPopulated, initializeCache, refreshCache } =
    useOfflineCache();

  // First-launch: trigger download once connected and cache is empty
  useEffect(() => {
    if (isConnected && !isPopulated && cacheStatus === 'idle') {
      initializeCache();
    }
  }, [isConnected, isPopulated, cacheStatus, initializeCache]);

  // Background sync when coming back online with existing cache
  useEffect(() => {
    if (isConnected && isPopulated && cacheStatus === 'idle') {
      refreshCache();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Load first page whenever category changes (idle mode)
  const loadBrowsePage = useCallback(
    async (category: string | null, offset: number, replace: boolean) => {
      if (browseLoading) return;
      setBrowseLoading(true);
      try {
        const { words, hasMore } = await getCategoryWords(category, offset);
        setBrowseWords((prev) => (replace ? words : [...prev, ...words]));
        setBrowseHasMore(hasMore);
      } finally {
        setBrowseLoading(false);
      }
    },
    [browseLoading],
  );

  useEffect(() => {
    // Reset and reload when category changes
    browseOffsetRef.current = 0;
    browseCategory.current = selectedCategory;
    setBrowseWords([]);
    setBrowseHasMore(false);
    loadBrowsePage(selectedCategory, 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  function handleLoadMore() {
    if (!browseHasMore || browseLoading) return;
    const nextOffset = browseOffsetRef.current + 20;
    browseOffsetRef.current = nextOffset;
    loadBrowsePage(selectedCategory, nextOffset, false);
  }

  const { results, status, errorMsg, isOffline, retry } = useWordSearch(
    debouncedQuery,
    selectedCategory,
  );
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();

  function handleClear() {
    setQuery('');
  }

  function handleCardPress(id: string) {
    router.push({ pathname: '/dictionary/[wordId]', params: { wordId: id } });
  }

  function handleBookmarkToggle(entry: WordEntry) {
    if (bookmarkedIds.has(entry.id)) {
      removeBookmark(entry.id);
    } else {
      addBookmark(entry);
    }
  }

  const isSearchActive = debouncedQuery.length >= 1;

  function renderListEmpty() {
    if (isSearchActive) {
      if (status === 'loading') return <SkeletonList count={3} />;
      if (status === 'empty') return <SearchEmptyState query={debouncedQuery} />;
      if (status === 'error')
        return (
          <SearchErrorState message={errorMsg ?? undefined} onRetry={retry} isOffline={isOffline} />
        );
    } else {
      if (browseLoading) return <SkeletonList count={5} />;
    }
    return null;
  }

  function renderFooter() {
    if (!browseHasMore && !browseLoading) return null;
    if (browseLoading && browseWords.length > 0) {
      return (
        <View className="py-6 items-center">
          <ActivityIndicator color="#C89A3A" />
        </View>
      );
    }
    return null;
  }

  const listData = isSearchActive ? (status === 'success' ? results : []) : browseWords;

  const listHeader =
    isSearchActive && status === 'success' && results.length > 0 ? (
      <ResultsCountLabel count={results.length} query={debouncedQuery} />
    ) : !isSearchActive && browseWords.length > 0 ? (
      <View className="px-5 pt-3 pb-1">
        <Text className="text-brown-400 text-xs">
          {browseHasMore ? `แสดง ${browseWords.length} คำ` : `ทั้งหมด ${browseWords.length} คำ`}
        </Text>
      </View>
    ) : null;

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* First-launch download modal */}
      <DownloadProgressModal
        visible={cacheStatus === 'downloading'}
        progress={progress}
        wordCount={wordCount > 0 ? wordCount : undefined}
      />

      {/* Offline banners */}
      {!isConnected && isPopulated && <OfflineBanner hasCache />}
      {!isConnected && !isPopulated && (
        <OfflineBanner hasCache={false} onDownloadWhenOnline={initializeCache} />
      )}

      {/* Background sync indicator */}
      {cacheStatus === 'syncing' && <SyncingBanner progress={progress} />}

      {/* Header + Search bar + Category chips */}
      <View className="bg-cream-50 border-b border-cream-300">
        <View className="px-5 pt-3 pb-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold text-brown-900">พจนานุกรมแต้จิ๋ว</Text>
            <Pressable
              onPress={() => router.push('/dictionary/saved')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              hitSlop={8}
              accessibilityLabel="คำที่บันทึกไว้"
              accessibilityRole="button"
            >
              <Ionicons
                name={bookmarkedIds.size > 0 ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="#C9A84C"
              />
            </Pressable>
          </View>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={handleClear}
            isLoading={isSearchActive && status === 'loading'}
          />
        </View>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </View>

      {/* Results */}
      <View className="flex-1">
        <FlatList<WordEntry>
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordResultCard
              entry={item}
              query={isSearchActive ? debouncedQuery : ''}
              onPress={handleCardPress}
              isBookmarked={bookmarkedIds.has(item.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={renderListEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          onScroll={({ nativeEvent }) => setShowScrollTop(nativeEvent.contentOffset.y > 300)}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          windowSize={5}
        />

        {/* Scroll-to-top FAB */}
        {showScrollTop && (
          <Pressable
            onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            className="absolute bottom-6 right-5 w-11 h-11 rounded-full bg-gold-500 items-center justify-center shadow-md"
            accessibilityLabel="เลื่อนกลับด้านบน"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-up" size={22} color="#fff" />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
