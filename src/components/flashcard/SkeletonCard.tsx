import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function SkeletonCard() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(screenWidth - 40, 360);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1, false);
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + shimmer.value * 0.4,
  }));

  return (
    <View
      className="bg-cream-100 border border-cream-300 rounded-[14px] p-6 items-center justify-center"
      style={{ width: cardWidth, height: 420 }}
    >
      <Animated.View className="w-20 h-20 bg-cream-200 rounded-lg mb-6" style={shimmerStyle} />
      <Animated.View className="w-32 h-5 bg-cream-200 rounded mb-3" style={shimmerStyle} />
      <Animated.View className="w-24 h-4 bg-cream-200 rounded" style={shimmerStyle} />
    </View>
  );
}
