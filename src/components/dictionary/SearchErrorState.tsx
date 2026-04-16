import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchErrorStateProps {
  message?: string;
  onRetry: () => void;
  isOffline?: boolean;
}

export function SearchErrorState({ message, onRetry, isOffline = false }: SearchErrorStateProps) {
  const displayMessage = isOffline
    ? 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบสัญญาณแล้วลองใหม่'
    : (message ?? 'เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');

  return (
    <View className="flex-1 items-center justify-center px-8 mt-12">
      <Ionicons name="warning" size={56} color="#C84B31" />
      <Text className="text-base font-semibold text-gray-900 dark:text-[#F2F2F7] text-center mt-4">
        เกิดข้อผิดพลาด
      </Text>
      <Text className="text-sm text-gray-500 dark:text-[#8E8E93] text-center mt-2 max-w-[240px]">
        {displayMessage}
      </Text>
      <TouchableOpacity
        className="mt-6 border border-[#C84B31] rounded-full px-6 py-3 min-h-[44px] items-center justify-center"
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="ลองใหม่อีกครั้ง"
      >
        <Text className="text-[#C84B31] font-medium">ลองใหม่อีกครั้ง</Text>
      </TouchableOpacity>
    </View>
  );
}
