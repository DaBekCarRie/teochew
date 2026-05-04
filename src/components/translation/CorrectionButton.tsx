import React from 'react';
import { Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface CorrectionButtonProps {
  onPress: () => void;
}

export function CorrectionButton({ onPress }: CorrectionButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#C9A84C',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        minHeight: 48,
        backgroundColor: pressed ? 'rgba(201,168,76,0.1)' : 'transparent',
        marginTop: 12,
      })}
      accessibilityLabel="ส่งคำที่ถูกต้อง"
      accessibilityRole="button"
      accessibilityHint="เปิดฟอร์มสำหรับส่งคำแต้จิ๋วที่ถูกต้อง"
    >
      <Ionicons name="create-outline" size={16} color="#9A7A2E" />
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#9A7A2E' }}>
        แก้ไข / ส่งคำที่ถูกต้อง
      </Text>
    </Pressable>
  );
}
