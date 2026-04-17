import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getWordDetail } from '../../../services/supabase/words';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { BookmarkButton } from '../../../components/dictionary/BookmarkButton';
import { VerifiedBadge } from '../../../components/dictionary/VerifiedBadge';
import { FullAudioSection } from '../../../components/audio/FullAudioSection';
import type { WordDetail, UsageExample } from '../../../types/dictionary';

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-xs font-semibold text-brown-400 uppercase tracking-widest mb-2">
      {label}
    </Text>
  );
}

function Divider() {
  return <View className="h-px bg-cream-300 my-4" />;
}

function ExampleRow({ example, index }: { example: UsageExample; index: number }) {
  return (
    <View
      className="bg-cream-100 rounded-[10px] px-4 py-3 mb-3"
      style={{ borderLeftWidth: 3, borderLeftColor: '#C9A84C' }}
    >
      <View className="flex-row items-start gap-2">
        <Text className="text-xs font-semibold text-gold-700 mt-0.5">{index + 1}</Text>
        <View className="flex-1">
          <Text className="text-[18px] font-bold text-brown-900 leading-snug">
            {example.teochew_char}
          </Text>
          <Text className="text-sm italic text-gold-700 mt-0.5">{example.teochew_pengim}</Text>
          <View className="flex-row mt-1.5 gap-3">
            <Text className="text-sm text-brown-900 flex-1">
              <Text className="text-brown-400">TH </Text>
              {example.thai_meaning}
            </Text>
          </View>
          <Text className="text-sm text-brown-600 mt-0.5">
            <Text className="text-brown-400">EN </Text>
            {example.english_meaning}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function WordDetailScreen() {
  const { wordId } = useLocalSearchParams<{ wordId: string }>();
  const router = useRouter();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();

  const [word, setWord] = useState<WordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getWordDetail(wordId ?? '').then((result) => {
      if (!cancelled) {
        setWord(result);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [wordId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50 items-center justify-center">
        <Stack.Screen options={{ title: '', headerShown: true }} />
        <ActivityIndicator color="#C9A84C" />
      </SafeAreaView>
    );
  }

  if (!word) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50 items-center justify-center px-8">
        <Stack.Screen options={{ title: 'ไม่พบคำ', headerShown: true }} />
        <Ionicons name="search-outline" size={48} color="#E8D5A3" />
        <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
          ไม่พบคำศัพท์นี้
        </Text>
        <Text className="text-sm text-brown-400 text-center mt-2">อาจยังไม่มีในฐานข้อมูล</Text>
        <Pressable
          className="mt-6 px-6 py-3 rounded-full border border-gold-500"
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="text-sm font-medium text-gold-700">กลับ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isBookmarked = bookmarkedIds.has(word.id);

  function handleBookmarkToggle() {
    if (isBookmarked) {
      removeBookmark(word!.id);
    } else {
      addBookmark(word!);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['bottom']}>
      <Stack.Screen
        options={{
          title: word.teochew_char,
          headerShown: true,
          headerRight: () => (
            <BookmarkButton
              wordId={word.id}
              isBookmarked={isBookmarked}
              onToggle={handleBookmarkToggle}
            />
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View
          className="bg-white rounded-[16px] px-6 py-5 mb-4"
          style={{
            shadowColor: '#2C1A0E',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Top row: char + badge */}
          <View className="flex-row items-start justify-between">
            <Text className="text-6xl font-bold text-brown-900" style={{ lineHeight: 76 }}>
              {word.teochew_char}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              {word.category && (
                <View className="bg-gold-200 px-2 py-0.5 rounded-[6px]">
                  <Text className="text-xs font-medium text-gold-700">{word.category}</Text>
                </View>
              )}
              {word.verified && <VerifiedBadge />}
            </View>
          </View>

          {/* Pengim */}
          <Text className="text-xl italic text-gold-700 mt-1">{word.teochew_pengim}</Text>

          <Divider />

          {/* Meanings */}
          <View className="gap-2">
            <View className="flex-row items-start gap-2">
              <Text className="text-sm font-semibold text-brown-400 w-8">TH</Text>
              <Text className="text-base text-brown-900 flex-1">{word.thai_meaning}</Text>
            </View>
            <View className="flex-row items-start gap-2">
              <Text className="text-sm font-semibold text-brown-400 w-8">EN</Text>
              <Text className="text-base text-brown-600 flex-1">{word.english_meaning}</Text>
            </View>
          </View>

          {/* Mandarin row */}
          {word.mandarin_char && (
            <>
              <Divider />
              <View className="flex-row items-center gap-3">
                <Text className="text-sm font-semibold text-brown-400">จีนกลาง</Text>
                <Text className="text-lg font-semibold text-brown-900">{word.mandarin_char}</Text>
                {word.mandarin_pinyin && (
                  <Text className="text-sm italic text-brown-400">{word.mandarin_pinyin}</Text>
                )}
              </View>
            </>
          )}
        </View>
        <FullAudioSection audioUrl={word.teochew_audio} wordTeochew={word.teochew_char} />

        {/* Notes */}
        {word.notes && (
          <View className="bg-gold-200 rounded-[12px] px-4 py-3 mb-4 flex-row gap-3">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#9A7A2E"
              style={{ marginTop: 1 }}
            />
            <Text className="text-sm text-gold-700 flex-1 leading-relaxed">{word.notes}</Text>
          </View>
        )}

        {/* Usage examples */}
        {word.usage_examples.length > 0 && (
          <View>
            <SectionLabel label="ตัวอย่างการใช้งาน" />
            {word.usage_examples.map((ex, i) => (
              <ExampleRow key={i} example={ex} index={i} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
