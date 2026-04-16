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
      <Ionicons name="warning-outline" size={56} color="#E8D5A3" />
      <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
        เกิดข้อผิดพลาด
      </Text>
      <Text className="text-sm text-brown-400 text-center mt-2" style={{ maxWidth: 240 }}>
        {displayMessage}
      </Text>
      <TouchableOpacity
        className="mt-6 border border-brick-600 rounded-full px-6 py-3 min-h-[44px] items-center justify-center"
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="ลองใหม่อีกครั้ง"
      >
        <Text className="text-brick-600 font-medium text-sm">ลองใหม่อีกครั้ง</Text>
      </TouchableOpacity>
    </View>
  );
}
