import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

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
        { width, height, borderRadius: height / 2, backgroundColor: '#D9C9A8', opacity: anim },
        style,
      ]}
    />
  );
}

export function ResultSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      <View style={styles.body}>
        {/* Source shimmer */}
        <View style={styles.shimmerRow}>
          <ShimmerBar width={24} height={24} style={{ borderRadius: 12 }} />
          <ShimmerBar width={140} height={16} />
        </View>

        <View style={styles.divider} />

        {/* Output shimmer */}
        <View style={styles.shimmerRow}>
          <ShimmerBar width={24} height={24} style={{ borderRadius: 12 }} />
          <View style={{ flex: 1, gap: 8 }}>
            <ShimmerBar width={'80%' as `${number}%`} height={22} />
            <ShimmerBar width={'55%' as `${number}%`} height={22} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Action row shimmer */}
        <View style={styles.actionRow}>
          <ShimmerBar width={'48%' as `${number}%`} height={46} style={{ borderRadius: 10 }} />
          <ShimmerBar width={'48%' as `${number}%`} height={46} style={{ borderRadius: 10 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#D9C9A8',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#6B4C2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    backgroundColor: '#FAF6EE',
  },
  accentBar: {
    height: 5,
    backgroundColor: '#C9A84C',
    opacity: 0.4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 14,
  },
  shimmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE0C4',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
