import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

interface MilestoneCelebrationProps {
  visible: boolean;
  milestone: number;
  onClose: () => void;
}

const MILESTONE_DATA: Record<number, { badge: string; message: string }> = {
  7: { badge: '🔥', message: 'streak 7 วัน! เริ่มต้นดี!' },
  14: { badge: '⭐', message: 'streak 14 วัน! สม่ำเสมอมาก!' },
  30: { badge: '🏆', message: 'streak 30 วัน! ไม่หยุดเรียน!' },
  50: { badge: '🎖️', message: 'streak 50 วัน! สุดยอด!' },
  100: { badge: '🎯', message: 'streak 100 วัน! ทำได้!' },
  365: { badge: '🌟', message: 'streak 365 วัน! หนึ่งปีเต็ม!' },
};

export function MilestoneCelebration({ visible, milestone, onClose }: MilestoneCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 8,
          stiffness: 160,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const data = MILESTONE_DATA[milestone] ?? { badge: '🎉', message: `streak ${milestone} วัน!` };

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
        <Animated.View
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
            opacity: opacityAnim,
          }}
        >
          {/* Badge */}
          <Animated.Text
            style={{
              fontSize: 64,
              marginBottom: 16,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {data.badge}
          </Animated.Text>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#2C1A0E',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            🎊 {data.message}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#6B4F2A',
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 22,
            }}
          >
            เยี่ยมมาก! คุณทำได้!
          </Text>

          {/* Freeze bonus */}
          <View
            style={{
              backgroundColor: 'rgba(201,168,76,0.12)',
              borderWidth: 1,
              borderColor: '#C9A84C',
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginBottom: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 15, color: '#9A7A2E', fontWeight: '600' }}>
              🛡️ +1 Streak Freeze
            </Text>
          </View>

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
        </Animated.View>
      </View>
    </Modal>
  );
}
