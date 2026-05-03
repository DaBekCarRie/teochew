import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeakWord } from '../../stores/progressStore';
import type { WordEntry } from '../../types/dictionary';

interface WeakWordsListProps {
  weakWords: WeakWord[];
  allWords: WordEntry[]; // to resolve wordId → display data
  onReviewPress: () => void;
}

export function WeakWordsList({ weakWords, allWords, onReviewPress }: WeakWordsListProps) {
  if (weakWords.length === 0) {
    return (
      <View
        style={{
          backgroundColor: '#F5EDD8',
          borderWidth: 1,
          borderColor: '#D9C9A8',
          borderRadius: 14,
          padding: 20,
          marginTop: 16,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 28 }}>🎉</Text>
        <Text style={{ fontSize: 14, color: '#4A7C59', fontWeight: '600' }}>
          เก่งมาก! ไม่มีคำที่ต้องทบทวน
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E', marginBottom: 4 }}>
        คำที่ต้องทบทวน ({weakWords.length})
      </Text>
      <Text style={{ fontSize: 12, color: '#A08060', marginBottom: 12 }}>
        คำที่ตอบถูกน้อยกว่า 50%
      </Text>

      {weakWords.map((ww, idx) => {
        const word = allWords.find((w) => w.id === ww.wordId);
        if (!word) return null;
        const isLow = ww.accuracy < 30;
        const barColor = isLow ? '#B5451B' : '#C9A84C';

        return (
          <View
            key={ww.wordId}
            style={{
              paddingVertical: 12,
              borderTopWidth: idx > 0 ? 1 : 0,
              borderTopColor: '#EDE0C4',
            }}
            accessibilityLabel={`${word.teochew_char} ${word.thai_meaning} ความแม่น ${ww.accuracy} เปอร์เซ็นต์`}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E', width: 52 }}>
                {word.teochew_char}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#9A7A2E', fontStyle: 'italic' }}>
                  {word.teochew_pengim}
                </Text>
                <Text style={{ fontSize: 13, color: '#6B4F2A' }}>{word.thai_meaning}</Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: barColor,
                  minWidth: 40,
                  textAlign: 'right',
                }}
              >
                {ww.accuracy}%
              </Text>
            </View>

            {/* Mini accuracy bar */}
            <View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: '#EDE0C4',
                marginTop: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: barColor,
                  width: `${ww.accuracy}%`,
                }}
              />
            </View>
          </View>
        );
      })}

      {/* CTA */}
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#A03510' : '#B5451B',
          paddingVertical: 13,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 14,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          opacity: pressed ? 0.9 : 1,
        })}
        onPress={onReviewPress}
        accessibilityRole="button"
        accessibilityLabel="ทบทวน Flashcard คำที่ต้องปรับปรุง"
      >
        <Ionicons name="albums-outline" size={16} color="#FAF6EE" />
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#FAF6EE' }}>
          ทบทวน Flashcard คำเหล่านี้
        </Text>
      </Pressable>
    </View>
  );
}
