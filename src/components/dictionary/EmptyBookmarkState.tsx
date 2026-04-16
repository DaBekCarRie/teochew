import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyBookmarkStateProps {
  onGoToDictionary: () => void;
}

export function EmptyBookmarkState({ onGoToDictionary }: EmptyBookmarkStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 mt-12">
      <Ionicons name="bookmark-outline" size={56} color="#E8D5A3" />
      <Text className="text-[17px] font-semibold text-brown-900 text-center mt-4">
        ยังไม่มีคำที่บันทึกไว้
      </Text>
      <Text className="text-sm text-brown-400 text-center mt-2" style={{ maxWidth: 240 }}>
        กด ★ บนคำศัพท์ที่ต้องการบันทึกไว้
      </Text>
      <Pressable
        className="mt-6 px-6 py-3 rounded-full border border-gold-500"
        onPress={onGoToDictionary}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-sm font-medium text-gold-700">ไปที่พจนานุกรม</Text>
      </Pressable>
    </View>
  );
}
