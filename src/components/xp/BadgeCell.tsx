import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { BadgeDef, EarnedBadge } from '../../types/dictionary';

interface BadgeCellProps {
  badge: BadgeDef;
  earnedData?: EarnedBadge;
  onPress: () => void;
}

function formatDateShort(isoString: string): string {
  const d = new Date(isoString);
  const months = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear() + 543).slice(-2)}`;
}

export function BadgeCell({ badge, earnedData, onPress }: BadgeCellProps) {
  const isEarned = !!earnedData;

  return (
    <Pressable
      style={({ pressed }) => ({
        width: 80,
        height: 100, // slightly taller to fit content
        backgroundColor: '#F5EDD8', // cream-100
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: isEarned ? 1.5 : 1,
        borderColor: isEarned ? '#C9A84C' : '#D9C9A8', // gold-500 : cream-300
        opacity: pressed ? 0.8 : 1,
      })}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        isEarned
          ? `เหรียญ ${badge.name_th} ได้รับเมื่อ ${formatDateShort(earnedData.earned_at)}`
          : `เหรียญ ${badge.name_th} ยังไม่ได้รับ เงื่อนไข: ${badge.condition_display}`
      }
    >
      <View style={{ opacity: isEarned ? 1 : 0.3 }}>
        <Text style={{ fontSize: 36, textAlign: 'center' }}>{badge.icon}</Text>
      </View>

      <Text
        style={{
          fontSize: 10,
          fontWeight: isEarned ? '600' : '400',
          color: isEarned ? '#2C1A0E' : '#7A5C38',
          textAlign: 'center',
          marginTop: 4,
          flex: 1,
        }}
        numberOfLines={2}
      >
        {isEarned ? badge.name_th : 'ยังไม่ได้'}
      </Text>

      {isEarned ? (
        <Text style={{ fontSize: 9, color: '#A08060', textAlign: 'center' }}>
          {formatDateShort(earnedData.earned_at)}
        </Text>
      ) : (
        <Text style={{ fontSize: 9, color: '#A08060', textAlign: 'center' }} numberOfLines={1}>
          {badge.condition_display}
        </Text>
      )}
    </Pressable>
  );
}
