import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';

interface UseCardFlipReturn {
  isFlipped: boolean;
  isAnimating: boolean;
  frontStyle: ReturnType<typeof useAnimatedStyle>;
  backStyle: ReturnType<typeof useAnimatedStyle>;
  flip: () => void;
  resetFlip: () => void;
}

export function useCardFlip(): UseCardFlipReturn {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const flipProgress = useSharedValue(0); // 0 = front, 1 = back

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flipProgress.value * 180}deg` }],
    opacity: flipProgress.value < 0.5 ? 1 : 0,
    // backfaceVisibility not supported in reanimated style — handled by opacity
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flipProgress.value * 180 + 180}deg` }],
    opacity: flipProgress.value >= 0.5 ? 1 : 0,
  }));

  const flip = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const target = flipProgress.value < 0.5 ? 1 : 0;
    flipProgress.value = withTiming(
      target,
      { duration: 300, easing: Easing.inOut(Easing.ease) },
      () => {
        runOnJS(setIsFlipped)(target === 1);
        runOnJS(setIsAnimating)(false);
      },
    );
  }, [isAnimating, flipProgress]);

  const resetFlip = useCallback(() => {
    flipProgress.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setIsFlipped)(false);
    });
  }, [flipProgress]);

  return { isFlipped, isAnimating, frontStyle, backStyle, flip, resetFlip };
}
