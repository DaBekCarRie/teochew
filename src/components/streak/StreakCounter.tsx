import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  hasStudiedToday: boolean;
  freezeCount: number;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  hasStudiedToday,
  freezeCount,
}: StreakCounterProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStreak >= 7) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [currentStreak, pulseAnim]);

  const hasMilestoneStreak = currentStreak >= 7;

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: hasMilestoneStreak ? '#C9A84C' : '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#2C1A0E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Fire emoji */}
      <Animated.Text
        style={{
          fontSize: 36,
          marginRight: 12,
          opacity: currentStreak > 0 ? 1 : 0.4,
          transform: [{ scale: currentStreak >= 7 ? pulseAnim : 1 }],
        }}
      >
        🔥
      </Animated.Text>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#2C1A0E' }}>
          {currentStreak} วัน
        </Text>

        {currentStreak > 0 ? (
          <>
            <Text style={{ fontSize: 13, color: '#A08060', marginTop: 2 }}>
              สถิติ: {longestStreak} วัน
            </Text>
            <View
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 20,
                marginTop: 6,
                backgroundColor: hasStudiedToday ? 'rgba(74,124,89,0.12)' : 'rgba(181,69,27,0.10)',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: hasStudiedToday ? '#4A7C59' : '#B5451B',
                }}
              >
                {hasStudiedToday ? '✓ วันนี้เรียนแล้ว' : 'ยังไม่เรียนวันนี้'}
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ fontSize: 14, color: '#9A7A2E', marginTop: 4 }}>
            เริ่มสร้าง streak วันนี้!
          </Text>
        )}
      </View>

      {/* Freeze indicator */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#A08060' }}>🛡️ ×{freezeCount}</Text>
      </View>
    </View>
  );
}
