import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import { LessonCard } from '../../../components/lesson/LessonCard';
import { FAMILY_LESSON, LESSONS } from '../../../services/lessons';
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
        {/* Tone diagram entry point */}
        <Pressable
          onPress={() => router.push('/learn/tones')}
          style={({ pressed }) => ({
            backgroundColor: '#F5EDD8',
            borderWidth: 1.5,
            borderColor: '#C9A84C',
            borderRadius: 14,
            padding: 14,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="ระบบเสียงแต้จิ๋ว 8 วรรณยุกต์"
        >
          <Ionicons name="musical-notes-outline" size={24} color="#C9A84C" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1A0E' }}>
              ระบบเสียงแต้จิ๋ว
            </Text>
            <Text style={{ fontSize: 13, color: '#A08060', marginTop: 2 }}>
              8 วรรณยุกต์ พร้อม pitch diagram
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#A08060" />
        </Pressable>

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

        {/* Family phrases lesson — always unlocked, no XP */}
        <LessonCard
          key={FAMILY_LESSON.id}
          lesson={FAMILY_LESSON}
          state="unlocked"
          progress={getProgress(FAMILY_LESSON.id)}
          onPress={() => handleLessonPress(FAMILY_LESSON.id)}
          onLockedPress={() => {}}
        />

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
