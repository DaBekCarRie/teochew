import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface BookmarkButtonProps {
  wordId: string;
  isBookmarked: boolean;
  onToggle: () => void;
  size?: number;
}

export function BookmarkButton({ isBookmarked, onToggle, size = 22 }: BookmarkButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isBookmarked) {
      // Bounce on: 1 → 1.3 → 1
      scale.value = withSequence(
        withSpring(1.3, { duration: 180 }),
        withSpring(1, { duration: 150 }),
      );
    } else {
      // Shrink off: 1 → 0.85 → 1
      scale.value = withSequence(
        withSpring(0.85, { duration: 120 }),
        withSpring(1, { duration: 120 }),
      );
    }
  }, [isBookmarked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  }

  return (
    <Pressable
      className="w-10 h-10 items-center justify-center"
      onPress={handlePress}
      accessibilityRole="togglebutton"
      accessibilityState={{ checked: isBookmarked }}
      accessibilityLabel={isBookmarked ? 'ยกเลิกการบันทึก' : 'บันทึกคำนี้'}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={size}
          color={isBookmarked ? '#C9A84C' : '#A08060'}
        />
      </Animated.View>
    </Pressable>
  );
}
