import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { WaveformVisualizer } from './WaveformVisualizer';
import { NoiseWarningBanner } from './NoiseWarningBanner';
import { formatDuration } from '../../utils/voiceFormatters';

interface RecordingStateViewProps {
  waveformData: number[];
  durationMs: number;
  noiseWarning: boolean;
}

export function RecordingStateView({
  waveformData,
  durationMs,
  noiseWarning,
}: RecordingStateViewProps) {
  const remainingSec = Math.max(0, Math.floor((60000 - durationMs) / 1000));
  const progress = Math.min(1, durationMs / 60000);
  const timerColor = remainingSec <= 10 ? '#B5451B' : '#2C1A0E';

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%` as `${number}%`, { duration: 200 }),
  }));

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      {noiseWarning && <NoiseWarningBanner />}

      <WaveformVisualizer bars={waveformData} live />

      <Text
        style={{
          fontSize: 40,
          fontWeight: '700',
          color: timerColor,
          textAlign: 'center',
          marginTop: 16,
        }}
        accessibilityLabel={`เวลาที่อัด ${formatDuration(durationMs)}`}
      >
        {formatDuration(durationMs)}
      </Text>

      <View
        style={{
          marginTop: 8,
          width: '100%',
          height: 4,
          backgroundColor: '#EDE0C4',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[{ height: '100%', backgroundColor: '#B5451B', borderRadius: 2 }, fillStyle]}
        />
      </View>

      {remainingSec <= 10 && (
        <Text style={{ fontSize: 11, color: '#B5451B', alignSelf: 'flex-end', marginTop: 4 }}>
          เหลือ {remainingSec}s
        </Text>
      )}
    </View>
  );
}
