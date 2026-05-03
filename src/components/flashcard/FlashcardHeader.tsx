import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FlashcardHeaderProps {
  title: string;
  current: number;
  total: number;
  onBack: () => void;
}

export function FlashcardHeader({ title, current, total, onBack }: FlashcardHeaderProps) {
  function handleClose() {
    if (current > 1) {
      Alert.alert('ออกจากการฝึก?', 'ความคืบหน้าจะไม่ถูกบันทึก', [
        { text: 'ฝึกต่อ', style: 'cancel' },
        { text: 'ออก', style: 'destructive', onPress: onBack },
      ]);
    } else {
      onBack();
    }
  }

  return (
    <View className="h-14 px-5 flex-row items-center">
      <Pressable
        className="w-11 h-11 items-center justify-center"
        onPress={handleClose}
        hitSlop={8}
        accessibilityLabel="กลับ"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
      </Pressable>

      <Text
        className="flex-1 text-center text-[17px] font-semibold text-brown-900"
        numberOfLines={1}
      >
        {title}
      </Text>

      <Text
        className="text-sm font-medium text-brown-400 mr-2"
        accessibilityLabel={`การ์ดที่ ${current} จาก ${total}`}
      >
        {current}/{total}
      </Text>

      <Pressable
        className="w-11 h-11 items-center justify-center"
        onPress={handleClose}
        hitSlop={8}
        accessibilityLabel="ปิดการฝึก"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={20} color="#A08060" />
      </Pressable>
    </View>
  );
}
