import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { HistoryEntry } from '../../types/translation';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

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
    <View style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        accessibilityLabel={`${result.input_text} แปลว่า ${result.output_text}`}
        accessibilityRole="button"
        accessibilityHint="กดเพื่อดูผลแปลอีกครั้ง"
      >
        <View style={styles.card}>
          {/* Main row */}
          <View style={styles.mainRow}>
            <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">
              {result.input_text}
            </Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.outputText} numberOfLines={1} ellipsizeMode="tail">
              {result.output_text}
            </Text>
          </View>

          {/* Detail row */}
          <View style={styles.detailRow}>
            <Text style={styles.pairFlags}>
              {LANG_FLAG[result.source_lang]} → {LANG_FLAG[result.target_lang]}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(entry.translated_at)}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#F5EDD8',
    borderWidth: 1,
    borderColor: '#D9C9A8',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 64,
    gap: 6,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  arrow: {
    color: '#A08060',
    fontSize: 14,
  },
  outputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1A0E',
    textAlign: 'right',
    fontFamily: 'Sarabun',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pairFlags: {
    fontSize: 14,
    color: '#A08060',
  },
  time: {
    fontSize: 11,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
});
