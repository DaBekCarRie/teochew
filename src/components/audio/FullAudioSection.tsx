import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudio } from '../../hooks/useAudio';

interface FullAudioSectionProps {
  audioUrl: string | null | undefined;
  wordTeochew: string;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function FullAudioSection({ audioUrl, wordTeochew }: FullAudioSectionProps) {
  const {
    status,
    isPlaying,
    isLoading,
    currentRate,
    error,
    positionMs,
    durationMs,
    play,
    pause,
    replay,
    toggleSlowMode,
  } = useAudio(audioUrl);

  const handlePlayPause = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleReplay = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    replay();
  }, [replay]);

  const handleSlowMode = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSlowMode();
  }, [toggleSlowMode]);

  const isSlowMode = currentRate === 0.75;
  const progress = durationMs > 0 ? positionMs / durationMs : 0;
  const canReplay = status !== 'idle';

  // Primary button icon
  function primaryIcon(): React.ComponentProps<typeof Ionicons>['name'] {
    if (status === 'finished') return 'refresh';
    if (isPlaying) return 'pause';
    return 'play';
  }

  function primaryLabel() {
    if (isLoading) return 'กำลังโหลด...';
    if (isPlaying) return 'กำลังเล่น...';
    if (status === 'paused') return 'หยุดอยู่';
    if (status === 'finished') return 'เล่นอีกครั้ง';
    if (status === 'error') return 'ไม่สามารถโหลดเสียงได้';
    return 'แตะเพื่อฟัง';
  }

  return (
    <View className="mb-4">
      {/* Section header */}
      <Text className="text-xs font-semibold text-brown-400 uppercase tracking-widest mb-2">
        การออกเสียง
      </Text>

      {/* No audio placeholder */}
      {!audioUrl ? (
        <View className="bg-cream-100 border border-dashed border-cream-300 rounded-[14px] px-5 py-6 items-center gap-2">
          <Ionicons name="volume-mute-outline" size={28} color="#A08060" style={{ opacity: 0.5 }} />
          <Text className="text-sm text-brown-400">ยังไม่มีเสียงสำหรับคำนี้</Text>
        </View>
      ) : (
        <View className="bg-cream-100 border border-cream-300 rounded-[14px] px-5 py-5">
          {/* Error state */}
          {status === 'error' && error ? (
            <View className="items-center gap-3">
              <Ionicons name="alert-circle-outline" size={32} color="#B5451B" />
              <Text className="text-sm text-brown-900 text-center font-medium">
                ไม่สามารถโหลดเสียงได้
              </Text>
              <Text className="text-xs text-brown-400 text-center">{error.message}</Text>
              <Pressable
                className="border border-gold-500 px-5 py-2 rounded-full"
                onPress={handlePlayPause}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                accessibilityRole="button"
                accessibilityLabel="ลองใหม่"
              >
                <Text className="text-sm font-medium text-gold-700">ลองใหม่</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Primary play/pause button */}
              <View className="items-center gap-1">
                <Pressable
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={({ pressed }) => [
                    {
                      backgroundColor: status === 'paused' ? '#C9A84C' : '#B5451B',
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      shadowColor: '#2C1A0E',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 3,
                    },
                  ]}
                  onPress={handlePlayPause}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel={`${primaryLabel()} ${wordTeochew}`}
                >
                  {isLoading ? (
                    <ActivityIndicator size={24} color="#FAF6EE" />
                  ) : (
                    <Ionicons name={primaryIcon()} size={24} color="#FAF6EE" />
                  )}
                </Pressable>
                <Text className="text-xs text-brown-400 mt-1">{primaryLabel()}</Text>
              </View>

              {/* Progress bar */}
              <View className="mt-4">
                <View className="h-1 bg-cream-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-gold-500 rounded-full"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-[10px] text-brown-400">{formatTime(positionMs)}</Text>
                  <Text className="text-[10px] text-brown-400">
                    {durationMs > 0 ? formatTime(durationMs) : '--:--'}
                  </Text>
                </View>
              </View>

              {/* Secondary controls */}
              <View className="flex-row justify-center gap-3 mt-4">
                {/* Slow mode toggle */}
                <Pressable
                  className={`px-4 py-2 rounded-[10px] border-[1.5px] items-center justify-center ${
                    isSlowMode ? 'bg-gold-200 border-gold-500' : 'bg-cream-200 border-cream-300'
                  }`}
                  onPress={handleSlowMode}
                  accessibilityRole="togglebutton"
                  accessibilityState={{ checked: isSlowMode }}
                  accessibilityLabel={`ความเร็วเสียง ${isSlowMode ? 'ช้า' : 'ปกติ'}`}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text
                    className={`text-sm font-medium ${isSlowMode ? 'text-gold-700' : 'text-brown-600'}`}
                  >
                    {isSlowMode ? '🐢 0.75x' : '🐢 ช้า'}
                  </Text>
                </Pressable>

                {/* Replay */}
                <Pressable
                  className="px-4 py-2 items-center justify-center"
                  onPress={handleReplay}
                  disabled={!canReplay}
                  accessibilityRole="button"
                  accessibilityLabel="เล่นเสียงใหม่"
                  style={({ pressed }) => ({ opacity: !canReplay ? 0.4 : pressed ? 0.7 : 1 })}
                >
                  <Text className="text-sm font-medium text-brown-600">↺ เล่นใหม่</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}
