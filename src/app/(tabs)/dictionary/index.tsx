import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SearchBar } from '../../../components/dictionary/SearchBar';
import { WordResultCard } from '../../../components/dictionary/WordResultCard';
import { SkeletonList } from '../../../components/dictionary/SkeletonList';
import { SearchEmptyState } from '../../../components/dictionary/SearchEmptyState';
import { SearchErrorState } from '../../../components/dictionary/SearchErrorState';
import { ResultsCountLabel } from '../../../components/dictionary/ResultsCountLabel';
import { useDebounce } from '../../../hooks/useDebounce';
import { useWordSearch } from '../../../hooks/useWordSearch';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { getRandomWords } from '../../../services/supabase/words';
import type { WordEntry } from '../../../types/dictionary';

export default function DictionaryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), 300);
  const [randomWords, setRandomWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    getRandomWords(10).then(setRandomWords);
  }, []);
  const { results, status, errorMsg, isOffline, retry } = useWordSearch(debouncedQuery);
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

  function renderListEmpty() {
    if (status === 'loading') return <SkeletonList count={3} />;
    if (status === 'empty') return <SearchEmptyState query={debouncedQuery} />;
    if (status === 'error')
      return (
        <SearchErrorState message={errorMsg ?? undefined} onRetry={retry} isOffline={isOffline} />
      );
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/dictionary/saved')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              })}
              accessibilityLabel="คำที่บันทึกไว้"
              accessibilityRole="button"
            >
              <Ionicons
                name={bookmarkedIds.size > 0 ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color="#C9A84C"
              />
            </Pressable>
          ),
        }}
      />

      {/* Header + Search bar */}
      <View className="px-5 pb-3 bg-cream-50 border-b border-cream-300">
        <Text className="text-2xl font-bold text-brown-900">พจนานุกรมแต้จิ๋ว</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={handleClear}
          isLoading={status === 'loading'}
        />
      </View>

      {/* Results */}
      <FlatList<WordEntry>
        data={status === 'success' ? results : status === 'idle' ? randomWords : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordResultCard
            entry={item}
            query={debouncedQuery}
            onPress={handleCardPress}
            isBookmarked={bookmarkedIds.has(item.id)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}
        ListHeaderComponent={
          status === 'success' && results.length > 0 ? (
            <ResultsCountLabel count={results.length} query={debouncedQuery} />
          ) : null
        }
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
}
