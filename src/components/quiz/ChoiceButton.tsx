import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const LETTERS = ['A', 'B', 'C', 'D'];

interface ChoiceButtonProps {
  label: string;
  sublabel?: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  onPress: () => void;
  disabled: boolean;
}

export function ChoiceButton({
  label,
  sublabel,
  index,
  isSelected,
  isCorrect,
  showFeedback,
  onPress,
  disabled,
}: ChoiceButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  // Determine visual state
  const isCorrectSelected = showFeedback && isSelected && isCorrect;
  const isIncorrectSelected = showFeedback && isSelected && !isCorrect;
  const isCorrectUnselected = showFeedback && !isSelected && isCorrect;
  const isDisabledOther = showFeedback && !isSelected && !isCorrect;

  const bgColor = isCorrectSelected
    ? 'rgba(74,124,89,0.12)'
    : isIncorrectSelected
      ? 'rgba(181,69,27,0.12)'
      : isCorrectUnselected
        ? 'rgba(74,124,89,0.08)'
        : undefined;

  const borderColor =
    isCorrectSelected || isCorrectUnselected
      ? '#4A7C59'
      : isIncorrectSelected
        ? '#B5451B'
        : '#D9C9A8';

  const borderWidth = isCorrectSelected || isIncorrectSelected ? 2 : 1.5;

  const labelColor =
    isCorrectSelected || isCorrectUnselected
      ? '#4A7C59'
      : isIncorrectSelected
        ? '#B5451B'
        : '#2C1A0E';

  const opacity = isDisabledOther ? 0.5 : 1;

  const accessLabel = showFeedback
    ? isCorrect
      ? `ตัวเลือก ${LETTERS[index]}: ${label} — คำตอบที่ถูกต้อง`
      : isSelected
        ? `ตัวเลือก ${LETTERS[index]}: ${label} — ไม่ถูกต้อง`
        : `ตัวเลือก ${LETTERS[index]}: ${label}`
    : `ตัวเลือก ${LETTERS[index]}: ${label}`;

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          minHeight: 56,
          borderWidth,
          borderColor,
          backgroundColor: bgColor ?? '#FAF6EE',
          opacity,
        },
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessLabel}
      accessibilityRole="button"
    >
      {/* Left icon / index badge */}
      {isCorrectSelected || isCorrectUnselected ? (
        <Ionicons name="checkmark-circle" size={isSelected ? 20 : 18} color="#4A7C59" />
      ) : isIncorrectSelected ? (
        <Ionicons name="close-circle" size={20} color="#B5451B" />
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#EDE0C4',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#7A5C38' }}>
            {LETTERS[index]}
          </Text>
        </View>
      )}

      {/* Label */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: labelColor }}>{label}</Text>
        {sublabel ? (
          <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#9A7A2E', marginTop: 2 }}>
            {sublabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
