import React from 'react';
import { View, Text } from 'react-native';

interface CategoryBadgeProps {
  label: string;
}

export function CategoryBadge({ label }: CategoryBadgeProps) {
  return (
    <View
      className="self-start bg-gold-200 px-2 py-0.5 rounded-[6px]"
      accessibilityLabel={`หมวดหมู่: ${label}`}
    >
      <Text className="text-xs font-medium text-gold-700">{label}</Text>
    </View>
  );
}
