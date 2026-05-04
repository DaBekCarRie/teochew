import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TranslateButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function TranslateButton({ onPress, disabled, isLoading }: TranslateButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      style={({ pressed }) => ({
        marginTop: 12,
        width: '100%',
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled || isLoading ? '#EDE0C4' : '#B5451B',
        opacity: pressed ? 0.85 : 1,
      })}
      accessibilityLabel="แปลภาษา"
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FAF6EE" />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: disabled ? '#A08060' : '#FAF6EE',
          }}
        >
          แปล →
        </Text>
      )}
    </Pressable>
  );
}
