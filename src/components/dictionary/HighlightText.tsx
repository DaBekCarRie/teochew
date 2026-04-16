import React from 'react';
import { Text } from 'react-native';
import { splitHighlight } from '../../utils/highlight';

interface HighlightTextProps {
  text: string;
  query: string;
  textClassName?: string;
  highlightClassName?: string;
}

export function HighlightText({
  text,
  query,
  textClassName = 'text-gray-900 dark:text-[#F2F2F7]',
  highlightClassName = 'bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold',
}: HighlightTextProps) {
  const segments = splitHighlight(text, query);

  return (
    <Text className={textClassName}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <Text key={i} className={highlightClassName}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        ),
      )}
    </Text>
  );
}
