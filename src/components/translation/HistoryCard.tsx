import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { HistoryEntry } from '../../types/translation';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { UnverifiedBadge } from './UnverifiedBadge';

const LANG_FLAG: Record<string, string> = { th: '🇹🇭', zh: '🇨🇳', en: '🇬🇧' };

interface HistoryCardProps {
  entry: HistoryEntry;
  onPress: () => void;
}

export function HistoryCard({ entry, onPress }: HistoryCardProps) {
  const { result } = entry;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#EDE0C4' : '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 64,
      })}
      accessibilityLabel={`${entry.input_text} แปลว่า ${result.teochew_char ?? '—'}`}
      accessibilityRole="button"
      accessibilityHint="กดเพื่อดูผลแปลอีกครั้ง"
    >
      {/* Main row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#2C1A0E' }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {entry.input_text}
        </Text>
        <Text style={{ color: '#A08060' }}>→</Text>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E' }} numberOfLines={1}>
          {result.teochew_char ?? '—'}
        </Text>
      </View>

      {/* Detail row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        {result.pengim && (
          <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#9A7A2E' }}>
            {result.pengim}
          </Text>
        )}
        {result.pengim && <Text style={{ color: '#A08060' }}>·</Text>}
        <Text style={{ fontSize: 15 }}>{LANG_FLAG[entry.detected_lang]}</Text>
        <Text style={{ fontSize: 12, color: '#A08060' }}>🎮 แต้จิ๋ว</Text>
      </View>

      {/* Meta row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text style={{ fontSize: 11, color: '#A08060' }}>
          {formatRelativeTime(entry.translated_at)}
        </Text>
        {!result.verified && <UnverifiedBadge compact />}
      </View>
    </Pressable>
  );
}
