import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface QuizProgressProps {
  current: number;
  total: number;
  correctCount: number;
  incorrectCount: number;
}

export function QuizProgress({ current, total, correctCount, incorrectCount }: QuizProgressProps) {
  const widthPct = useSharedValue(0);
  const pct = total > 0 ? (current / total) * 100 : 0;

  useEffect(() => {
    widthPct.value = withTiming(pct, { duration: 300 });
  }, [pct, widthPct]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthPct.value}%`,
  }));

  return (
    <View className="px-5 py-2">
      <View className="rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-semibold uppercase tracking-widest text-brown-400">
            ความคืบหน้า
          </Text>
          <Text className="text-xs font-semibold text-brown-700">{Math.round(pct)}%</Text>
        </View>

        <View
          className="h-3 rounded-full bg-cream-200 overflow-hidden"
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: current }}
        >
          <Animated.View
            className="h-full rounded-full bg-gold-500"
            style={[fillStyle, { minWidth: pct > 0 ? 10 : 0 }]}
          />
        </View>

        <View
          className="flex-row items-center justify-between mt-3"
          accessibilityLabel={`ถูก ${correctCount} ข้อ ผิด ${incorrectCount} ข้อ`}
        >
          <View className="flex-row items-center rounded-full bg-[#EAF3EE] px-3 py-1.5">
            <Ionicons name="checkmark-circle" size={14} color="#4A7C59" />
            <Text className="ml-1.5 text-xs font-medium" style={{ color: '#4A7C59' }}>
              {correctCount} ถูก
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-[#FCEBE4] px-3 py-1.5">
            <Ionicons name="close-circle" size={14} color="#B5451B" />
            <Text className="ml-1.5 text-xs font-medium" style={{ color: '#B5451B' }}>
              {incorrectCount} ผิด
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
