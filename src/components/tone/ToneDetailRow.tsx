import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ToneInfo } from '../../utils/toneData';
import { isShortTone } from '../../utils/pitchContourPath';

interface ToneDetailRowProps {
  tone: ToneInfo;
  isPlaying: boolean;
  isLast: boolean;
  onPlayPress: () => void;
}

export function ToneDetailRow({ tone, isPlaying, isLast, onPlayPress }: ToneDetailRowProps) {
  const short = isShortTone(tone.pitch_contour);

  // Pulse animation on the audio button while playing
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 480, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
        ]),
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      loopRef.current = null;
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [isPlaying, pulseAnim]);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#EDE0C4',
        backgroundColor: isPlaying ? `${tone.color}14` : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      accessibilityLabel={`เสียงที่ ${tone.number} ${tone.name_zh} ${tone.name_th} ระดับเสียง ${tone.pitch_contour} ตัวอย่าง ${tone.example_char} ${tone.example_pengim} แปลว่า ${tone.example_meaning_th}`}
    >
      {/* Color dot */}
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: tone.color,
          marginRight: 12,
          flexShrink: 0,
        }}
      />

      {/* Info block */}
      <View style={{ flex: 1 }}>
        {/* Row 1: number + name */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1A0E' }}>{tone.number}</Text>
          <Text style={{ fontSize: 14, color: '#2C1A0E' }}>{tone.name_zh}</Text>
          <Text style={{ fontSize: 13, color: '#A08060' }}>({tone.name_th})</Text>
        </View>

        {/* Row 2: pitch contour + short indicator + description */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#9A7A2E',
              fontVariant: ['tabular-nums'],
            }}
          >
            {tone.pitch_contour}
          </Text>
          {short && (
            <View
              style={{
                backgroundColor: '#B5451B22',
                borderRadius: 4,
                paddingHorizontal: 4,
                paddingVertical: 1,
              }}
            >
              <Text
                style={{ fontSize: 9, color: '#B5451B', fontWeight: '700', letterSpacing: 0.3 }}
              >
                สั้น
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 12, color: '#A08060' }}>· {tone.description_th}</Text>
        </View>

        {/* Row 3: example char + peng'im + meaning */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
          <Text style={{ fontSize: 16, color: '#2C1A0E' }}>{tone.example_char}</Text>
          <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#9A7A2E' }}>
            {tone.example_pengim}
          </Text>
          <Text style={{ fontSize: 13, color: '#6B4F2A' }}>= {tone.example_meaning_th}</Text>
        </View>
      </View>

      {/* Audio button — shown when audio available */}
      {tone.audio_url !== null && (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable
            onPress={onPlayPress}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isPlaying ? `${tone.color}30` : '#EDE0C4',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
              flexShrink: 0,
            }}
            accessibilityRole="button"
            accessibilityLabel={`เล่นตัวอย่างเสียงที่ ${tone.number}`}
          >
            <Ionicons
              name={isPlaying ? 'volume-high' : 'volume-high-outline'}
              size={18}
              color={isPlaying ? tone.color : '#A08060'}
            />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
