import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceHeaderProps {
  onOpenHistory: () => void;
}

export function VoiceHeader({ onOpenHistory }: VoiceHeaderProps) {
  return (
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
      <Text style={{ fontSize: 17, fontWeight: '600', color: '#2C1A0E' }}>🎙️ อัดเสียงแต้จิ๋ว</Text>
      <Pressable
        onPress={onOpenHistory}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
        accessibilityLabel="ประวัติการอัดเสียง"
        accessibilityRole="button"
      >
        <Ionicons name="time-outline" size={22} color="#2C1A0E" />
      </Pressable>
    </View>
  );
}
