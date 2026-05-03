import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FetchErrorStateProps {
  message?: string | null;
  onRetry: () => void;
}

export function FetchErrorState({ message, onRetry }: FetchErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="alert-circle-outline" size={64} color="#B5451B" style={{ opacity: 0.7 }} />
      <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
        ไม่สามารถโหลดคำศัพท์ได้
      </Text>
      <Text className="text-sm text-brown-400 text-center mt-2" style={{ maxWidth: 240 }}>
        {message ?? 'กรุณาตรวจสอบอินเทอร์เน็ต'}
      </Text>
      <Pressable
        className="bg-brick-600 px-6 py-3 rounded-[10px] mt-6 min-h-[48px] items-center justify-center"
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text className="text-base font-semibold text-cream-50">ลองใหม่</Text>
      </Pressable>
    </View>
  );
}
