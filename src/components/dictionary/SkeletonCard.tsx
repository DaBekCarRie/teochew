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
      className="bg-cream-50 border border-cream-300 rounded-[14px] p-4 mb-3 mx-5"
      accessibilityElementsHidden={true}
    >
      <View className="flex-row items-center justify-between">
        <SkeletonBox className="h-7 w-16 bg-cream-200 rounded-md" />
        <SkeletonBox className="h-4 w-20 bg-cream-200 rounded-md" />
      </View>
      <SkeletonBox className="h-3.5 w-24 bg-cream-200 rounded-md mt-2" />

      <View className="border-t border-cream-300 my-2" />

      <SkeletonBox className="h-4 w-36 bg-cream-200 rounded-md" />
      <SkeletonBox className="h-3.5 w-28 bg-cream-200 rounded-md mt-1.5" />

      <View className="flex-row gap-4 mt-1.5">
        <SkeletonBox className="h-3.5 w-20 bg-cream-200 rounded-md" />
        <SkeletonBox className="h-3.5 w-16 bg-cream-200 rounded-md" />
      </View>

      <View className="border-t border-cream-300 my-2" />
      <SkeletonBox className="h-5 w-[60px] bg-cream-200 rounded-[6px]" />
    </View>
  );
}
