import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { VoiceState } from '../../types/voice';

interface PipelineLoadingViewProps {
  state: 'uploading' | 'transcribing' | 'looking_up';
  uploadProgress: number;
}

const STEPS: { state: VoiceState; icon: string; label: string }[] = [
  { state: 'uploading', icon: '☁️', label: 'กำลังอัดเหลือเสียง...' },
  { state: 'transcribing', icon: '🎙️', label: 'กำลังถอดเสียง...' },
  { state: 'looking_up', icon: '📖', label: 'กำลังค้นหาคำแปล...' },
];

export function PipelineLoadingView({ state, uploadProgress }: PipelineLoadingViewProps) {
  const currentIndex = STEPS.findIndex((s) => s.state === state);
  const step = STEPS[currentIndex];

  const bounce = useSharedValue(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(withTiming(-8, { duration: 500 }), withTiming(0, { duration: 500 })),
      -1,
    );
  }, [bounce]);

  useEffect(() => {
    if (state === 'uploading') {
      barWidth.value = withSpring(uploadProgress, { damping: 20 });
    }
  }, [uploadProgress, state, barWidth]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as `${number}%`,
  }));

  return (
    <View
      style={{ alignItems: 'center', width: '100%' }}
      accessibilityLabel={`กำลังประมวลผล ${step?.label ?? ''}`}
      accessibilityLiveRegion="polite"
    >
      {/* Step dots */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <View key={s.state} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor:
                  i < currentIndex ? '#C9A84C' : i === currentIndex ? '#B5451B' : '#D9C9A8',
              }}
            />
            {i < STEPS.length - 1 && (
              <View
                style={{ width: 40, height: 1, backgroundColor: '#D9C9A8', marginHorizontal: 4 }}
              />
            )}
          </View>
        ))}
      </View>

      {/* Step labels */}
      <View style={{ flexDirection: 'row', marginTop: 6, gap: 20 }}>
        {STEPS.map((s, i) => (
          <Text
            key={s.state}
            style={{
              fontSize: 10,
              color: i === currentIndex ? '#2C1A0E' : '#A08060',
              fontWeight: i === currentIndex ? '600' : '400',
              textAlign: 'center',
              width: 60,
            }}
          >
            {['อัดเหลือ', 'ถอดเสียง', 'ค้นหา'][i]}
          </Text>
        ))}
      </View>

      {/* Bouncing icon */}
      <Animated.Text style={[{ fontSize: 64, marginTop: 32 }, iconStyle]}>
        {step?.icon ?? '⏳'}
      </Animated.Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        {step?.label ?? ''}
      </Text>

      {state === 'uploading' && (
        <View style={{ width: '100%', marginTop: 16 }}>
          <View
            style={{ height: 6, backgroundColor: '#EDE0C4', borderRadius: 3, overflow: 'hidden' }}
          >
            <Animated.View
              style={[{ height: '100%', backgroundColor: '#B5451B', borderRadius: 3 }, fillStyle]}
            />
          </View>
          <Text style={{ fontSize: 11, color: '#A08060', textAlign: 'right', marginTop: 4 }}>
            {Math.round(uploadProgress)}%
          </Text>
        </View>
      )}
    </View>
  );
}
