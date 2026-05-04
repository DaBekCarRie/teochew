import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useXPStore } from '../../stores/xpStore';

export function XPBar() {
  const { totalXP, getLevelDef, getXPWithinCurrentLevel, getXPToNextLevel } = useXPStore();

  const levelDef = getLevelDef();
  const currentLevelXP = getXPWithinCurrentLevel();
  const nextLevelXP = getXPToNextLevel();

  const fillFraction = Math.min(currentLevelXP / nextLevelXP, 1);
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    fillWidth.value = withTiming(fillFraction, { duration: 500 });
  }, [fillFraction, fillWidth]);

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: `${fillWidth.value * 100}%`,
    };
  });

  return (
    <View
      className="bg-cream-100 border border-cream-300 rounded-[14px] p-4"
      accessibilityLabel={`ระดับ ${levelDef.level} ${levelDef.nameTh} XP ${currentLevelXP} จาก ${nextLevelXP}`}
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-[20px]">{levelDef.emoji}</Text>
        <Text className="text-base font-bold text-brown-900">Lv.{levelDef.level}</Text>
        <Text className="text-sm text-brown-600">{levelDef.nameTh}</Text>
        <Text className="text-xs text-brown-400">({levelDef.nameTeochew})</Text>
      </View>

      <View className="h-[8px] rounded-full bg-cream-200 mt-2 overflow-hidden">
        <Animated.View className="h-[8px] rounded-full bg-gold-500" style={animatedFillStyle} />
      </View>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-xs text-brown-400">
          {currentLevelXP}/{nextLevelXP} XP
        </Text>
        <Text className="text-xs text-brown-400">รวม: {totalXP} XP</Text>
      </View>
    </View>
  );
}
