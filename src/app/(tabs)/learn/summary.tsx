import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLessonStore } from '../../../stores/lessonStore';
import { useXPStore } from '../../../stores/xpStore';
import { RewardQueue } from '../../../components/xp/RewardQueue';

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    deckTitle?: string;
    total?: string;
    knownCount?: string;
    unknownCount?: string;
    avgSec?: string;
    unknownWordIds?: string;
    category?: string;
    lessonId?: string;
    wordIds?: string;
  }>();

  const deckTitle = params.deckTitle ?? 'Flashcard';
  const total = Number(params.total ?? 0);
  const knownCount = Number(params.knownCount ?? 0);
  const unknownCount = Number(params.unknownCount ?? 0);
  const avgSec = Number(params.avgSec ?? 0);
  const unknownWordIds = params.unknownWordIds
    ? params.unknownWordIds.split(',').filter(Boolean)
    : [];
  const category = params.category ?? null;
  const lessonId = params.lessonId ?? '';
  const wordIds = params.wordIds ?? '';

  const { setFlashcardDone } = useLessonStore();
  const { awardXP } = useXPStore();

  useEffect(() => {
    if (lessonId) {
      setFlashcardDone(lessonId);
      if (lessonId !== 'lesson-family-phrases') {
        setTimeout(() => {
          awardXP('flashcard_complete', { lessonId });
        }, 500);
      }
    } else {
      setTimeout(() => {
        awardXP('flashcard_complete');
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const knownPct = total > 0 ? Math.round((knownCount / total) * 100) : 0;
  const unknownPct = total > 0 ? Math.round((unknownCount / total) * 100) : 0;

  const isExcellent = knownPct >= 80;
  const isGood = knownPct >= 50;

  const heroEmoji = isExcellent ? '🎉' : isGood ? '👍' : '💪';
  const heroTitle = isExcellent ? 'เก่งมาก!' : isGood ? 'ทำได้ดี!' : 'ไม่เป็นไร ลองอีกครั้ง!';
  const heroSub = isExcellent ? `คุณจำได้ครบ ${knownCount} คำแล้ว` : `คุณฝึกครบ ${total} คำแล้ว`;

  const accentColor = isExcellent ? '#4A7C59' : isGood ? '#C9A84C' : '#B5451B';

  function handleRetryUnknown() {
    router.replace({
      pathname: '/learn/flashcard',
      params: {
        deckTitle: 'ทบทวนอีกครั้ง',
        unknownWordIds: unknownWordIds.join(','),
        category: category ?? '',
      },
    });
  }

  function handleGoBack() {
    router.push('/learn');
  }

  function handleStartQuiz() {
    router.push({
      pathname: '/learn/quiz',
      params: { deckTitle, category: category ?? '', lessonId, wordIds },
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <RewardQueue />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>สรุปการฝึก</Text>
        <Pressable
          onPress={handleGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="ปิด"
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={20} color="#A08060" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.heroBanner, { backgroundColor: `${accentColor}12` }]}>
          <Text style={styles.heroEmoji}>{heroEmoji}</Text>
          <Text style={[styles.heroTitle, { color: accentColor }]}>{heroTitle}</Text>
          <Text style={styles.heroSub}>{heroSub}</Text>
        </View>

        {/* Score ring card */}
        <View style={styles.scoreCard}>
          <View style={[styles.scoreRing, { borderColor: accentColor }]}>
            <Text style={[styles.scoreNum, { color: accentColor }]}>{knownPct}%</Text>
          </View>

          <View style={styles.statsList}>
            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <Ionicons name="checkmark-circle" size={18} color="#4A7C59" />
                <Text style={styles.statsLabel}>จำได้</Text>
              </View>
              <Text style={styles.statsValue}>
                {knownCount} คำ <Text style={styles.statsPct}>({knownPct}%)</Text>
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <Ionicons name="close-circle" size={18} color="#B5451B" />
                <Text style={styles.statsLabel}>ต้องทบทวน</Text>
              </View>
              <Text style={styles.statsValue}>
                {unknownCount} คำ <Text style={styles.statsPct}>({unknownPct}%)</Text>
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <Ionicons name="time-outline" size={18} color="#4A6FA5" />
                <Text style={styles.statsLabel}>เวลาเฉลี่ย</Text>
              </View>
              <Text style={styles.statsValue}>{avgSec} วินาที/คำ</Text>
            </View>
          </View>
        </View>

        {/* CTA section */}
        <View style={styles.ctaSection}>
          {unknownCount === 0 ? (
            <View style={styles.perfectBadge}>
              <Ionicons name="star" size={16} color="#4A7C59" />
              <Text style={styles.perfectText}>ยอดเยี่ยม! คุณจำได้ทุกคำ</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleRetryUnknown}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              accessibilityRole="button"
            >
              <View style={styles.btnRetry}>
                <Ionicons name="refresh" size={18} color="#FAF6EE" />
                <Text style={styles.btnRetryText}>ทบทวนคำที่จำไม่ได้ ({unknownCount} คำ)</Text>
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={handleStartQuiz}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            accessibilityRole="button"
          >
            <View style={styles.btnQuiz}>
              <Ionicons name="trophy-outline" size={18} color="#2C1A0E" />
              <Text style={styles.btnQuizText}>ทำ Quiz ต่อเลย! 🧠</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleGoBack}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            accessibilityRole="button"
          >
            <View style={styles.btnBack}>
              <Text style={styles.btnBackText}>กลับหน้าเรียนรู้</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0C4',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 16,
  },
  heroBanner: {
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 6,
  },
  heroEmoji: {
    fontSize: 56,
    lineHeight: 64,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'Sarabun',
    letterSpacing: 0.2,
  },
  heroSub: {
    fontSize: 14,
    color: '#6B4C2A',
    fontFamily: 'Sarabun',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 8,
    backgroundColor: '#FDFAF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  statsList: {
    width: '100%',
    gap: 0,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statsLabel: {
    fontSize: 14,
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  statsPct: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A08060',
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#F0E8D8',
  },
  ctaSection: {
    gap: 10,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C4DECE',
  },
  perfectText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A7C59',
    fontFamily: 'Sarabun',
  },
  btnRetry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B5451B',
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnRetryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FAF6EE',
    fontFamily: 'Sarabun',
  },
  btnQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A84C',
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnQuizText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  btnBack: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  btnBackText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C9A84C',
    fontFamily: 'Sarabun',
  },
});
