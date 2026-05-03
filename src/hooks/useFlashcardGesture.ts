import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

interface UseFlashcardGestureOptions {
  isAnimating: boolean; // block swipe during flip
  onSwipeComplete: (direction: 'left' | 'right') => void;
}

interface UseFlashcardGestureReturn {
  panGesture: ReturnType<typeof Gesture.Pan>;
  cardAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  rightOverlayStyle: ReturnType<typeof useAnimatedStyle>;
  leftOverlayStyle: ReturnType<typeof useAnimatedStyle>;
  resetPosition: () => void;
}

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

export function useFlashcardGesture({
  isAnimating,
  onSwipeComplete,
}: UseFlashcardGestureOptions): UseFlashcardGestureReturn {
  const { width: screenWidth } = useWindowDimensions();
  const SWIPE_THRESHOLD = screenWidth * 0.4;
  const OVERLAY_START = SWIPE_THRESHOLD * 0.3;
  const MAX_ROTATION = 10;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardRotation = useSharedValue(0);
  const rightOverlayOpacity = useSharedValue(0);
  const leftOverlayOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  const triggerSwipe = useCallback(
    (direction: 'left' | 'right') => {
      Haptics.notificationAsync(
        direction === 'right'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
      onSwipeComplete(direction);
    },
    [onSwipeComplete],
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((e) => {
      'worklet';
      if (isAnimating) return;
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
      cardRotation.value = (e.translationX / screenWidth) * MAX_ROTATION;

      if (e.translationX > OVERLAY_START) {
        rightOverlayOpacity.value = Math.min(
          (e.translationX - OVERLAY_START) / (SWIPE_THRESHOLD - OVERLAY_START),
          1,
        );
        leftOverlayOpacity.value = 0;
      } else if (e.translationX < -OVERLAY_START) {
        leftOverlayOpacity.value = Math.min(
          (Math.abs(e.translationX) - OVERLAY_START) / (SWIPE_THRESHOLD - OVERLAY_START),
          1,
        );
        rightOverlayOpacity.value = 0;
      } else {
        rightOverlayOpacity.value = 0;
        leftOverlayOpacity.value = 0;
      }
    })
    .onEnd((e) => {
      'worklet';
      if (isAnimating) return;

      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(screenWidth * 1.5, { duration: 300 });
        cardOpacity.value = withTiming(0, { duration: 300 });
        runOnJS(triggerSwipe)('right');
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-screenWidth * 1.5, { duration: 300 });
        cardOpacity.value = withTiming(0, { duration: 300 });
        runOnJS(triggerSwipe)('left');
      } else {
        // snap back
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        cardRotation.value = withSpring(0, SPRING_CONFIG);
        rightOverlayOpacity.value = withTiming(0, { duration: 200 });
        leftOverlayOpacity.value = withTiming(0, { duration: 200 });
      }
    });

  const resetPosition = useCallback(() => {
    translateX.value = 0;
    translateY.value = 0;
    cardRotation.value = 0;
    rightOverlayOpacity.value = 0;
    leftOverlayOpacity.value = 0;
    cardOpacity.value = 1;
  }, [translateX, translateY, cardRotation, rightOverlayOpacity, leftOverlayOpacity, cardOpacity]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${cardRotation.value}deg` },
    ],
    opacity: cardOpacity.value,
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: rightOverlayOpacity.value,
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: leftOverlayOpacity.value,
  }));

  return { panGesture, cardAnimatedStyle, rightOverlayStyle, leftOverlayStyle, resetPosition };
}
