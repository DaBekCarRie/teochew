import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { ErrorType } from '../../types/translation';

interface ErrorConfig {
  icon: string;
  title: string;
  subtitle: string;
  showRetry: boolean;
}

const ERROR_MAP: Record<NonNullable<ErrorType>, ErrorConfig> = {
  network: {
    icon: '📡',
    title: 'ไม่มีอินเทอร์เน็ต',
    subtitle: 'กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่',
    showRetry: true,
  },
  rate_limit_google: {
    icon: '⏱',
    title: 'เกินจำนวนการแปลในขณะนี้',
    subtitle: 'กรุณารอสักครู่แล้วลองใหม่',
    showRetry: true,
  },
  rate_limit_claude: {
    icon: '🤖',
    title: 'ใช้การแปล AI ครบ 20 ครั้งแล้ววันนี้',
    subtitle: 'จะรีเซ็ตอีกครั้งตอนเที่ยงคืน',
    showRetry: false,
  },
  unknown: {
    icon: '⚠️',
    title: 'ไม่สามารถแปลได้ในขณะนี้',
    subtitle: 'กรุณาลองใหม่อีกครั้ง',
    showRetry: true,
  },
};

interface TranslationErrorStateProps {
  errorType: ErrorType;
  onRetry: () => void;
}

export function TranslationErrorState({ errorType, onRetry }: TranslationErrorStateProps) {
  const config = ERROR_MAP[errorType ?? 'unknown'];

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 16,
        padding: 24,
        marginTop: 8,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 48 }}>{config.icon}</Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#2C1A0E',
          marginTop: 12,
          textAlign: 'center',
        }}
      >
        {config.title}
      </Text>
      <Text style={{ fontSize: 13, color: '#A08060', textAlign: 'center', marginTop: 6 }}>
        {config.subtitle}
      </Text>
      {config.showRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => ({
            marginTop: 16,
            borderWidth: 1,
            borderColor: '#B5451B',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityLabel="ลองใหม่อีกครั้ง"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#B5451B' }}>ลองใหม่</Text>
        </Pressable>
      )}
    </View>
  );
}
