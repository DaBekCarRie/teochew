import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import type { MasteryLevel } from '../../types/dictionary';

interface MasteryBreakdownProps {
  breakdown: Record<MasteryLevel, number>;
}

const LEVELS: { key: MasteryLevel; label: string; color: string }[] = [
  { key: 'mastered', label: 'เชี่ยวชาญ', color: '#4A7C59' },
  { key: 'reviewing', label: 'ทบทวน', color: '#C9A84C' },
  { key: 'learning', label: 'กำลังเรียน', color: '#4A6FA5' },
  { key: 'new', label: 'ใหม่', color: '#D9C9A8' },
];

export function MasteryBreakdown({ breakdown }: MasteryBreakdownProps) {
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0);

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E', marginBottom: 14 }}>
        ระดับความจำ
      </Text>

      {LEVELS.map(({ key, label, color }) => {
        const count = breakdown[key];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const barWidth: ViewStyle['width'] = total > 0 ? `${pct}%` : '0%';

        return (
          <View
            key={key}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}
            accessibilityLabel={`${label} ${count} คำ คิดเป็น ${pct} เปอร์เซ็นต์`}
          >
            {/* Dot */}
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />

            {/* Label */}
            <Text style={{ fontSize: 13, color: '#2C1A0E', width: 88 }}>{label}</Text>

            {/* Bar track */}
            <View
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#EDE0C4',
                overflow: 'hidden',
              }}
            >
              <View
                style={{ height: 8, borderRadius: 4, backgroundColor: color, width: barWidth }}
              />
            </View>

            {/* Count + pct */}
            <Text
              style={{
                fontSize: 12,
                color: '#2C1A0E',
                fontWeight: '600',
                width: 24,
                textAlign: 'right',
              }}
            >
              {count}
            </Text>
            <Text style={{ fontSize: 11, color: '#A08060', width: 36 }}>({pct}%)</Text>
          </View>
        );
      })}

      {total === 0 && (
        <Text style={{ fontSize: 13, color: '#A08060', textAlign: 'center', paddingTop: 4 }}>
          ยังไม่มีข้อมูล — เริ่มเรียน Flashcard ได้เลย
        </Text>
      )}
    </View>
  );
}
