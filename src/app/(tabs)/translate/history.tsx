import React, { useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslationStore } from '../../../stores/translationStore';
import { HistoryCard } from '../../../components/translation/HistoryCard';
import { HistoryEmptyState } from '../../../components/translation/HistoryEmptyState';
import type { HistoryEntry } from '../../../types/translation';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, hydrated, hydrate, clearHistory, setPendingResult } = useTranslationStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClear() {
    Alert.alert('ล้างประวัติทั้งหมด?', 'ประวัติการแปลทั้งหมดจะถูกลบอย่างถาวร', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ล้างประวัติ',
        style: 'destructive',
        onPress: () => clearHistory(),
      },
    ]);
  }

  function handleSelectEntry(entry: HistoryEntry) {
    setPendingResult(entry.result);
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityLabel="กลับ"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>

        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            color: '#2C1A0E',
            textAlign: 'center',
          }}
        >
          ประวัติการแปล
        </Text>

        {history.length > 0 ? (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              width: 44,
              height: 44,
              justifyContent: 'flex-end',
              opacity: pressed ? 0.7 : 1,
            })}
            accessibilityLabel="ล้างประวัติ"
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color="#B5451B" />
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {history.length === 0 ? (
        <HistoryEmptyState onGoTranslate={() => router.back()} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="รายการประวัติการแปล"
          renderItem={({ item }) => (
            <HistoryCard entry={item} onPress={() => handleSelectEntry(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
