import React from 'react';
import { Text, Pressable, ActivityIndicator, View } from 'react-native';
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

  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        marginTop: 14,
        width: '100%',
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDisabled ? '#EDE0C4' : '#B5451B',
        opacity: pressed ? 0.87 : 1,
        shadowColor: '#B5451B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDisabled ? 0 : 0.28,
        shadowRadius: 10,
        elevation: isDisabled ? 0 : 3,
      })}
      accessibilityLabel="แปลภาษา"
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {isLoading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator size="small" color="#FAF6EE" />
          <Text style={{ fontSize: 14, color: '#FAF6EE', fontWeight: '500' }}>กำลังแปล...</Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: isDisabled ? '#A08060' : '#FAF6EE',
            letterSpacing: 0.3,
          }}
        >
          {disabled ? 'แปล' : 'แปลเป็นแต้จิ๋ว →'}
        </Text>
      )}
    </Pressable>
  );
}
