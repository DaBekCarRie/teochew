import React, { useCallback } from 'react';
import { Pressable, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudio } from '../../hooks/useAudio';

interface CardAudioButtonProps {
  audioUrl: string | null | undefined;
  size?: 'md' | 'sm';
}

export function CardAudioButton({ audioUrl, size = 'md' }: CardAudioButtonProps) {
  const { status, play, stop } = useAudio(audioUrl ?? null);
  const iconSize = size === 'sm' ? 18 : 22;
  const containerClass = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation(); // prevent flip
      if (!audioUrl) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (status === 'playing') {
        stop();
      } else {
        play();
      }
    },
    [audioUrl, status, play, stop],
  );

  if (!audioUrl) {
    return (
      <Pressable
        className={`${containerClass} items-center justify-center rounded-full bg-cream-200 mt-4`}
        style={{ opacity: 0.4 }}
        disabled
        accessibilityLabel="ไม่มีเสียง"
        accessibilityRole="button"
      >
        <Ionicons name="volume-mute-outline" size={iconSize} color="#A08060" />
      </Pressable>
    );
  }

  const bgClass =
    status === 'playing' ? 'bg-gold-200' : status === 'error' ? 'bg-brick-200' : 'bg-cream-100';

  const iconName: React.ComponentProps<typeof Ionicons>['name'] =
    status === 'loading'
      ? 'reload-outline'
      : status === 'error'
        ? 'volume-mute-outline'
        : status === 'playing'
          ? 'volume-high'
          : 'volume-low-outline';

  const iconColor = status === 'playing' ? '#9A7A2E' : status === 'error' ? '#B5451B' : '#C9A84C';

  const accessLabel = status === 'playing' ? 'หยุดเล่นเสียง' : 'เล่นเสียงออกเสียง';

  return (
    <Pressable
      className={`${containerClass} items-center justify-center rounded-full mt-4 ${bgClass}`}
      onPress={handlePress}
      disabled={status === 'loading'}
      accessibilityLabel={accessLabel}
      accessibilityRole="button"
    >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
  );
}
