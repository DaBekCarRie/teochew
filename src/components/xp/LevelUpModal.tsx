import React, { useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getNextLevel, LEVELS } from '../../utils/levelThresholds';

interface LevelUpModalProps {
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpModal({ newLevel, onDismiss }: LevelUpModalProps) {
  // Find the level definition
  const levelDef = LEVELS.find((l) => l.level === newLevel);

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    backdropOpacity.value = withTiming(1, { duration: 200 });
    cardScale.value = withSpring(1, { damping: 15, stiffness: 200 });

    // Bounce emoji
    emojiScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 }),
      ),
    );
  }, []);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedEmojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  function handleDismiss() {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    cardScale.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        import('react-native-reanimated').then(({ runOnJS }) => {
          runOnJS(onDismiss)();
        });
      }
    });
  }

  if (!levelDef) return null;

  return (
    <Modal transparent visible animationType="none">
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'rgba(44,26,14,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedBackdropStyle,
        ]}
      >
        <Animated.View
          className="bg-cream-50 rounded-[20px] p-8 items-center justify-center w-[85%] max-w-[340px]"
          style={animatedCardStyle}
        >
          <Animated.Text style={[{ fontSize: 64, marginBottom: 16 }, animatedEmojiStyle]}>
            {levelDef.emoji}
          </Animated.Text>

          <Text className="text-xl font-bold text-brown-900 text-center">🎉 Level Up!</Text>

          <Text className="text-lg font-semibold text-brown-900 mt-2 text-center">
            ระดับ {levelDef.level}: {levelDef.nameTh}
          </Text>
          <Text className="text-base text-gold-700 mt-1 text-center font-serif">
            {levelDef.nameTeochew}
          </Text>

          <Pressable
            className="bg-brick-600 rounded-[10px] px-8 py-3 mt-6 w-full items-center"
            onPress={handleDismiss}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-base font-semibold text-cream-50">เยี่ยม!</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
