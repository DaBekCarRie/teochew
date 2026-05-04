import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { WaveformVisualizer } from './WaveformVisualizer';
import { formatDuration } from '../../utils/voiceFormatters';

interface PreviewStateViewProps {
  audioUri: string;
  waveformData: number[];
  durationMs: number;
}

export function PreviewStateView({ audioUri, waveformData, durationMs }: PreviewStateViewProps) {
  const player = useAudioPlayer(audioUri, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;
  const currentSec = status.currentTime ?? 0;
  const totalSec = status.duration ?? durationMs / 1000;
  const progress = totalSec > 0 ? currentSec / totalSec : 0;

  const handlePlayStop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      player.pause();
    } else {
      player.seekTo(0);
      player.play();
    }
  }, [isPlaying, player]);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E', marginBottom: 16 }}>
        ตรวจสอบเสียงก่อนส่ง
      </Text>

      <WaveformVisualizer bars={waveformData} live={false} playbackProgress={progress} />

      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, width: '100%' }}
      >
        <Text style={{ fontSize: 11, color: '#A08060' }}>
          {formatDuration(currentSec * 1000)} / {formatDuration(totalSec * 1000)}
        </Text>
      </View>

      <Pressable
        onPress={handlePlayStop}
        style={({ pressed }) => ({
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#C9A84C',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityLabel={isPlaying ? 'หยุดเสียงที่อัดไว้' : 'เล่นเสียงที่อัดไว้'}
        accessibilityRole="button"
      >
        <Ionicons name={isPlaying ? 'stop' : 'play'} size={isPlaying ? 20 : 24} color="#FAF6EE" />
      </Pressable>
    </View>
  );
}
