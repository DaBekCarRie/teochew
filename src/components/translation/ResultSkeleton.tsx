import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

function ShimmerBar({
  width,
  height = 18,
  style,
}: {
  width: number | `${number}%`;
  height?: number;
  style?: object;
}) {
  const anim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.9, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.35, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: '#D9C9A8',
          opacity: anim,
        },
        style,
      ]}
    />
  );
}

export function ResultSkeleton() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      {/* Hero shimmer */}
      <View
        style={{
          backgroundColor: '#EDE0C4',
          alignItems: 'center',
          paddingTop: 28,
          paddingBottom: 24,
          gap: 14,
        }}
      >
        <ShimmerBar
          width={116}
          height={116}
          style={{ borderRadius: 58, backgroundColor: '#C9B48A' }}
        />
        <ShimmerBar width={120} height={22} />
      </View>

      {/* Meanings shimmer */}
      <View
        style={{
          backgroundColor: '#F5EDD8',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 20,
          gap: 12,
        }}
      >
        <ShimmerBar width={180} height={18} />
        <ShimmerBar width={150} height={18} />
        <ShimmerBar width={200} height={18} />

        <View style={{ height: 1, backgroundColor: '#D9C9A8', marginTop: 4, marginBottom: 4 }} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ShimmerBar width={'48%' as `${number}%`} height={48} style={{ borderRadius: 10 }} />
          <ShimmerBar width={'48%' as `${number}%`} height={48} style={{ borderRadius: 10 }} />
        </View>
      </View>
    </View>
  );
}
