import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UnverifiedBadgeProps {
  compact?: boolean;
}

export function UnverifiedBadge({ compact = false }: UnverifiedBadgeProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [opacity]);

  if (compact) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="warning-outline" size={12} color="#9A7A2E" />
        <Text style={{ fontSize: 11, color: '#9A7A2E' }}>ยังไม่ยืนยัน</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        opacity,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(201,168,76,0.15)',
        borderWidth: 1,
        borderColor: '#C9A84C',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
      }}
      accessibilityLabel="ผลลัพธ์นี้ยังไม่ได้รับการยืนยัน เฉลย AI"
      accessibilityRole="text"
    >
      <Ionicons name="warning-outline" size={16} color="#9A7A2E" />
      <Text style={{ fontSize: 13, fontWeight: '500', color: '#9A7A2E' }}>
        ยังไม่ยืนยัน — เฉลย AI
      </Text>
    </Animated.View>
  );
}
