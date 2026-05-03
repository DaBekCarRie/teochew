import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SwipeHint() {
  return (
    <View
      className="px-8 py-2 flex-row justify-between"
      style={{ opacity: 0.6 }}
      accessibilityElementsHidden
    >
      <View className="flex-row items-center gap-1">
        <Ionicons name="chevron-back" size={14} color="#B5451B" />
        <Text className="text-xs" style={{ color: '#B5451B' }}>
          ต้องทบทวน
        </Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="text-xs" style={{ color: '#4A7C59' }}>
          จำได้
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#4A7C59" />
      </View>
    </View>
  );
}
