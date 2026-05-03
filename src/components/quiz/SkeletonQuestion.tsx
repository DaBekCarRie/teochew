import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function ShimmerBar({ width, height }: { width: number; height: number }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 8,
          backgroundColor: '#EDE0C4',
        },
        style,
      ]}
    />
  );
}

export function SkeletonQuestion() {
  return (
    <View style={{ marginTop: 16 }}>
      {/* Question card skeleton */}
      <View
        style={{
          backgroundColor: '#F5EDD8',
          borderWidth: 1,
          borderColor: '#D9C9A8',
          borderRadius: 14,
          padding: 24,
          alignItems: 'center',
          marginBottom: 16,
          gap: 12,
        }}
      >
        <ShimmerBar width={120} height={40} />
        <ShimmerBar width={80} height={20} />
        <ShimmerBar width={160} height={16} />
      </View>

      {/* Choice skeletons */}
      <View style={{ gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              borderWidth: 1.5,
              borderColor: '#D9C9A8',
              borderRadius: 12,
              height: 56,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: '#FAF6EE',
            }}
          >
            <ShimmerBar width={32} height={32} />
            <ShimmerBar width={160} height={16} />
          </View>
        ))}
      </View>
    </View>
  );
}
