import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyDeckStateProps {
  onGoBack: () => void;
}

export function EmptyDeckState({ onGoBack }: EmptyDeckStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="cube-outline" size={64} color="#E8D5A3" style={{ opacity: 0.7 }} />
      <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
        ไม่มีคำศัพท์สำหรับฝึก
      </Text>
      <Text className="text-sm text-brown-400 text-center mt-2" style={{ maxWidth: 240 }}>
        เพิ่มคำศัพท์เข้า deck ก่อนเพื่อเริ่มฝึก
      </Text>
      <Pressable
        className="bg-brick-600 px-6 py-3 rounded-[10px] mt-6 min-h-[48px] items-center justify-center"
        onPress={onGoBack}
        accessibilityRole="button"
      >
        <Text className="text-base font-semibold text-cream-50">กลับหน้าเรียนรู้</Text>
      </Pressable>
    </View>
  );
}
