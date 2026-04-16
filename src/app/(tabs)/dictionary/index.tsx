import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import { SearchBar } from '../../../components/dictionary/SearchBar';
import { WordResultCard } from '../../../components/dictionary/WordResultCard';
import { SkeletonList } from '../../../components/dictionary/SkeletonList';
import { SearchEmptyState } from '../../../components/dictionary/SearchEmptyState';
import { SearchErrorState } from '../../../components/dictionary/SearchErrorState';
import { ResultsCountLabel } from '../../../components/dictionary/ResultsCountLabel';
import { useDebounce } from '../../../hooks/useDebounce';
import { useWordSearch } from '../../../hooks/useWordSearch';
import type { WordEntry } from '../../../types/dictionary';

export default function DictionaryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), 300);
  const { results, status, errorMsg, isOffline, retry } = useWordSearch(debouncedQuery);

  function handleClear() {
    setQuery('');
  }

  function handleCardPress(id: string) {
    router.push({ pathname: '/dictionary/[wordId]', params: { wordId: id } });
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
    <SafeAreaView className="flex-1 bg-[#F5F5F5] dark:bg-[#1C1C1E]">
      {/* Header + Search bar */}
      <View className="px-4 pt-3 pb-2 bg-white dark:bg-[#1C1C1E] border-b border-[#E5E7EB] dark:border-[#3A3A3C]">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">พจนานุกรมแต้จิ๋ว</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={handleClear}
          isLoading={status === 'loading'}
        />
      </View>

      {/* Results */}
      <FlatList<WordEntry>
        data={status === 'success' ? results : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordResultCard entry={item} query={debouncedQuery} onPress={handleCardPress} />
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
