import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

interface NextButtonProps {
  isLast: boolean;
  onPress: () => void;
}

export function NextButton({ isLast, onPress }: NextButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  return (
    <Pressable
      className="mt-2"
      style={({ pressed }) => ({
        alignSelf: 'flex-end',
        marginTop: 16,
        backgroundColor: pressed ? '#A8892A' : '#C9A84C',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2C1A0E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      })}
      onPress={handlePress}
      accessibilityLabel={isLast ? 'ดูสรุป' : 'ข้อถัดไป'}
      accessibilityRole="button"
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1A0E', letterSpacing: 0.3 }}>
        {isLast ? 'ดูสรุป →' : 'ข้อถัดไป →'}
      </Text>
    </Pressable>
  );
}
