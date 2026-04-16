import React from 'react';
import { View, Text } from 'react-native';

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  const displayQuery = query.length > 20 ? `${query.slice(0, 20)}…` : query;

  return (
    <View
      className="flex-1 items-center justify-center px-8 mt-12"
      accessibilityLiveRegion="polite"
    >
      <Text className="text-[56px] leading-none mb-4">🔍</Text>
      <Text className="text-base font-semibold text-gray-900 dark:text-[#F2F2F7] text-center">
        ไม่พบคำว่า "{displayQuery}"
      </Text>
      <Text className="text-sm text-gray-500 dark:text-[#8E8E93] text-center mt-2 max-w-[240px]">
        ลองค้นหาด้วยภาษาอื่น หรือตรวจสอบการสะกด
      </Text>
    </View>
  );
}
