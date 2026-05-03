import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface FlashcardActionsProps {
  onUnknown: () => void;
  onKnown: () => void;
  disabled: boolean;
}

export function FlashcardActions({ onUnknown, onKnown, disabled }: FlashcardActionsProps) {
  return (
    <View className="px-5 pb-4 flex-row gap-3">
      {/* Unknown */}

      {/* Known */}
      <Pressable
        className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-[10px] min-h-[48px]"
        style={({ pressed }) => [
          { backgroundColor: '#4A7C59' },
          disabled && { opacity: 0.4 },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onKnown();
        }}
        disabled={disabled}
        accessibilityLabel="จำได้แล้ว"
        accessibilityRole="button"
      >
        <Ionicons name="checkmark" size={18} color="#FAF6EE" />
        <Text className="text-sm font-semibold text-cream-50">จำได้แล้ว</Text>
      </Pressable>
    </View>
  );
}
