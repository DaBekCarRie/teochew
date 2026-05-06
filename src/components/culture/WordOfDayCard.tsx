import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WordOfDay } from '../../stores/cultureStore';
import { createAudioPlayer } from 'expo-audio';
import { usePlaybackSpeed } from '../../hooks/usePlaybackSpeed';
import * as Haptics from 'expo-haptics';

export function WordOfDayCard({ wordOfDay }: { wordOfDay: WordOfDay }) {
  const { word, date } = wordOfDay;
  const playbackSpeed = usePlaybackSpeed();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Format date to Thai
  const d = new Date(date);
  const thaiDate = d.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  function handlePlayTTS() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Fallback TTS audio URL if word doesn't have one
      const uri =
        word.teochew_audio || 'https://cdn.pixabay.com/audio/2022/03/15/audio_2910d655f2.mp3';
      const player = createAudioPlayer({ uri });
      player.setPlaybackRate(playbackSpeed, 'high');
      player.play();

      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          try {
            player.remove();
          } catch {}
        }
      });
    } catch (e) {
      console.log('TTS failed', e);
    }
  }

  function handleBookmark() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsBookmarked(true);
    // In a real app we'd save this to a bookmark store
  }

  return (
    <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 8 }}>
      <View
        style={{
          backgroundColor: '#F5EDD9',
          borderRadius: 18,
          padding: 20,
          borderWidth: 1,
          borderColor: '#EAD9B8',
        }}
      >
        {/* Header label */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Text style={{ fontSize: 16 }}>🏮</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#9A7A2E',
              textTransform: 'uppercase',
              fontFamily: 'Sarabun',
            }}
          >
            คำประจำวัน
          </Text>
          <Text style={{ fontSize: 12, color: '#9E7B6B' }}>·</Text>
          <Text style={{ fontSize: 12, color: '#9E7B6B', fontFamily: 'Sarabun' }}>{thaiDate}</Text>
        </View>

        {/* Teochew */}
        <Text
          style={{
            fontSize: 44,
            fontWeight: 'bold',
            color: '#2C1A0E',
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          {word.teochew_char}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontStyle: 'italic',
            color: '#B8860B',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {word.teochew_pengim}
        </Text>

        {/* Meanings */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
          {word.thai_meaning && <MeaningChip flag="🇹🇭" text={word.thai_meaning} />}
          {word.mandarin_char && <MeaningChip flag="🇨🇳" text={word.mandarin_char} />}
          {word.english_meaning && <MeaningChip flag="🇬🇧" text={word.english_meaning} />}
        </View>

        {/* Actions */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#EAD9B8',
          }}
        >
          <Pressable
            onPress={handlePlayTTS}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: '#EAD9B8',
              borderRadius: 10,
              paddingVertical: 10,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="volume-medium" size={16} color="#7C4B35" />
            <Text style={{ fontSize: 14, color: '#2C1A0E', fontFamily: 'Sarabun' }}>ฟังเสียง</Text>
          </Pressable>

          <Pressable
            onPress={handleBookmark}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: '#C9A84C',
              backgroundColor: isBookmarked ? '#E8D5A3' : 'transparent',
              borderRadius: 10,
              paddingVertical: 10,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color="#B8860B"
            />
            <Text style={{ fontSize: 14, color: '#B8860B', fontFamily: 'Sarabun' }}>
              {isBookmarked ? 'เพิ่มแล้ว ✓' : 'เพิ่มคำนี้'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MeaningChip({ flag, text }: { flag: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={{ fontSize: 18 }}>{flag}</Text>
      <Text style={{ fontSize: 15, fontWeight: '500', color: '#2C1A0E', fontFamily: 'Sarabun' }}>
        {text}
      </Text>
    </View>
  );
}
