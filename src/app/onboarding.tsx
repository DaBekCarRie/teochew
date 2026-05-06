import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { Slide1Welcome } from '../components/onboarding/Slide1Welcome';
import { Slide2Features } from '../components/onboarding/Slide2Features';
import { Slide3Language } from '../components/onboarding/Slide3Language';
import { useUserStore } from '../stores/userStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState<'th' | 'zh' | 'en'>('th');
  const { setLanguage } = useUserStore();

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  async function handleSkip() {
    await AsyncStorage.setItem('@teochew_onboarding_completed', 'true');
    await setLanguage('th');
    router.replace('/dictionary');
  }

  async function handleStart() {
    await AsyncStorage.setItem('@teochew_onboarding_completed', 'true');
    await setLanguage(selectedLang);
    router.replace('/dictionary');
  }

  function handleNext() {
    if (currentSlide < 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animate out
      translateX.value = withTiming(-SCREEN_WIDTH, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setCurrentSlide)(currentSlide + 1);

        // Setup for animate in
        translateX.value = SCREEN_WIDTH;

        // Animate in
        translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleStart();
    }
  }

  const panGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50 && currentSlide < 2) {
      runOnJS(handleNext)();
    } else if (e.translationX > 50 && currentSlide > 0) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      // Animate back
      translateX.value = withTiming(SCREEN_WIDTH, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setCurrentSlide)(currentSlide - 1);

        translateX.value = -SCREEN_WIDTH;
        translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(1, { duration: 300 });
      });
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    flex: 1,
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {currentSlide < 2 && (
        <Pressable
          style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 }}
          onPress={handleSkip}
          accessibilityLabel="ข้ามการแนะนำ"
        >
          <Text style={{ fontSize: 14, color: '#A08060', fontFamily: 'Sarabun' }}>ข้าม</Text>
        </Pressable>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          {currentSlide === 0 && <Slide1Welcome />}
          {currentSlide === 1 && <Slide2Features />}
          {currentSlide === 2 && (
            <Slide3Language selectedLang={selectedLang} onSelect={setSelectedLang} />
          )}
        </Animated.View>
      </GestureDetector>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Page Indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[0, 1, 2].map((i) => (
            <PageDot key={i} active={currentSlide === i} />
          ))}
        </View>

        {currentSlide < 2 ? (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => ({
              backgroundColor: '#B5451B',
              height: 52,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: '#FEFAF5', fontSize: 16, fontWeight: '600' }}>ถัดไป →</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => ({
              backgroundColor: '#B5451B',
              height: 52,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: '#FEFAF5', fontSize: 16, fontWeight: '600' }}>
              เริ่มต้นใช้งาน 🏮
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function PageDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 24 : 8);
  const color = useSharedValue(active ? '#B5451B' : '#D9C9A8');

  useEffect(() => {
    width.value = withSpring(active ? 24 : 8, { damping: 15 });
    color.value = withTiming(active ? '#B5451B' : '#D9C9A8');
  }, [active]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.value,
  }));

  return <Animated.View style={style} />;
}
