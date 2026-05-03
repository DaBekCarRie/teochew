import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SyncStatus } from '../../types/dictionary';

interface SyncStatusBarProps {
  status: SyncStatus;
  lastSyncAt: string | null;
  pendingCount: number;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'เมื่อกี้';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} นาทีที่แล้ว`;
  const h = Math.floor(min / 60);
  return `${h} ชั่วโมงที่แล้ว`;
}

export function SyncStatusBar({ status, lastSyncAt, pendingCount }: SyncStatusBarProps) {
  if (status === 'syncing') {
    return (
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator size="small" color="#C9A84C" />
        <Text style={{ fontSize: 12, color: '#C9A84C' }}>กำลังซิงค์...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        accessibilityLiveRegion="polite"
      >
        <Ionicons name="cloud-offline-outline" size={14} color="#B5451B" />
        <Text style={{ fontSize: 12, color: '#B5451B' }}>
          ซิงค์ไม่สำเร็จ · จะลองใหม่เมื่อออนไลน์
        </Text>
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        accessibilityLiveRegion="polite"
      >
        <Ionicons name="cloud-upload-outline" size={14} color="#A08060" />
        <Text style={{ fontSize: 12, color: '#A08060' }}>รอซิงค์ {pendingCount} รายการ</Text>
      </View>
    );
  }

  // synced
  return (
    <View
      style={{
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
      accessibilityLiveRegion="polite"
    >
      <Ionicons name="checkmark-circle-outline" size={14} color="#4A7C59" />
      <Text style={{ fontSize: 12, color: '#4A7C59' }}>
        ซิงค์แล้ว{lastSyncAt ? ` · อัปเดตล่าสุด ${relativeTime(lastSyncAt)}` : ''}
      </Text>
    </View>
  );
}
