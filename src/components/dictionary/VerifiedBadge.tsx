import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VerifiedBadge() {
  return (
    <View className="flex-row items-center gap-1" accessibilityLabel="คำที่ผ่านการตรวจสอบแล้ว">
      <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
      <Text className="text-xs text-[#16A34A] dark:text-[#4ADE80]">ตรวจสอบแล้ว</Text>
    </View>
  );
}
