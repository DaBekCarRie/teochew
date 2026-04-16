import React from 'react';
import { Text } from 'react-native';

interface ResultsCountLabelProps {
  count: number;
  query: string;
}

export function ResultsCountLabel({ count, query }: ResultsCountLabelProps) {
  return (
    <Text className="text-xs font-medium text-brown-400 px-5 py-2" accessibilityLiveRegion="polite">
      พบ {count} คำ สำหรับ "{query}"
    </Text>
  );
}
