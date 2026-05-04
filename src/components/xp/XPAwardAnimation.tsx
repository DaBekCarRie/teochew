import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface XPAwardAnimationProps {
  amount: number;
  isBonus?: boolean;
  onDone: () => void;
}

export function XPAwardAnimation({ amount, isBonus, onDone }: XPAwardAnimationProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // 1. Appear at center-bottom (opacity 0, translateY 0)
    // 2. FadeIn + slideUp 80px (300ms, ease-out)
    // 3. Hold 500ms
    // 4. FadeOut + slideUp 40px more (300ms)
    // 5. Total duration: ~1100ms

    // Slight delay for bonus so it appears slightly after base if they trigger closely
    const initialDelay = isBonus ? 300 : 0;

    // Play haptic when it actually appears
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }, initialDelay);

    opacity.value = withDelay(
      initialDelay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(500, withTiming(0, { duration: 300 })),
      ),
    );

    translateY.value = withDelay(
      initialDelay,
      withSequence(
        withTiming(-80, { duration: 300 }),
        withDelay(
          500,
          withTiming(-120, { duration: 300 }, (finished) => {
            if (finished) {
              runOnJS(onDone)();
            }
          }),
        ),
      ),
    );
  }, [isBonus, onDone, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`ได้รับ ${amount} XP`}
    >
      <Animated.Text
        className={`text-center ${
          isBonus ? 'text-base font-semibold text-gold-700 mt-1' : 'text-xl font-bold text-gold-500'
        }`}
      >
        +{amount} XP {isBonus ? 'Bonus!' : ''}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    zIndex: 100, // ensure it's above other elements
  },
});
