import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { TONES } from '../../../utils/toneData';
import { PitchContourChart } from '../../../components/tone/PitchContourChart';
import { ToneDetailTable } from '../../../components/tone/ToneDetailTable';
import { ToneCompareSection } from '../../../components/tone/ToneCompareSection';
import { useToneAudio } from '../../../hooks/useToneAudio';

export default function ToneDiagramScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const tableOffsetRef = useRef(0);

  const [highlightTones, setHighlightTones] = useState<number[]>([]);
  const [compareTones, setCompareTones] = useState<[number | null, number | null]>([null, null]);

  const { playingTone, playTone, playCompare, stopAll } = useToneAudio();

  // Tap a tone in the chart: toggle highlight + play audio
  function handleTonePress(toneNumber: number) {
    const alreadyHighlighted = highlightTones.includes(toneNumber) && highlightTones.length === 1;
    if (alreadyHighlighted) {
      setHighlightTones([]);
      stopAll();
    } else {
      setHighlightTones([toneNumber]);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playTone(toneNumber);
      // Scroll table row into view (approximate: each row ~72px, table starts after chart ~280px)
      scrollRef.current?.scrollTo({
        y: tableOffsetRef.current + (toneNumber - 1) * 72,
        animated: true,
      });
    }
  }

  // Play button in the detail table
  function handlePlayPress(toneNumber: number) {
    if (playingTone === toneNumber) {
      stopAll();
      setHighlightTones([]);
    } else {
      setHighlightTones([toneNumber]);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playTone(toneNumber);
    }
  }

  // Compare tone picker
  function handleSelectCompareTone(index: 0 | 1, tone: number) {
    setCompareTones((prev) => {
      const next = [...prev] as [number | null, number | null];
      next[index] = tone;
      return next;
    });
    const other = index === 0 ? compareTones[1] : compareTones[0];
    setHighlightTones(other !== null ? [tone, other] : [tone]);
  }

  // Play compare: toneA → 500ms gap → toneB
  function handlePlayCompare() {
    const [a, b] = compareTones;
    if (a === null || b === null || a === b) return;
    playCompare(a, b);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          height: 56,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
          backgroundColor: '#FAF6EE',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="กลับ"
        >
          <Ionicons name="arrow-back" size={22} color="#2C1A0E" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '600',
            color: '#2C1A0E',
          }}
        >
          ระบบเสียงแต้จิ๋ว
        </Text>
        {/* Spacer to balance back button */}
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro text */}
        <Text style={{ fontSize: 13, color: '#A08060', marginBottom: 12, lineHeight: 20 }}>
          ภาษาแต้จิ๋วมี 8 วรรณยุกต์ — แตะที่เส้นกราฟเพื่อ highlight และฟังเสียงตัวอย่าง
        </Text>

        <PitchContourChart
          tones={TONES}
          highlightTones={highlightTones}
          playingTone={playingTone}
          onTonePress={handleTonePress}
        />

        <ToneDetailTable
          tones={TONES}
          playingTone={playingTone}
          onPlayPress={handlePlayPress}
          onLayout={(y) => {
            tableOffsetRef.current = y;
          }}
        />

        <ToneCompareSection
          selectedTones={compareTones}
          onSelectTone={handleSelectCompareTone}
          onPlayCompare={handlePlayCompare}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
