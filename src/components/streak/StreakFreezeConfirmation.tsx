import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

interface StreakFreezeConfirmationProps {
  visible: boolean;
  remainingFreezes: number;
  onClose: () => void;
}

export function StreakFreezeConfirmation({
  visible,
  remainingFreezes,
  onClose,
}: StreakFreezeConfirmationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 10,
        stiffness: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

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
          <Animated.Text
            style={{
              fontSize: 56,
              marginBottom: 16,
              transform: [{ scale: scaleAnim }],
            }}
          >
            🛡️
          </Animated.Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#2C1A0E',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            ใช้ Streak Freeze แล้ว!
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#6B4F2A',
              textAlign: 'center',
              marginBottom: 6,
              lineHeight: 22,
            }}
          >
            streak ของคุณปลอดภัย
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: '#A08060',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            เหลืออีก {remainingFreezes} ครั้ง
          </Text>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#A03510' : '#B5451B',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              width: '100%',
              opacity: pressed ? 0.9 : 1,
            })}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FAF6EE' }}>เยี่ยม!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
