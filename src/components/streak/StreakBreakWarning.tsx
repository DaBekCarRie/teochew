import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface StreakBreakWarningProps {
  visible: boolean;
  currentStreak: number;
  freezeCount: number;
  onStudyNow: () => void;
  onUseFreeze: () => void;
  onDismiss: () => void;
}

export function StreakBreakWarning({
  visible,
  currentStreak,
  freezeCount,
  onStudyNow,
  onUseFreeze,
  onDismiss,
}: StreakBreakWarningProps) {
  const hasFreezes = freezeCount > 0;

  function handleFreeze() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUseFreeze();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(44,26,14,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#FAF6EE',
            borderRadius: 20,
            padding: 32,
            width: '100%',
            alignItems: 'center',
            shadowColor: '#2C1A0E',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Icon */}
          <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>

          {/* Title */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#2C1A0E',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            streak จะหาย!
          </Text>

          {/* Message */}
          <Text
            style={{
              fontSize: 15,
              color: '#6B4F2A',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22,
            }}
          >
            เรียนสัก 1 รอบเพื่อรักษา streak {currentStreak} วันไว้นะ
          </Text>

          {/* Study now button */}
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#A03510' : '#B5451B',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              width: '100%',
              marginBottom: 10,
              opacity: pressed ? 0.9 : 1,
            })}
            onPress={onStudyNow}
            accessibilityRole="button"
            accessibilityLabel="เรียนเลย"
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FAF6EE' }}>เรียนเลย</Text>
          </Pressable>

          {/* Freeze button */}
          <Pressable
            style={({ pressed }) => ({
              borderWidth: 1.5,
              borderColor: hasFreezes ? '#C9A84C' : '#D9C9A8',
              paddingVertical: 13,
              borderRadius: 12,
              alignItems: 'center',
              width: '100%',
              marginBottom: 10,
              backgroundColor: pressed && hasFreezes ? 'rgba(201,168,76,0.08)' : 'transparent',
              opacity: hasFreezes ? 1 : 0.5,
            })}
            onPress={hasFreezes ? handleFreeze : undefined}
            accessibilityRole="button"
            accessibilityLabel={hasFreezes ? 'ใช้ Streak Freeze' : 'ไม่มี Streak Freeze เหลือแล้ว'}
            disabled={!hasFreezes}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: hasFreezes ? '#9A7A2E' : '#A08060',
              }}
            >
              {hasFreezes
                ? `ใช้ Streak Freeze 🛡️ (เหลือ ${freezeCount})`
                : 'ไม่มี Streak Freeze เหลือแล้ว'}
            </Text>
          </Pressable>

          {/* Dismiss */}
          <Pressable onPress={onDismiss} accessibilityRole="button" style={{ paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: '#A08060' }}>ปิด</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
