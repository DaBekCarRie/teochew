import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VerifiedBadge() {
  return (
    <View className="flex-row items-center gap-1" accessibilityLabel="คำที่ผ่านการตรวจสอบแล้ว">
      <Ionicons name="checkmark-circle" size={13} color="#4A7C59" />
      <Text className="text-xs text-[#4A7C59]">ตรวจสอบแล้ว</Text>
    </View>
  );
}
