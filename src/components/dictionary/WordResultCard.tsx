import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { WordEntry } from '../../types/dictionary';
import { HighlightText } from './HighlightText';
import { CategoryBadge } from './CategoryBadge';
import { VerifiedBadge } from './VerifiedBadge';
import { BookmarkButton } from './BookmarkButton';

interface WordResultCardProps {
  entry: WordEntry;
  query: string;
  onPress: (id: string) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (entry: WordEntry) => void;
}

export function WordResultCard({
  entry,
  query,
  onPress,
  isBookmarked,
  onBookmarkToggle,
}: WordResultCardProps) {
  return (
    <Pressable
      className="bg-cream-50 border border-cream-300 rounded-[14px] p-4 mb-3 mx-5"
      onPress={() => onPress(entry.id)}
      accessibilityLabel={`${entry.teochew_char} แปลว่า ${entry.thai_meaning}`}
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(44,26,14,0.05)' }}
      style={({ pressed }) => [
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        {
          shadowColor: '#2C1A0E',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      {/* ROW 1: teochew_char + verified + bookmark */}
      <View className="flex-row items-center justify-between">
        <HighlightText
          text={entry.teochew_char}
          query={query}
          textClassName="text-[28px] font-bold text-brown-900"
          highlightClassName="bg-gold-200 text-gold-700 font-semibold"
        />
        <View className="flex-row items-center gap-1">
          {entry.verified && <VerifiedBadge />}
          {onBookmarkToggle && (
            <BookmarkButton
              wordId={entry.id}
              isBookmarked={isBookmarked ?? false}
              onToggle={() => onBookmarkToggle(entry)}
            />
          )}
        </View>
      </View>

      {/* ROW 2: Peng'im */}
      <HighlightText
        text={entry.teochew_pengim}
        query={query}
        textClassName="text-[15px] italic text-gold-700 mt-0.5"
        highlightClassName="bg-gold-200 text-gold-700 font-semibold"
      />

      {/* Divider */}
      <View className="border-t border-cream-300 my-2" />

      {/* ROW 3: Thai meaning */}
      <HighlightText
        text={entry.thai_meaning}
        query={query}
        textClassName="text-[15px] text-brown-900"
        highlightClassName="bg-gold-200 text-gold-700 font-semibold"
      />

      {/* ROW 4: English meaning */}
      <HighlightText
        text={entry.english_meaning}
        query={query}
        textClassName="text-sm text-brown-600 mt-0.5"
        highlightClassName="bg-gold-200 text-gold-700 font-semibold"
      />

      {/* ROW 5: Mandarin */}
      {(entry.mandarin_char || entry.mandarin_pinyin) && (
        <View className="flex-row items-center gap-2 mt-1.5">
          {entry.mandarin_char && (
            <HighlightText
              text={entry.mandarin_char}
              query={query}
              textClassName="text-sm text-brown-400"
              highlightClassName="bg-gold-200 text-gold-700 font-semibold"
            />
          )}
          {entry.mandarin_pinyin && (
            <HighlightText
              text={entry.mandarin_pinyin}
              query={query}
              textClassName="text-sm text-brown-400 italic"
              highlightClassName="bg-gold-200 text-gold-700 font-semibold"
            />
          )}
        </View>
      )}

      {/* Category badge */}
      {entry.category && (
        <>
          <View className="border-t border-cream-300 my-2" />
          <CategoryBadge label={entry.category} />
        </>
      )}
    </Pressable>
  );
}
