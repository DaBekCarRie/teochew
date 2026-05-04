import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import type { VoiceErrorType } from '../../types/voice';

interface ErrorConfig {
  icon: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryAction: 'retry' | 'rerecord' | 'settings' | 'low_confidence_result';
  secondaryLabel?: string;
  secondaryAction?: 'rerecord';
}

const ERROR_MAP: Record<NonNullable<VoiceErrorType>, ErrorConfig> = {
  mic_permission_denied: {
    icon: '🎙️',
    title: 'ไม่มีสิทธิ์ใช้ไมค์',
    subtitle: 'กรุณาอนุญาตการเข้าถึงไมโครโฟนในการตั้งค่า',
    primaryLabel: 'เปิดการตั้งค่า',
    primaryAction: 'settings',
  },
  too_short: {
    icon: '⏱',
    title: 'เสียงสั้นเกินไป',
    subtitle: 'กดปุ่มค้างไว้นานกว่านี้เพื่ออัดเสียง',
    primaryLabel: 'ลองใหม่',
    primaryAction: 'rerecord',
  },
  low_confidence: {
    icon: '🤔',
    title: 'เสียงไม่ชัด',
    subtitle: 'ลองอัดในที่เงียบ พูดให้ชัดเจนมากขึ้น',
    primaryLabel: 'อัดใหม่',
    primaryAction: 'rerecord',
    secondaryLabel: 'ดูผลกรรมๆ',
    secondaryAction: 'rerecord',
  },
  silence: {
    icon: '🔇',
    title: 'ไม่พบเสียง',
    subtitle: 'กรุณาพูดให้ดังเจมากขึ้น',
    primaryLabel: 'อัดใหม่',
    primaryAction: 'rerecord',
  },
  upload_failed: {
    icon: '📡',
    title: 'อัดเหลือไม่สำเร็จ',
    subtitle: 'ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
    primaryLabel: 'ลองอีกครั้ง',
    primaryAction: 'retry',
  },
  transcription_failed: {
    icon: '⚠️',
    title: 'ถอดเสียงไม่สำเร็จ',
    subtitle: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    primaryLabel: 'ลองอีกครั้ง',
    primaryAction: 'retry',
    secondaryLabel: 'อัดใหม่',
    secondaryAction: 'rerecord',
  },
  timeout: {
    icon: '⏰',
    title: 'ใช้เวลานานเกินไป',
    subtitle: 'การเชื่อมต่อช้า กรุณาลองใหม่',
    primaryLabel: 'ลองอีกครั้ง',
    primaryAction: 'retry',
    secondaryLabel: 'อัดใหม่',
    secondaryAction: 'rerecord',
  },
  network: {
    icon: '📵',
    title: 'ไม่มีอินเทอร์เน็ต',
    subtitle: 'ตรวจสอบการเชื่อมต่อแล้วกลับมาลองใหม่',
    primaryLabel: 'ลองอีกครั้ง',
    primaryAction: 'retry',
  },
};

interface VoiceErrorStateProps {
  errorType: VoiceErrorType | null;
  onRetry: () => void;
  onReRecord: () => void;
}

export function VoiceErrorState({ errorType, onRetry, onReRecord }: VoiceErrorStateProps) {
  const cfg = errorType ? ERROR_MAP[errorType] : ERROR_MAP.network;

  function handlePrimary() {
    if (cfg.primaryAction === 'settings') {
      Linking.openSettings();
    } else if (cfg.primaryAction === 'retry') {
      onRetry();
    } else {
      onReRecord();
    }
  }

  return (
    <View
      style={{ alignItems: 'center', paddingHorizontal: 16 }}
      accessibilityLabel={`${cfg.title}: ${cfg.subtitle}`}
      accessibilityLiveRegion="assertive"
    >
      <Text style={{ fontSize: 64 }}>{cfg.icon}</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        {cfg.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        {cfg.subtitle}
      </Text>

      <Pressable
        onPress={handlePrimary}
        style={({ pressed }) => ({
          backgroundColor: '#B5451B',
          borderRadius: 12,
          paddingHorizontal: 24,
          paddingVertical: 12,
          marginTop: 24,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FAF6EE' }}>
          {cfg.primaryLabel}
        </Text>
      </Pressable>

      {cfg.secondaryLabel && (
        <Pressable
          onPress={onReRecord}
          style={({ pressed }) => ({ marginTop: 12, opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={{ fontSize: 14, color: '#6B4C2A' }}>{cfg.secondaryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
