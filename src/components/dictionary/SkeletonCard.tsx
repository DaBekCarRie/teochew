import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

function SkeletonBox({ className }: { className: string }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1.0,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={{ opacity }} className={className} />;
}

export function SkeletonCard() {
  return (
    <View
      className="bg-white dark:bg-[#2C2C2E] rounded-xl p-3 mb-2 mx-4"
      accessibilityElementsHidden={true}
    >
      {/* ROW 1: teochew_char + verified placeholder */}
      <View className="flex-row items-center justify-between">
        <SkeletonBox className="h-7 w-16 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
        <SkeletonBox className="h-4 w-20 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
      </View>
      {/* ROW 2: pengim */}
      <SkeletonBox className="h-3.5 w-24 bg-gray-200 dark:bg-[#3A3A3C] rounded-md mt-2" />

      <View className="border-t border-gray-100 dark:border-[#3A3A3C] my-2" />

      {/* ROW 3: thai + english */}
      <View className="flex-row gap-4">
        <SkeletonBox className="h-4 w-28 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
        <SkeletonBox className="h-4 w-20 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
      </View>
      {/* ROW 4: mandarin */}
      <View className="flex-row gap-4 mt-1">
        <SkeletonBox className="h-4 w-24 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
        <SkeletonBox className="h-4 w-16 bg-gray-200 dark:bg-[#3A3A3C] rounded-md" />
      </View>

      <View className="border-t border-gray-100 dark:border-[#3A3A3C] my-2" />

      {/* ROW 5: category badge placeholder */}
      <SkeletonBox className="h-5 w-[72px] bg-gray-200 dark:bg-[#3A3A3C] rounded-lg" />
    </View>
  );
}
