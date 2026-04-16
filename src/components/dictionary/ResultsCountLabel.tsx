import React from 'react';
import { Text } from 'react-native';

interface ResultsCountLabelProps {
  count: number;
  query: string;
}

export function ResultsCountLabel({ count, query }: ResultsCountLabelProps) {
  return (
    <Text
      className="text-[13px] font-medium text-gray-500 dark:text-[#8E8E93] px-4 py-1"
      accessibilityLiveRegion="polite"
    >
      พบ {count} คำ สำหรับ "{query}"
    </Text>
  );
}
