import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { WordEntry } from '../../types/dictionary';

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctWord: WordEntry;
}

export function FeedbackBanner({ isCorrect, correctWord }: FeedbackBannerProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const borderColor = isCorrect ? '#4A7C59' : '#B5451B';
  const bgColor = isCorrect ? 'rgba(74,124,89,0.10)' : 'rgba(181,69,27,0.10)';
  const textColor = isCorrect ? '#4A7C59' : '#B5451B';

  const mandarin = [correctWord.mandarin_char, correctWord.english_meaning]
    .filter(Boolean)
    .join(' · ');

  return (
    <Animated.View
      style={[
        {
          borderRadius: 14,
          padding: 16,
          marginTop: 16,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bgColor,
        },
        animStyle,
      ]}
      accessibilityLiveRegion="polite"
    >
      {/* Title row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={textColor}
        />
        <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>
          {isCorrect ? 'ถูกต้อง! 🎉' : 'ไม่ถูกต้อง'}
        </Text>
      </View>

      {!isCorrect && (
        <Text style={{ fontSize: 13, color: textColor, marginTop: 4, marginLeft: 32 }}>
          คำตอบที่ถูกต้องคือ...
        </Text>
      )}

      {/* Supplementary info */}
      <View style={{ marginTop: 12, marginLeft: 32 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#2C1A0E' }}>
          {correctWord.teochew_char} ({correctWord.teochew_pengim}) = {correctWord.thai_meaning}
        </Text>
        {mandarin ? (
          <Text style={{ fontSize: 12, color: '#A08060', marginTop: 4 }}>{mandarin}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}
