import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { WordEntry } from '../../types/dictionary';
import { HighlightText } from './HighlightText';
import { CategoryBadge } from './CategoryBadge';
import { VerifiedBadge } from './VerifiedBadge';

interface WordResultCardProps {
  entry: WordEntry;
  query: string;
  onPress: (id: string) => void;
}

export function WordResultCard({ entry, query, onPress }: WordResultCardProps) {
  return (
    <Pressable
      className="bg-white dark:bg-[#2C2C2E] rounded-xl p-3 mb-2 mx-4 shadow-sm"
      onPress={() => onPress(entry.id)}
      accessibilityLabel={`${entry.teochew_char} แปลว่า ${entry.thai_meaning}`}
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}
    >
      {/* ROW 1: teochew_char + verified badge */}
      <View className="flex-row items-center justify-between">
        <HighlightText
          text={entry.teochew_char}
          query={query}
          textClassName="text-[28px] font-bold text-gray-900 dark:text-[#F2F2F7]"
          highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
        />
        {entry.verified && <VerifiedBadge />}
      </View>

      {/* ROW 2: Peng'im */}
      <HighlightText
        text={entry.teochew_pengim}
        query={query}
        textClassName="text-sm italic text-gray-500 dark:text-[#8E8E93] mt-0.5"
        highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
      />

      {/* Divider */}
      <View className="border-t border-gray-100 dark:border-[#3A3A3C] my-2" />

      {/* ROW 3: Thai + English meanings */}
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1 flex-1">
          <Text className="text-sm">🇹🇭</Text>
          <HighlightText
            text={entry.thai_meaning}
            query={query}
            textClassName="text-[15px] text-gray-900 dark:text-[#F2F2F7] flex-1"
            highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
          />
        </View>
        <View className="flex-row items-center gap-1 flex-1">
          <Text className="text-sm">🇬🇧</Text>
          <HighlightText
            text={entry.english_meaning}
            query={query}
            textClassName="text-[15px] text-gray-900 dark:text-[#F2F2F7] flex-1"
            highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
          />
        </View>
      </View>

      {/* ROW 4: Mandarin */}
      {(entry.mandarin_char || entry.mandarin_pinyin) && (
        <View className="flex-row items-center gap-2 mt-1">
          {entry.mandarin_char && (
            <HighlightText
              text={entry.mandarin_char}
              query={query}
              textClassName="text-sm text-gray-500 dark:text-[#8E8E93]"
              highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
            />
          )}
          {entry.mandarin_pinyin && (
            <HighlightText
              text={entry.mandarin_pinyin}
              query={query}
              textClassName="text-sm text-gray-500 dark:text-[#8E8E93]"
              highlightClassName="bg-[#FFF0EC] dark:bg-[#3D1A12] text-[#C84B31] dark:text-[#E8705A] font-semibold"
            />
          )}
        </View>
      )}

      {/* Divider before badge */}
      {entry.category && <View className="border-t border-gray-100 dark:border-[#3A3A3C] my-2" />}

      {/* ROW 5: Category badge */}
      {entry.category && <CategoryBadge label={entry.category} />}
    </Pressable>
  );
}
