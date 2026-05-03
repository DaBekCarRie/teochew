import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { LESSONS, getLessonWords } from '../../../../services/lessons';
import { useLessonStore } from '../../../../stores/lessonStore';

const CARD_SHADOW = {
  shadowColor: '#2C1A0E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

export default function LessonIntroScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { getProgress } = useLessonStore();

  const lesson = LESSONS.find((l) => l.id === lessonId);

  // Always call hooks before any early return
  const words = useMemo(() => (lesson ? getLessonWords(lesson) : []), [lesson]);
  const progress = getProgress(lessonId ?? '');
  const score = progress.quizBestScore;
  const isCompleted = (score ?? -1) >= 60;

  if (!lesson) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FAF6EE',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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

  function handleBack() {
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
        }}
      >
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="ย้อนกลับ"
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="arrow-back" size={22} color="#A08060" />
        </Pressable>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1A0E' }}>บทเรียน</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View
          style={[
            {
              backgroundColor: '#F5EDD8',
              borderWidth: 1.5,
              borderColor: '#D9C9A8',
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              marginBottom: 20,
            },
            CARD_SHADOW,
          ]}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#C9A84C',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Ionicons name={lesson.icon as any} size={30} color="#FAF6EE" />
          </View>

          <Text style={{ fontSize: 22, fontWeight: '800', color: '#2C1A0E', marginBottom: 4 }}>
            {lesson.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#A08060' }}>{lesson.subtitle}</Text>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E' }}>
                {words.length}
              </Text>
              <Text style={{ fontSize: 11, color: '#A08060' }}>คำศัพท์</Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#D9C9A8' }} />
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: score !== null ? (score >= 60 ? '#4A7C59' : '#B5451B') : '#A08060',
                }}
              >
                {score !== null ? `${score}%` : '-'}
              </Text>
              <Text style={{ fontSize: 11, color: '#A08060' }}>คะแนนสูงสุด</Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#D9C9A8' }} />
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={
                  isCompleted
                    ? 'checkmark-circle'
                    : progress.flashcardDone
                      ? 'albums'
                      : 'ellipse-outline'
                }
                size={22}
                color={isCompleted ? '#4A7C59' : progress.flashcardDone ? '#C9A84C' : '#C8B88A'}
              />
              <Text style={{ fontSize: 11, color: '#A08060' }}>สถานะ</Text>
            </View>
          </View>
        </View>

        {/* Word preview */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: '#A08060',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          คำศัพท์ในบทเรียน
        </Text>

        <View
          style={{
            backgroundColor: '#FAF6EE',
            borderWidth: 1,
            borderColor: '#D9C9A8',
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          {words.map((word, idx) => (
            <View
              key={word.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: idx > 0 ? 1 : 0,
                borderTopColor: '#EDE0C4',
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#2C1A0E', width: 48 }}>
                {word.teochew_char}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: '#6B4F2A', fontStyle: 'italic' }}>
                  {word.teochew_pengim}
                </Text>
                <Text style={{ fontSize: 13, color: '#A08060' }}>{word.thai_meaning}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ gap: 12 }}>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#B8962E' : '#C9A84C',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              opacity: pressed ? 0.9 : 1,
            })}
            onPress={startFlashcard}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1A0E' }}>
              {progress.flashcardDone ? 'ทบทวน Flashcard อีกครั้ง' : 'เริ่ม Flashcard →'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#A03510' : '#B5451B',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              opacity: progress.flashcardDone ? (pressed ? 0.9 : 1) : 0.45,
            })}
            onPress={progress.flashcardDone ? startQuiz : undefined}
            disabled={!progress.flashcardDone}
            accessibilityRole="button"
            accessibilityLabel={progress.flashcardDone ? 'เริ่ม Quiz' : 'ทำ Flashcard ให้เสร็จก่อน'}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FAF6EE' }}>
              {score !== null ? `ทำ Quiz อีกครั้ง (ดีสุด ${score}%)` : 'เริ่ม Quiz →'}
            </Text>
          </Pressable>

          {!progress.flashcardDone && (
            <Text style={{ textAlign: 'center', fontSize: 12, color: '#C8B88A' }}>
              ทำ Flashcard ให้เสร็จก่อนจึงจะเริ่ม Quiz ได้
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
