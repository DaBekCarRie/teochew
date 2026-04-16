import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface BookmarkButtonProps {
  wordId: string;
  isBookmarked: boolean;
  onToggle: () => void;
  size?: number;
}

export function BookmarkButton({ isBookmarked, onToggle, size = 22 }: BookmarkButtonProps) {
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
      <Ionicons
        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        size={size}
        color={isBookmarked ? '#C9A84C' : '#A08060'}
      />
    </Pressable>
  );
}
