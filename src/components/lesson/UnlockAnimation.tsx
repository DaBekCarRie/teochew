import React, { useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface UnlockAnimationProps {
  visible: boolean;
  unlockedTitle: string;
  onDismiss: () => void;
}

export function UnlockAnimation({ visible, unlockedTitle, onDismiss }: UnlockAnimationProps) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const lockScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      scale.value = 0.6;
      opacity.value = 0;
      lockScale.value = 1;

      opacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
      scale.value = withSpring(1, { damping: 14, stiffness: 160 });

      const hapticTimeout = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        lockScale.value = withSequence(
          withTiming(1.3, { duration: 180 }),
          withSpring(1, { damping: 12 }),
        );
      }, 300);

      return () => clearTimeout(hapticTimeout);
    }
  }, [visible, scale, opacity, lockScale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lockScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(44,26,14,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: '#FAF6EE',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              width: '100%',
              maxWidth: 360,
            },
            containerStyle,
          ]}
        >
          {/* Lock icon */}
          <Animated.View
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#C9A84C',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              },
              lockStyle,
            ]}
          >
            <Ionicons name="lock-open" size={36} color="#FAF6EE" />
          </Animated.View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#2C1A0E',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            ปลดล็อกแล้ว!
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#A08060',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            คุณผ่าน Quiz แล้ว ✨
          </Text>

          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#C9A84C',
              textAlign: 'center',
              marginBottom: 28,
            }}
          >
            บทเรียนถัดไป: {unlockedTitle}
          </Text>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#B8962E' : '#C9A84C',
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              width: '100%',
            })}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="ไปต่อ"
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1A0E' }}>ไปต่อ →</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
