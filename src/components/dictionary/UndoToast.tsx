import React, { useEffect, useRef } from 'react';
import { Animated, Text, Pressable, View } from 'react-native';

interface UndoToastProps {
  message: string;
  visible: boolean;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, visible, onUndo, onDismiss }: UndoToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 3000);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity, position: 'absolute', bottom: 24, left: 20, right: 20 }}
      accessibilityLiveRegion="polite"
    >
      <View
        className="flex-row items-center justify-between rounded-[10px] px-4 py-3"
        style={{ backgroundColor: '#2C1A0E' }}
      >
        <Text className="text-sm text-cream-50 flex-1 mr-3" numberOfLines={1}>
          {message}
        </Text>
        <Pressable
          onPress={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            onUndo();
          }}
          hitSlop={8}
        >
          <Text className="text-sm font-semibold text-gold-500">ยกเลิก</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
