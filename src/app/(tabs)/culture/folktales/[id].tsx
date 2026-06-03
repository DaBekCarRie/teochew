import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_FOLKTALES } from '../../../../data/mockFolktales';
import { useAudio } from '../../../../hooks/useAudio';

export default function FolktaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const story = MOCK_FOLKTALES.find((s) => s.id === id);

  const { status, isPlaying, isLoading, play, pause, stop, positionMs, durationMs } = useAudio(
    story?.audio_url,
  );

  // Stop audio when unmounting
  useEffect(() => {
    return () => stop();
  }, [stop]);

  if (!story) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50 items-center justify-center">
        <Text className="text-brown-400 font-sarabun">ไม่พบเรื่องราวนี้</Text>
        <Pressable onPress={() => router.back()} className="mt-4 px-4 py-2 bg-cream-200 rounded-lg">
          <Text className="font-sarabun text-brown-900">กลับ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const progressPercent = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['top', 'left', 'right']}>
      <View className="px-5 pt-4 pb-2 flex-row items-center gap-2">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-cream-100"
        >
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>
        <Text className="text-lg font-bold text-brown-900 font-sarabun flex-1" numberOfLines={1}>
          {story.title}
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
          <Text className="text-2xl font-bold text-brown-900 mb-2 font-sarabun leading-8">
            {story.title}
          </Text>
          <Text className="text-sm text-brown-400 mb-6 font-sarabun">{story.description}</Text>

          <View className="mb-6">
            <Text className="text-xs font-bold text-gold-600 mb-2 uppercase tracking-widest">
              ภาษาแต้จิ๋ว (ตัวเต็ม)
            </Text>
            <Text className="text-xl text-brown-900 leading-9 font-medium">{story.content_zh}</Text>
          </View>

          <View className="mb-6">
            <Text className="text-xs font-bold text-gold-600 mb-2 uppercase tracking-widest">
              คำอ่านพินอิน (Peng'im)
            </Text>
            <Text className="text-lg text-brown-600 leading-7 italic">{story.content_tc}</Text>
          </View>

          <View>
            <Text className="text-xs font-bold text-gold-600 mb-2 uppercase tracking-widest">
              คำแปลภาษาไทย
            </Text>
            <Text className="text-base text-brown-800 leading-7 font-sarabun">
              {story.content_th}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Audio Player Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-brown-900 pt-4 pb-10 px-5 flex-row items-center gap-4">
        <Pressable
          onPress={isPlaying ? pause : play}
          className="w-12 h-12 bg-brick-600 rounded-full items-center justify-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
          )}
        </Pressable>

        <View className="flex-1">
          <Text className="text-white font-bold font-sarabun mb-1 text-sm">เสียงเล่าเรื่อง</Text>
          <View className="h-1 bg-brown-700 rounded-full overflow-hidden w-full">
            <View
              className="h-full bg-gold-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-white/50 text-[10px]">{Math.floor(positionMs / 1000)}s</Text>
            <Text className="text-white/50 text-[10px]">
              {Math.floor(durationMs / 1000) || story.duration}s
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
