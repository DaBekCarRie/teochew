import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface RecordButtonProps {
  recording?: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export function RecordButton({ recording = false, onPressIn, onPressOut }: RecordButtonProps) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (recording) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.3, { duration: 750 }), withTiming(1, { duration: 750 })),
        -1,
      );
      pulseOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 750 }), withTiming(0, { duration: 750 })),
        -1,
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0);
    }
  }, [recording, pulseScale, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  function handlePressIn() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPressIn?.();
  }

  function handlePressOut() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPressOut?.();
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 112, height: 112, alignItems: 'center', justifyContent: 'center' }}>
        {recording && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 112,
                height: 112,
                borderRadius: 56,
                borderWidth: 3,
                borderColor: 'rgba(181,69,27,0.3)',
              },
              pulseStyle,
            ]}
          />
        )}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => ({
            width: 88,
            height: 88,
            borderRadius: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: recording ? '#7A2E0F' : '#B5451B',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityLabel={recording ? 'กำลังอัดเสียง' : 'ปุ่มอัดเสียง'}
          accessibilityHint={
            recording ? 'ปล่อยนิ้วเพื่อหยุดการอัด' : 'กดปุ่มนี้ค้างไว้เพื่อเริ่มอัดเสียงแต้จิ๋ว'
          }
          accessibilityRole="button"
        >
          {recording ? (
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: '#FAF6EE',
                borderRadius: 4,
              }}
            />
          ) : (
            <Ionicons name="mic" size={36} color="#FAF6EE" />
          )}
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: 12,
          marginTop: 12,
          color: recording ? '#B5451B' : '#A08060',
        }}
      >
        {recording ? 'ปล่อยเพื่อหยุด' : 'กดค้างเพื่ออัด'}
      </Text>
    </View>
  );
}
