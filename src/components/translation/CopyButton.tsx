import React, { useState } from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import type { TranslationResult } from '../../types/translation';
import { buildCopyText } from '../../utils/translationFormatters';

interface CopyButtonProps {
  result: TranslationResult;
  onCopied?: () => void;
  flex?: number;
  disabled?: boolean;
}

export function CopyButton({ result, onCopied, flex, disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled) return;
    const text = buildCopyText(result);
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <View style={{ flex }}>
      <Pressable
        onPress={handleCopy}
        disabled={disabled}
        style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.75 : 1 })}
        accessibilityLabel="คัดลอกผลการแปล"
        accessibilityRole="button"
      >
        <View style={styles.btn}>
          {copied ? (
            <Ionicons name="checkmark-circle" size={16} color="#4A7C59" />
          ) : (
            <Ionicons name="copy-outline" size={16} color="#6B4C2A" />
          )}
          <Text style={styles.label}>คัดลอก</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
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
    backgroundColor: '#FAF6EE',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
});
