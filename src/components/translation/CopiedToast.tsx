import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface CopiedToastProps {
  visible: boolean;
}

export function CopiedToast({ visible }: CopiedToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      translateY.setValue(-10);
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + 16,
        alignSelf: 'center',
        zIndex: 100,
        opacity,
        transform: [{ translateY }],
      }}
      accessibilityLiveRegion="polite"
      accessibilityLabel="คัดลอกแล้ว"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'rgba(44,26,14,0.9)',
          borderRadius: 100,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Ionicons name="checkmark-circle" size={16} color="#4A7C59" />
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#FAF6EE' }}>คัดลอกแล้ว</Text>
      </View>
    </Animated.View>
  );
}
