import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TONE_COLORS } from '../../utils/toneData';

interface CompactToneIndicatorProps {
  toneNumbers: number[];
  onPress?: () => void;
}

export function CompactToneIndicator({ toneNumbers, onPress }: CompactToneIndicatorProps) {
  if (toneNumbers.length === 0) return null;

  const badges = toneNumbers.map((n, i) => {
    const color = TONE_COLORS[n - 1] ?? '#A08060';
    const bgColor = `${color}26`; // 15% opacity hex

    return (
      <View
        key={i}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: bgColor,
          borderRadius: 6,
          paddingHorizontal: 5,
          paddingVertical: 2,
          gap: 3,
        }}
        accessibilityLabel={`เสียงที่ ${n}`}
        accessibilityHint="แตะเพื่อดูรายละเอียด"
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
        <Text style={{ fontSize: 11, fontWeight: '700', color }}>{n}</Text>
      </View>
    );
  });

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'row', gap: 4 }}
        accessibilityRole="button"
      >
        {badges}
      </Pressable>
    );
  }

  return <View style={{ flexDirection: 'row', gap: 4 }}>{badges}</View>;
}
