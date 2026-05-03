import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLessonStore } from '../../../stores/lessonStore';
import { UnlockAnimation } from '../../../components/lesson/UnlockAnimation';
import { LESSONS } from '../../../services/lessons';

function getScoreMessage(score: number): { emoji: string; title: string } {
  if (score === 100) return { emoji: '🏆', title: 'เยี่ยมเลย! สมบูรณ์แบบ!' };
  if (score >= 80) return { emoji: '😄', title: 'เก่งมาก! เกือบเต็มแล้ว' };
  if (score >= 60) return { emoji: '💪', title: 'ดีขึ้นเรื่อยๆ! ลองอีกสักนิด' };
  if (score >= 40) return { emoji: '📚', title: 'พยายามต่อไป! ลองทบทวน Flashcard ก่อน' };
  return { emoji: '😅', title: 'ไม่เป็นไร! กลับไปทบทวน Flashcard แล้วลองใหม่' };
}

function formatTime(min: number, sec: number): string {
  if (min === 0) return `${sec} วินาที`;
  return `${min} นาที ${sec} วินาที`;
}

export default function QuizSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    deckTitle?: string;
    totalQuestions?: string;
    correctCount?: string;
    incorrectCount?: string;
    score?: string;
    incorrectWordIds?: string;
    totalMin?: string;
    totalSec?: string;
    category?: string;
    lessonId?: string;
    wordIds?: string;
  }>();

  const deckTitle = params.deckTitle ?? 'Quiz';
  const totalQuestions = Number(params.totalQuestions ?? 0);
  const correctCount = Number(params.correctCount ?? 0);
  const incorrectCount = Number(params.incorrectCount ?? 0);
  const score = Number(params.score ?? 0);
  const incorrectWordIds = params.incorrectWordIds
    ? params.incorrectWordIds.split(',').filter(Boolean)
    : [];
  const totalMin = Number(params.totalMin ?? 0);
  const totalSec = Number(params.totalSec ?? 0);
  const category = params.category ?? '';
  const lessonId = params.lessonId ?? '';
  const wordIds = params.wordIds ?? '';

  const { setQuizScore, isUnlocked } = useLessonStore();
  const [unlockVisible, setUnlockVisible] = useState(false);
  const [unlockedTitle, setUnlockedTitle] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    const lessonIds = LESSONS.map((l) => l.id);
    const wasUnlocked = isUnlocked(lessonIds[lessonIds.indexOf(lessonId) + 1] ?? '', lessonIds);
    setQuizScore(lessonId, score);
    // After saving score, check if the NEXT lesson just became unlocked
    const idx = lessonIds.indexOf(lessonId);
    const nextLesson = LESSONS[idx + 1];
    if (nextLesson && !wasUnlocked && score >= 60) {
      setUnlockedTitle(nextLesson.title);
      setTimeout(() => setUnlockVisible(true), 600);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { emoji, title } = getScoreMessage(score);

  const scoreColor = score >= 80 ? '#4A7C59' : score >= 60 ? '#C9A84C' : '#B5451B';

  function handleRetryIncorrect() {
    if (incorrectWordIds.length < 4) {
      router.replace({
        pathname: '/learn/flashcard',
        params: {
          deckTitle: 'ทบทวนคำที่ผิด',
          unknownWordIds: incorrectWordIds.join(','),
          category,
          lessonId,
          wordIds,
        },
      });
    } else {
      router.replace({
        pathname: '/learn/quiz',
        params: {
          deckTitle: 'Quiz (เฉพาะคำที่ผิด)',
          wordIds: incorrectWordIds.join(','),
          category,
          lessonId,
        },
      });
    }
  }

  function handleRetryFlashcard() {
    router.replace({
      pathname: '/learn/flashcard',
      params: {
        deckTitle: 'ทบทวนคำที่ผิด',
        unknownWordIds: incorrectWordIds.join(','),
        category,
        lessonId,
        wordIds,
      },
    });
  }

  function handleGoBack() {
    router.push('/learn');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <UnlockAnimation
        visible={unlockVisible}
        unlockedTitle={unlockedTitle}
        onDismiss={() => {
          setUnlockVisible(false);
          router.push('/learn');
        }}
      />
      {/* Header */}
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2C1A0E' }}>สรุปผล Quiz</Text>
        <Pressable
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          onPress={handleGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="ปิด"
        >
          <Ionicons name="close" size={20} color="#A08060" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Emoji + Title */}
        <View style={{ marginTop: 24, marginBottom: 8 }}>
          <Text style={{ fontSize: 64, textAlign: 'center' }}>{emoji}</Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#2C1A0E',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        {/* Score Card */}
        <View
          style={{
            backgroundColor: '#F5EDD8',
            borderWidth: 1,
            borderColor: '#D9C9A8',
            borderRadius: 14,
            padding: 20,
            marginTop: 20,
            width: '100%',
          }}
        >
          {/* Circular score display */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 8,
                borderColor: scoreColor,
                backgroundColor: '#FAF6EE',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#2C1A0E' }}>{score}%</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#A08060', marginTop: 8 }}>
              {correctCount}/{totalQuestions} ข้อ
            </Text>
          </View>

          {/* Stats */}
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="checkmark-circle" size={16} color="#4A7C59" />
                <Text style={{ fontSize: 14, color: '#2C1A0E' }}>ถูก</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#4A7C59' }}>
                {correctCount} ข้อ
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="close-circle" size={16} color="#B5451B" />
                <Text style={{ fontSize: 14, color: '#2C1A0E' }}>ผิด</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#B5451B' }}>
                {incorrectCount} ข้อ
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time-outline" size={16} color="#4A6FA5" />
                <Text style={{ fontSize: 14, color: '#2C1A0E' }}>เวลารวม</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1A0E' }}>
                {formatTime(totalMin, totalSec)}
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={{ width: '100%', marginTop: 20, gap: 10 }}>
          {/* Retry incorrect (primary) — only if there are incorrect answers */}
          {incorrectCount > 0 && (
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: '#B5451B',
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 10,
                alignItems: 'center',
                minHeight: 52,
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={handleRetryIncorrect}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FAF6EE' }}>
                {incorrectCount < 4
                  ? 'ทบทวน Flashcard (คำที่ผิด)'
                  : `ทำ Quiz อีกครั้ง (${incorrectCount} คำที่ผิด)`}
              </Text>
            </Pressable>
          )}

          {score === 100 && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                color: '#4A7C59',
                paddingVertical: 8,
              }}
            >
              ยอดเยี่ยม! คุณตอบถูกทุกข้อ 🎉
            </Text>
          )}

          {/* Review flashcard — only if incorrect answers exist */}
          {incorrectCount > 0 && incorrectCount >= 4 && (
            <Pressable
              style={({ pressed }) => ({
                borderWidth: 1.5,
                borderColor: '#C9A84C',
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 10,
                alignItems: 'center',
                minHeight: 52,
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={handleRetryFlashcard}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#9A7A2E' }}>
                ทบทวน Flashcard (คำที่ผิด)
              </Text>
            </Pressable>
          )}

          {/* Back to learn */}
          <Pressable
            style={({ pressed }) => ({
              paddingVertical: 14,
              alignItems: 'center',
              minHeight: 52,
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
            onPress={handleGoBack}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 16, color: '#7A5C38' }}>กลับหน้าเรียนรู้</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
