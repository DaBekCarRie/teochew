import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const BAR_WIDTH = 4;
const BAR_GAP = 3;
const CONTAINER_HEIGHT = 80;
const MIN_HEIGHT = 8;
const MAX_HEIGHT = 72;

interface WaveformVisualizerProps {
  bars: number[];
  live?: boolean;
  playbackProgress?: number;
}

function Bar({ amplitude, live, played }: { amplitude: number; live: boolean; played: boolean }) {
  const height = MIN_HEIGHT + amplitude * (MAX_HEIGHT - MIN_HEIGHT);
  const color = played ? '#B5451B' : live ? '#B5451B' : '#A08060';

  const animStyle = useAnimatedStyle(() => ({
    height: live ? withSpring(height, { damping: 12, stiffness: 180 }) : height,
  }));

  return (
    <Animated.View
      style={[
        {
          width: BAR_WIDTH,
          borderRadius: BAR_WIDTH / 2,
          backgroundColor: color,
          alignSelf: 'center',
        },
        animStyle,
      ]}
    />
  );
}

export function WaveformVisualizer({
  bars,
  live = false,
  playbackProgress,
}: WaveformVisualizerProps) {
  return (
    <View
      style={{
        width: '100%',
        height: CONTAINER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        gap: BAR_GAP,
      }}
      accessibilityLabel="คลื่นเสียง"
      accessibilityElementsHidden
    >
      {bars.map((amplitude, i) => {
        const played = playbackProgress !== undefined && i < bars.length * playbackProgress;
        return <Bar key={i} amplitude={amplitude} live={live} played={played} />;
      })}
    </View>
  );
}
