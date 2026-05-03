import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InsufficientWordsStateProps {
  onGoBack: () => void;
}

export function InsufficientWordsState({ onGoBack }: InsufficientWordsStateProps) {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}
    >
      <Ionicons name="help-circle-outline" size={64} color="#E8D5A3" style={{ opacity: 0.7 }} />
      <Text
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        ไม่มีคำศัพท์สำหรับ Quiz
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 8,
          maxWidth: 240,
        }}
      >
        กรุณาเรียนคำศัพท์เพิ่มก่อนทำ Quiz
      </Text>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: '#B5451B',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 10,
          marginTop: 24,
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        })}
        onPress={onGoBack}
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#FAF6EE' }}>กลับหน้าเรียนรู้</Text>
      </Pressable>
    </View>
  );
}
