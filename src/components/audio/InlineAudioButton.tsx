import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudio } from '../../hooks/useAudio';

interface InlineAudioButtonProps {
  audioUrl: string | null | undefined;
  wordLabel?: string;
  size?: 'sm' | 'md';
}

export function InlineAudioButton({ audioUrl, wordLabel, size = 'md' }: InlineAudioButtonProps) {
  const { status, play, pause } = useAudio(audioUrl);

  // BR-4: don't render if no URL
  if (!audioUrl) return null;

  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const iconSize = size === 'sm' ? 18 : 20;

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }

  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';
  const isError = status === 'error';

  const bgClass = isPlaying ? 'bg-gold-200' : isError ? 'bg-brick-200' : 'bg-cream-100';

  function iconName(): React.ComponentProps<typeof Ionicons>['name'] {
    if (isPlaying) return 'volume-high';
    if (status === 'paused') return 'volume-medium';
    if (isError) return 'volume-mute';
    return 'volume-low-outline';
  }

  function iconColor() {
    if (isPlaying) return '#C9A84C'; // gold-500
    if (isError) return '#B5451B'; // brick-600
    if (status === 'paused') return '#6B4C2A'; // brown-600
    return '#A08060'; // brown-400
  }

  return (
    <Pressable
      className={`${dim} items-center justify-center ${bgClass} rounded-full`}
      onPress={handlePress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={`เล่นเสียง${wordLabel ? ` ${wordLabel}` : ''}`}
      accessibilityState={{ disabled: isLoading }}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {isLoading ? (
        <ActivityIndicator size={iconSize} color="#C9A84C" />
      ) : (
        <Ionicons name={iconName()} size={iconSize} color={iconColor()} />
      )}
    </Pressable>
  );
}
