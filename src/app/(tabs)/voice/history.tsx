import React, { useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, FlatList, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceStore } from '../../../stores/voiceStore';
import { VoiceHistoryCard } from '../../../components/voice/VoiceHistoryCard';
import { VoiceHistoryEmptyState } from '../../../components/voice/VoiceHistoryEmptyState';
import { buildVoiceShareMessage } from '../../../utils/voiceFormatters';
import type { VoiceHistoryEntry } from '../../../types/voice';

export default function VoiceHistoryScreen() {
  const router = useRouter();
  const { history, hydrated, hydrate, clearHistory, setPendingResult } = useVoiceStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleSelectEntry(entry: VoiceHistoryEntry) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPendingResult(entry.result);
    router.back();
  }

  async function handleShareEntry(entry: VoiceHistoryEntry) {
    await Share.share({ message: buildVoiceShareMessage(entry.result) });
  }

  function handleClear() {
    Alert.alert('ล้างประวัติทั้งหมด?', 'ประวัติการอัดเสียงทั้งหมดจะถูกลบอย่างถาวร', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ล้างประวัติ',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
          height: 52,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
          accessibilityLabel="กลับ"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>

        <Text style={{ fontSize: 17, fontWeight: '600', color: '#2C1A0E' }}>
          ประวัติการอัดเสียง
        </Text>

        {history.length > 0 ? (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({
              paddingHorizontal: 8,
              paddingVertical: 4,
              opacity: pressed ? 0.6 : 1,
            })}
            accessibilityLabel="ล้างประวัติ"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 14, color: '#B5451B' }}>🗑 ล้าง</Text>
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {!hydrated ? null : history.length === 0 ? (
        <VoiceHistoryEmptyState onGoRecord={() => router.back()} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <VoiceHistoryCard
              entry={item}
              onPress={() => handleSelectEntry(item)}
              onShare={() => handleShareEntry(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
