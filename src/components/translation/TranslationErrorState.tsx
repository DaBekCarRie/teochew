import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
  rate_limit: {
    icon: '⏱',
    title: 'เกินจำนวนการแปลในขณะนี้',
    subtitle: 'กรุณารอสักครู่แล้วลองใหม่',
    showRetry: true,
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
        <View style={styles.retryWrap}>
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            accessibilityLabel="ลองใหม่อีกครั้ง"
            accessibilityRole="button"
          >
            <View style={styles.retryBtn}>
              <Text style={styles.retryText}>ลองใหม่</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  retryWrap: {
    marginTop: 16,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: '#B5451B',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B5451B',
  },
});
