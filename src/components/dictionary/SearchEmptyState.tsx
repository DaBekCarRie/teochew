import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <Ionicons name="search-outline" size={56} color="#E8D5A3" />
      <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
        ไม่พบคำว่า "{displayQuery}"
      </Text>
      <Text className="text-sm text-brown-400 text-center mt-2" style={{ maxWidth: 240 }}>
        ลองค้นหาด้วยภาษาอื่น หรือตรวจสอบการสะกด
      </Text>
    </View>
  );
}
