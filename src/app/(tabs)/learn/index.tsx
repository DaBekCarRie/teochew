import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LessonCard } from '../../../components/lesson/LessonCard';
import { FAMILY_LESSON, LESSONS, fetchLessons } from '../../../services/lessons';
import { useLessonStore } from '../../../stores/lessonStore';
import type { Lesson, LessonState } from '../../../types/dictionary';

export default function LearnScreen() {
  const router = useRouter();
  const { getProgress, hydrate } = useLessonStore();
  const [lessons, setLessons] = useState<Lesson[]>([FAMILY_LESSON, ...LESSONS]);

  useEffect(() => {
    hydrate();
    fetchLessons().then(setLessons);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getLessonState(lessonId: string): LessonState {
    const p = getProgress(lessonId);
    if ((p.quizBestScore ?? -1) >= 60) return 'completed';
    if (p.flashcardDone || p.quizBestScore !== null) return 'in_progress';
    return 'unlocked';
  }

  function handleLessonPress(lessonId: string) {
    router.push({ pathname: '/learn/lesson/[lessonId]', params: { lessonId } });
  }

  const completedCount = lessons.filter((l) => getLessonState(l.id) === 'completed').length;
  const inProgressCount = lessons.filter((l) => getLessonState(l.id) === 'in_progress').length;
  const wordsLearned = lessons
    .filter((l) => getLessonState(l.id) === 'completed')
    .reduce((sum, l) => sum + l.word_ids.length, 0);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>🎓</Text>
          <View>
            <Text style={styles.headerTitle}>เรียนรู้</Text>
            <Text style={styles.headerSub}>Learn Teochew</Text>
          </View>
        </View>
        <View style={styles.headerRule} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress summary card */}
        <View className="flex-row mx-5 mt-4 bg-white rounded-[18px] py-[18px] shadow-sm elevation-3 border border-cream-200">
          <View style={styles.progressStat}>
            <Text style={styles.progressNum}>{completedCount}</Text>
            <Text style={styles.progressLabel}>สำเร็จแล้ว</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={styles.progressNum}>{inProgressCount}</Text>
            <Text style={styles.progressLabel}>กำลังเรียน</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={styles.progressNum}>{wordsLearned}</Text>
            <Text style={styles.progressLabel}>คำที่เรียนแล้ว</Text>
          </View>
        </View>

        {/* Tone system entry — wrapper pattern avoids New Architecture Pressable bug */}
        <View style={styles.toneCardOuter}>
          <Pressable
            onPress={() => router.push('/learn/tones')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            accessibilityRole="button"
            accessibilityLabel="ระบบเสียงแต้จิ๋ว 8 วรรณยุกต์"
          >
            <View style={styles.toneCard}>
              <View style={styles.toneIconCircle}>
                <Ionicons name="musical-notes" size={22} color="#C9A84C" />
              </View>
              <View style={styles.toneTextBlock}>
                <Text style={styles.toneTitle}>ระบบเสียงแต้จิ๋ว</Text>
                <Text style={styles.toneSub}>8 วรรณยุกต์ พร้อม pitch diagram</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A08060" />
            </View>
          </Pressable>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>บทเรียนทั้งหมด</Text>
          <Text style={styles.sectionCount}>{lessons.length} บทเรียน</Text>
        </View>

        {/* Lesson cards */}
        <View style={styles.lessonList}>
          {lessons.map((lesson) => {
            const state = getLessonState(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                state={state}
                progress={getProgress(lesson.id)}
                onPress={() => handleLessonPress(lesson.id)}
                onLockedPress={() => {}}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // replaced
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 26,
  },
  headerSub: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
    letterSpacing: 0.5,
  },
  headerRule: {
    height: 1,
    backgroundColor: '#EDE0C4',
  },
  progressCard: {
    // replaced
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  progressNum: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2C1A0E',
    lineHeight: 30,
  },
  progressLabel: {
    fontSize: 11,
    color: '#A08060',
    fontFamily: 'Sarabun',
    textAlign: 'center',
  },
  progressDivider: {
    width: 1,
    backgroundColor: '#EDE0C4',
    marginVertical: 6,
  },
  toneCardOuter: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  toneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#C9A84C',
    gap: 12,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  toneIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF6E0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toneTextBlock: {
    flex: 1,
    gap: 2,
  },
  toneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  toneSub: {
    fontSize: 12,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    backgroundColor: '#C9A84C',
    borderRadius: 2,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    letterSpacing: 0.3,
  },
  sectionCount: {
    fontSize: 12,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  lessonList: {
    paddingHorizontal: 20,
    gap: 10,
  },
});
