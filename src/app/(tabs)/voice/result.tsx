import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { TranscriptCard } from '../../../components/voice/TranscriptCard';
import { VoiceResultCard } from '../../../components/voice/VoiceResultCard';
import type { TranscribeResponse } from '../../../types/voice';

export default function VoiceResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    resultJson: string;
    showLowConfidenceWarning?: string;
  }>();

  const result: TranscribeResponse = params.resultJson
    ? (JSON.parse(params.resultJson) as TranscribeResponse)
    : {
        transcript: '',
        teochew_char: null,
        pengim: null,
        thai_meaning: null,
        english_meaning: null,
        mandarin_char: null,
        verified: false,
        confidence: 0,
      };

  const showWarning = params.showLowConfidenceWarning === 'true';
  const [selectedLang, setSelectedLang] = useState<'th' | 'zh' | 'en'>('th');

  function handleReRecord() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
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
        <Text style={{ fontSize: 17, fontWeight: '600', color: '#2C1A0E' }}>ผลการถอดเสียง</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {showWarning && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 8,
              backgroundColor: 'rgba(181,69,27,0.08)',
              borderWidth: 1,
              borderColor: '#E8C4B8',
              borderRadius: 10,
              padding: 12,
              marginTop: 12,
              marginBottom: 4,
            }}
            accessibilityLiveRegion="polite"
          >
            <Ionicons name="warning-outline" size={16} color="#B5451B" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#B5451B' }}>
                คลาดเคลื่อนไม่น้อย — เสียงไม่ค่อยชัด
              </Text>
              <Text style={{ fontSize: 12, color: '#B5451B', marginTop: 2 }}>
                กรุณาตรวจสอบผลลัพธ์ก่อนนำไปใช้
              </Text>
            </View>
          </View>
        )}

        <TranscriptCard transcript={result.transcript} confidence={result.confidence} />

        <VoiceResultCard
          result={result}
          selectedLang={selectedLang}
          onSelectLang={setSelectedLang}
        />

        {/* Re-record button */}
        <Pressable
          onPress={handleReRecord}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 20,
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityLabel="อัดเสียงใหม่"
          accessibilityRole="button"
        >
          <Ionicons name="refresh-outline" size={16} color="#A08060" />
          <Text style={{ fontSize: 14, color: '#A08060' }}>อัดใหม่</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
