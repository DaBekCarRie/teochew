import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FAMILY_LESSON, LESSONS, fetchLessonWords } from '../../../../services/lessons';
import { useLessonStore } from '../../../../stores/lessonStore';
import type { WordEntry } from '../../../../types/dictionary';

export default function LessonIntroScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { getProgress } = useLessonStore();

  const lesson =
    LESSONS.find((l) => l.id === lessonId) ??
    (lessonId === FAMILY_LESSON.id ? FAMILY_LESSON : undefined);

  const [words, setWords] = useState<WordEntry[]>([]);
  useEffect(() => {
    if (!lesson) return;
    fetchLessonWords(lesson.word_ids).then(setWords);
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = getProgress(lessonId ?? '');
  const score = progress.quizBestScore;
  const isCompleted = (score ?? -1) >= 60;

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#A08060' }}>ไม่พบบทเรียน</Text>
      </SafeAreaView>
    );
  }

  function startFlashcard() {
    router.push({
      pathname: '/learn/flashcard',
      params: {
        deckTitle: lesson!.title,
        category: '',
        lessonId: lesson!.id,
        wordIds: lesson!.word_ids.join(','),
      },
    });
  }

  function startQuiz() {
    router.push({
      pathname: '/learn/quiz',
      params: {
        deckTitle: lesson!.title,
        category: '',
        lessonId: lesson!.id,
        wordIds: lesson!.word_ids.join(','),
      },
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="ย้อนกลับ"
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#A08060" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroAccentBar} />
          <View style={styles.heroBody}>
            <View style={styles.heroIconRow}>
              <View style={styles.heroIconCircle}>
                <Ionicons name={lesson.icon as any} size={28} color="#FFFFFF" />
              </View>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTitle}>{lesson.title}</Text>
                <Text style={styles.heroSub}>{lesson.subtitle}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{words.length}</Text>
                <Text style={styles.statLabel}>คำศัพท์</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statNum,
                    score !== null && { color: score >= 60 ? '#4A7C59' : '#B5451B' },
                  ]}
                >
                  {score !== null ? `${score}%` : '—'}
                </Text>
                <Text style={styles.statLabel}>คะแนนสูงสุด</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons
                  name={
                    isCompleted
                      ? 'checkmark-circle'
                      : progress.flashcardDone
                        ? 'albums'
                        : 'ellipse-outline'
                  }
                  size={24}
                  color={isCompleted ? '#4A7C59' : progress.flashcardDone ? '#C9A84C' : '#C8B88A'}
                />
                <Text style={styles.statLabel}>สถานะ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Word list */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>คำศัพท์ในบทเรียน</Text>
          <Text style={styles.sectionCount}>{words.length} คำ</Text>
        </View>

        <View style={styles.wordList}>
          {words.map((word, idx) => (
            <View key={word.id} style={[styles.wordRow, idx > 0 && styles.wordRowBorder]}>
              <View style={styles.wordNumBadge}>
                <Text style={styles.wordNum}>{idx + 1}</Text>
              </View>
              <Text style={styles.wordChar}>{word.teochew_char}</Text>
              <View style={styles.wordMeta}>
                <Text style={styles.wordPengim}>{word.teochew_pengim}</Text>
                <Text style={styles.wordThai}>{word.thai_meaning}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctaSection}>
          {/* Flashcard button */}
          <Pressable
            onPress={startFlashcard}
            style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
            accessibilityRole="button"
          >
            <View style={styles.btnFlashcard}>
              <Ionicons name="albums-outline" size={20} color="#2C1A0E" />
              <Text style={styles.btnFlashcardText}>
                {progress.flashcardDone ? 'ทบทวน Flashcard อีกครั้ง' : 'เริ่ม Flashcard'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#2C1A0E" />
            </View>
          </Pressable>

          {/* Quiz button */}
          <Pressable
            onPress={progress.flashcardDone ? startQuiz : undefined}
            disabled={!progress.flashcardDone}
            style={({ pressed }) => ({
              opacity: !progress.flashcardDone ? 0.45 : pressed ? 0.88 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel={progress.flashcardDone ? 'เริ่ม Quiz' : 'ทำ Flashcard ให้เสร็จก่อน'}
          >
            <View style={[styles.btnQuiz, !progress.flashcardDone && styles.btnQuizDisabled]}>
              <Ionicons name="trophy-outline" size={20} color="#FAF6EE" />
              <Text style={styles.btnQuizText}>
                {score !== null ? `ทำ Quiz อีกครั้ง (ดีสุด ${score}%)` : 'เริ่ม Quiz'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FAF6EE" />
            </View>
          </Pressable>

          {!progress.flashcardDone && (
            <View style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={14} color="#C8B88A" />
              <Text style={styles.hintText}>ทำ Flashcard ให้เสร็จก่อนจึงจะเริ่ม Quiz ได้</Text>
            </View>
          )}
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
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0C4',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroAccentBar: {
    height: 5,
    backgroundColor: '#C9A84C',
  },
  heroBody: {
    padding: 20,
    gap: 16,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  heroSub: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FDFAF5',
    borderRadius: 14,
    paddingVertical: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C1A0E',
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 11,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EDE0C4',
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  wordList: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  wordRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0E8D8',
  },
  wordNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FAF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  wordNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A08060',
  },
  wordChar: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1A0E',
    width: 52,
    flexShrink: 0,
  },
  wordMeta: {
    flex: 1,
    gap: 2,
  },
  wordPengim: {
    fontSize: 13,
    color: '#C9A84C',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  wordThai: {
    fontSize: 13,
    color: '#6B4C2A',
    fontFamily: 'Sarabun',
  },
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  btnFlashcard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#C9A84C',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B8922E',
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  btnFlashcardText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    letterSpacing: 0.2,
  },
  btnQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#B5451B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8C3110',
    shadowColor: '#6B2510',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  btnQuizDisabled: {
    backgroundColor: '#C8906A',
    borderColor: '#B07050',
    shadowOpacity: 0.1,
  },
  btnQuizText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#FAF6EE',
    fontFamily: 'Sarabun',
    letterSpacing: 0.2,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  hintText: {
    fontSize: 12,
    color: '#C8B88A',
    fontFamily: 'Sarabun',
  },
});
