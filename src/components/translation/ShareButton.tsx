import React from 'react';
import { Text, Pressable, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import type { TranslationResult } from '../../types/translation';
import { buildShareMessage } from '../../utils/translationFormatters';

interface ShareButtonProps {
  result: TranslationResult;
  flex?: number;
  disabled?: boolean;
}

export function ShareButton({ result, flex, disabled = false }: ShareButtonProps) {
  async function handleShare() {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const message = buildShareMessage(result);
    await Share.share({ message });
  }

  return (
    <Pressable
      onPress={handleShare}
      disabled={disabled}
      style={({ pressed }) => ({
        flex,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#D9C9A8',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        minHeight: 48,
        backgroundColor: pressed ? '#EDE0C4' : '#FAF6EE',
        opacity: disabled ? 0.4 : 1,
      })}
      accessibilityLabel="แชร์ผลการแปล"
      accessibilityRole="button"
    >
      <Ionicons name="share-outline" size={16} color="#6B4C2A" />
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#2C1A0E' }}>แชร์</Text>
    </Pressable>
  );
}
