import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { FestivalEvent } from '../../data/mockFestivals';
import { getDaysUntilFestival } from '../../data/mockFestivals';

interface Props {
  festival: FestivalEvent;
}

export function FestivalCountdownBanner({ festival }: Props) {
  const router = useRouter();
  const today = new Date();
  const days = getDaysUntilFestival(today, festival);

  const isToday = days === 0;
  const isTomorrow = days === 1;

  // Compute festival date label
  const thisYear = today.getFullYear();
  const festDate = new Date(thisYear, festival.month - 1, festival.day);
  if (festDate < today) festDate.setFullYear(thisYear + 1);
  const datePart = festDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  const weekdayPart = festDate.toLocaleDateString('th-TH', { weekday: 'short' });

  function handlePress() {
    if (festival.article_id) {
      router.push(`/culture/${festival.article_id}` as any);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      {/* Top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: festival.accent_color }]} />

      <View style={styles.body}>
        {/* Left: label + title + date */}
        <View style={styles.textBlock}>
          <Text style={styles.upcomingLabel}>เทศกาลที่กำลังถึง</Text>
          <Text style={styles.title} numberOfLines={1}>
            {festival.title_th}
          </Text>
          <Text style={styles.dateRow}>
            <Text style={styles.teochewChar}>{festival.title_teochew_char}</Text>
            <Text style={styles.dateText}> · {datePart}</Text>
          </Text>
        </View>

        {/* Right: countdown */}
        <View style={[styles.countdownBlock, { backgroundColor: `${festival.accent_color}18` }]}>
          {isToday ? (
            <>
              <Text style={styles.countdownEmoji}>🎉</Text>
              <Text style={[styles.countdownUnit, { color: festival.accent_color }]}>วันนี้!</Text>
            </>
          ) : (
            <>
              <Text style={[styles.countdownNum, { color: festival.accent_color }]}>{days}</Text>
              <Text style={[styles.countdownUnit, { color: festival.accent_color }]}>
                {isTomorrow ? 'พรุ่งนี้' : 'วันอีก'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  accentBar: {
    height: 4,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  upcomingLabel: {
    fontSize: 11,
    color: '#A08060',
    fontFamily: 'Sarabun',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 24,
  },
  dateRow: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
    marginTop: 2,
  },
  teochewChar: {
    fontSize: 13,
    color: '#6B4C2A',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  countdownBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 60,
    flexShrink: 0,
  },
  countdownNum: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
    textAlign: 'center',
  },
  countdownEmoji: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  countdownUnit: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Sarabun',
    textAlign: 'center',
    marginTop: 1,
  },
});
