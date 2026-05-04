import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface PreviewActionRowProps {
  onSend: () => void;
  onCancel: () => void;
}

export function PreviewActionRow({ onSend, onCancel }: PreviewActionRowProps) {
  function handleSend() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSend();
  }

  function handleCancel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  }

  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, width: '100%' }}>
      <Pressable
        onPress={handleCancel}
        style={({ pressed }) => ({
          flex: 1,
          height: 52,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#D9C9A8',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          opacity: pressed ? 0.7 : 1,
        })}
        accessibilityLabel="ยกเลิกและอัดใหม่"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={16} color="#6B4C2A" />
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#2C1A0E' }}>ยกเลิก</Text>
      </Pressable>

      <Pressable
        onPress={handleSend}
        style={({ pressed }) => ({
          flex: 2,
          height: 52,
          borderRadius: 12,
          backgroundColor: '#B5451B',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          opacity: pressed ? 0.85 : 1,
        })}
        accessibilityLabel="ส่งเสียงเพื่อวิเคราะห์"
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FAF6EE' }}>ส่ง → วิเคราะห์</Text>
        <Ionicons name="arrow-forward" size={16} color="#FAF6EE" />
      </Pressable>
    </View>
  );
}
