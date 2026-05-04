import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

function ShimmerBar({ width, height = 18 }: { width: number | `${number}%`; height?: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: '#EDE0C4',
        opacity: anim,
      }}
    />
  );
}

export function ResultSkeleton() {
  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        gap: 12,
      }}
    >
      <View style={{ alignItems: 'center', gap: 8 }}>
        <ShimmerBar width={160} height={32} />
        <ShimmerBar width={120} height={20} />
      </View>

      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginVertical: 4 }} />

      <View style={{ gap: 10 }}>
        <ShimmerBar width={180} />
        <ShimmerBar width={150} />
        <ShimmerBar width={200} />
      </View>

      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginVertical: 4 }} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <ShimmerBar width={'48%' as `${number}%`} height={48} />
        <ShimmerBar width={'48%' as `${number}%`} height={48} />
      </View>
    </View>
  );
}
