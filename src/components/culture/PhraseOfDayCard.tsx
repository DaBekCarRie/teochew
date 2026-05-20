import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TeochewPhrase } from '../../data/mockPhrases';

const CATEGORY_COLOR: Record<TeochewPhrase['category'], string> = {
  greeting: '#2D7A6A',
  proverb: '#6B4C2A',
  blessing: '#B5451B',
  food: '#9A7A2E',
  family: '#4A6A9A',
};

interface Props {
  phrase: TeochewPhrase;
}

export function PhraseOfDayCard({ phrase }: Props) {
  const accentColor = CATEGORY_COLOR[phrase.category];

  return (
    <View style={styles.card}>
      <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />

      <View style={styles.inner}>
        <Text style={styles.cardLabel}>วลีประจำวัน</Text>

        {/* Chars + pengim on same row */}
        <View style={styles.charRow}>
          <Text style={styles.character}>{phrase.teochew_char}</Text>
          <Text style={styles.pengim}>{phrase.teochew_pengim}</Text>
        </View>

        <Text style={styles.thaiMeaning}>{phrase.thai_meaning}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  leftAccent: {
    width: 4,
    flexShrink: 0,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    color: '#B8997A',
    fontFamily: 'Sarabun',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  charRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  character: {
    fontSize: 38,
    fontWeight: '800',
    color: '#2C1A0E',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  pengim: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#C9A84C',
    paddingBottom: 4,
  },
  thaiMeaning: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
});
