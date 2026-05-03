import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CARD_SHADOW = {
  shadowColor: '#2C1A0E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

interface OverviewCardsProps {
  totalWordsLearned: number;
  totalWordsMastered: number;
  totalStudyTimeMs: number;
  lessonsCompleted: number;
  totalLessons: number;
  isEmpty: boolean;
}

function formatStudyTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h} ชม. ${m} น.`;
  if (m > 0) return `${m} นาที`;
  return `${totalSec} วิ`;
}

interface StatCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  value: string;
  label: string;
  accessibilityLabel: string;
}

function StatCard({ icon, iconColor, value, label, accessibilityLabel }: StatCardProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          minWidth: '45%',
          backgroundColor: '#F5EDD8',
          borderWidth: 1,
          borderColor: '#D9C9A8',
          borderRadius: 14,
          padding: 16,
        },
        CARD_SHADOW,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={24} color={iconColor} style={{ marginBottom: 8 }} />
      <Text style={{ fontSize: 24, fontWeight: '700', color: '#2C1A0E' }}>{value}</Text>
      <Text style={{ fontSize: 12, color: '#A08060', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export function OverviewCards({
  totalWordsLearned,
  totalWordsMastered,
  totalStudyTimeMs,
  lessonsCompleted,
  totalLessons,
  isEmpty,
}: OverviewCardsProps) {
  return (
    <View style={{ marginTop: 16 }}>
      {isEmpty && (
        <Text style={{ fontSize: 13, color: '#A08060', textAlign: 'center', marginBottom: 12 }}>
          เริ่มเรียนบทแรกกันเลย!
        </Text>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard
          icon="book-outline"
          iconColor="#C9A84C"
          value={String(totalWordsLearned)}
          label="คำที่เรียนแล้ว"
          accessibilityLabel={`คำที่เรียนแล้ว ${totalWordsLearned}`}
        />
        <StatCard
          icon="trophy-outline"
          iconColor="#4A7C59"
          value={String(totalWordsMastered)}
          label="คำที่จำแม่น"
          accessibilityLabel={`คำที่จำแม่น ${totalWordsMastered}`}
        />
        <StatCard
          icon="time-outline"
          iconColor="#4A6FA5"
          value={formatStudyTime(totalStudyTimeMs)}
          label="เวลาเรียนรวม"
          accessibilityLabel={`เวลาเรียนรวม ${formatStudyTime(totalStudyTimeMs)}`}
        />
        <StatCard
          icon="school-outline"
          iconColor="#B5451B"
          value={`${lessonsCompleted}/${totalLessons}`}
          label="บทเรียนที่ผ่าน"
          accessibilityLabel={`บทเรียนที่ผ่านแล้ว ${lessonsCompleted} จาก ${totalLessons}`}
        />
      </View>
    </View>
  );
}
