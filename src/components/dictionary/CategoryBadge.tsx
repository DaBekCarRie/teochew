import React from 'react';
import { View, Text } from 'react-native';

interface CategoryBadgeProps {
  label: string;
}

export function CategoryBadge({ label }: CategoryBadgeProps) {
  return (
    <View
      className="self-start bg-[#EFF6FF] dark:bg-[#1E3A5F] px-2 py-0.5 rounded-lg"
      accessibilityLabel={`หมวดหมู่: ${label}`}
    >
      <Text className="text-xs font-medium text-[#1D4ED8] dark:text-[#93C5FD]">{label}</Text>
    </View>
  );
}
