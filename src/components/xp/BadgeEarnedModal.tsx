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
import { useRouter } from 'expo-router';
import { BADGE_DEFS } from '../../constants/badges';

interface BadgeEarnedModalProps {
  conditionKey: string;
  onDismiss: () => void;
}

export function BadgeEarnedModal({ conditionKey, onDismiss }: BadgeEarnedModalProps) {
  const router = useRouter();
  const badgeDef = BADGE_DEFS.find((b) => b.condition_key === conditionKey);

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    backdropOpacity.value = withTiming(1, { duration: 200 });
    cardScale.value = withSpring(1, { damping: 15, stiffness: 200 });

    // Bounce icon
    iconScale.value = withDelay(
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

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
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

  function handleViewCollection() {
    handleDismiss();
    setTimeout(() => {
      router.push('/culture/badges');
    }, 200);
  }

  if (!badgeDef) return null;

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
          {/* Sparkles effect can be added here, simplified as bouncing icon for now */}
          <Animated.Text style={[{ fontSize: 64, marginBottom: 16 }, animatedIconStyle]}>
            {badgeDef.icon}
          </Animated.Text>

          <Text className="text-lg font-bold text-brown-900 text-center">ได้รับเหรียญ!</Text>

          <Text className="text-xl font-bold text-brown-900 mt-2 text-center">
            "{badgeDef.name_th}"
          </Text>
          <Text className="text-sm text-brown-600 mt-1 text-center">{badgeDef.description_th}</Text>

          <Text className="text-base font-bold text-gold-700 mt-3 text-center">
            +{badgeDef.xp_reward} XP
          </Text>

          <View className="flex-row items-center justify-between w-full mt-6 gap-3">
            <Pressable
              className="flex-1 bg-brick-600 rounded-[10px] py-3 items-center"
              onPress={handleViewCollection}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text className="text-sm font-semibold text-cream-50">ดู Collection</Text>
            </Pressable>

            <Pressable
              className="flex-1 border-[1.5px] border-brown-300 rounded-[10px] py-3 items-center"
              onPress={handleDismiss}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text className="text-sm font-semibold text-brown-600">ปิด</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
