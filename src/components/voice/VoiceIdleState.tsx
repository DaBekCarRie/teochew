import React from 'react';
import { View, Text } from 'react-native';

export function VoiceIdleState() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 80 }}>🎙️</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        กดปุ่มค้างไว้เพื่ออัดเสียง
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        แต้จิ๋ว ระบบจะฟังเสียงและแปล{'\n'}ให้อัตโนมัติ
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 24,
          justifyContent: 'center',
        }}
      >
        {['💡 พูดให้ชัดเจน', '🔇 หาที่เงียบกว่านี้'].map((hint) => (
          <View
            key={hint}
            style={{
              backgroundColor: '#EDE0C4',
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: '#6B4C2A' }}>{hint}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
