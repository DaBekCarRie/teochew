import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface VoiceHistoryEmptyStateProps {
  onGoRecord?: () => void;
}

export function VoiceHistoryEmptyState({ onGoRecord }: VoiceHistoryEmptyStateProps) {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
    >
      <Text style={{ fontSize: 64 }}>🎙️</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        ยังไม่มีประวัติการอัดเสียง
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        อัดเสียงแต้จิ๋ว ระบบจะบันทึก{'\n'}ประวัติไว้ที่นี่
      </Text>
      {onGoRecord && (
        <Pressable
          onPress={onGoRecord}
          style={({ pressed }) => ({
            marginTop: 24,
            borderRadius: 12,
            backgroundColor: '#B5451B',
            paddingHorizontal: 20,
            paddingVertical: 10,
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#FAF6EE' }}>อัดเสียงเลย →</Text>
        </Pressable>
      )}
    </View>
  );
}
