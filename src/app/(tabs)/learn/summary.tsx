import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLessonStore } from '../../../stores/lessonStore';

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

  // Mark flashcard as done for this lesson
  useEffect(() => {
    if (lessonId) {
      setFlashcardDone(lessonId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const knownPct = total > 0 ? Math.round((knownCount / total) * 100) : 0;
  const unknownPct = total > 0 ? Math.round((unknownCount / total) * 100) : 0;

  const title =
    knownPct >= 80 ? 'เก่งมาก! 🎉' : knownPct >= 50 ? 'ทำได้ดี!' : 'ไม่เป็นไร ลองอีกครั้ง!';

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
      params: {
        deckTitle,
        category: category ?? '',
        lessonId,
        wordIds,
      },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View className="h-14 px-5 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-brown-900">สรุปการฝึก</Text>
        <Pressable
          className="w-11 h-11 items-center justify-center"
          onPress={handleGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="ปิด"
        >
          <Ionicons name="close" size={20} color="#A08060" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration / emoji */}
        <View className="mt-8 mb-4">
          <Text style={{ fontSize: 64 }}>
            {knownPct >= 80 ? '🎉' : knownPct >= 50 ? '👍' : '💪'}
          </Text>
        </View>

        <Text className="text-2xl font-bold text-brown-900 text-center">{title}</Text>
        <Text className="text-base text-brown-400 mt-2 text-center">คุณฝึกครบ {total} คำแล้ว</Text>

        {/* Summary card */}
        <View
          className="bg-cream-100 border border-cream-300 rounded-[14px] p-5 mt-6 w-full"
          accessibilityLabel={`จำได้ ${knownCount} คำ ต้องทบทวน ${unknownCount} คำ`}
        >
          {/* Ring / percentage display */}
          <View className="items-center mb-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center border-8"
              style={{ borderColor: '#C9A84C', backgroundColor: '#FAF6EE' }}
            >
              <Text className="text-xl font-bold text-brown-900">{knownPct}%</Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#4A7C59" />
                <Text className="text-sm text-brown-900">จำได้</Text>
              </View>
              <Text className="text-sm font-semibold text-brown-900">
                {knownCount} คำ{' '}
                <Text className="text-xs font-normal text-brown-400">({knownPct}%)</Text>
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="close-circle" size={16} color="#B5451B" />
                <Text className="text-sm text-brown-900">ต้องทบทวน</Text>
              </View>
              <Text className="text-sm font-semibold text-brown-900">
                {unknownCount} คำ{' '}
                <Text className="text-xs font-normal text-brown-400">({unknownPct}%)</Text>
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={16} color="#4A6FA5" />
                <Text className="text-sm text-brown-900">เวลาเฉลี่ย</Text>
              </View>
              <Text className="text-sm font-semibold text-brown-900">{avgSec} วินาที/คำ</Text>
            </View>
          </View>
        </View>

        {/* CTAs */}
        <View className="w-full mt-6" style={{ gap: 12 }}>
          {unknownCount > 0 ? (
            <Pressable
              className="bg-brick-600 py-3 px-6 rounded-[10px] items-center min-h-[48px]"
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              onPress={handleRetryUnknown}
              accessibilityRole="button"
            >
              <Text className="text-base font-semibold text-cream-50">
                ทบทวนคำที่จำไม่ได้อีกครั้ง ({unknownCount})
              </Text>
            </Pressable>
          ) : (
            <Text className="text-base font-semibold text-center py-3" style={{ color: '#4A7C59' }}>
              ยอดเยี่ยม! คุณจำได้ทุกคำ
            </Text>
          )}

          <Pressable
            className="bg-gold-500 py-3 px-6 rounded-[10px] items-center min-h-[48px]"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            onPress={handleStartQuiz}
            accessibilityRole="button"
          >
            <Text className="text-base font-semibold text-cream-50">ทำ Quiz ต่อเลย! 🧠</Text>
          </Pressable>

          <Pressable
            className="border-[1.5px] border-gold-500 py-3 px-6 rounded-[10px] items-center min-h-[48px]"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            onPress={handleGoBack}
            accessibilityRole="button"
          >
            <Text className="text-base font-semibold text-gold-700">กลับหน้าเรียนรู้</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
