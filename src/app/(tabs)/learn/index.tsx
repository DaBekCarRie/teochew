import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LessonCard } from '../../../components/lesson/LessonCard';
import { LESSONS } from '../../../services/lessons';
import { useLessonStore } from '../../../stores/lessonStore';
import type { LessonState } from '../../../types/dictionary';

export default function LearnScreen() {
  const router = useRouter();
  const { getProgress, hydrate } = useLessonStore();

  useEffect(() => {
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getLessonState(lessonId: string): LessonState {
    const p = getProgress(lessonId);
    if ((p.quizBestScore ?? -1) >= 60) return 'completed';
    if (p.flashcardDone || p.quizBestScore !== null) return 'in_progress';
    return 'unlocked';
  }

  function handleLessonPress(lessonId: string) {
    router.push({
      pathname: '/learn/lesson/[lessonId]',
      params: { lessonId },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: '#FAF6EE',
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#2C1A0E' }}>เรียนรู้</Text>
        <Text style={{ fontSize: 14, color: '#A08060', marginTop: 2 }}>
          เรียนคำศัพท์แต้จิ๋วเป็นบทเรียน
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: '#A08060',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          บทเรียนทั้งหมด
        </Text>

        {LESSONS.map((lesson) => {
          const state = getLessonState(lesson.id);
          const progress = getProgress(lesson.id);
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              state={state}
              progress={progress}
              onPress={() => handleLessonPress(lesson.id)}
              onLockedPress={() => {}}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
