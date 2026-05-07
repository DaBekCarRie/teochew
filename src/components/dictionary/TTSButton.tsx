import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpeech, type SpeechLanguage } from '../../hooks/useSpeech';

const LABELS: Record<SpeechLanguage, string> = {
  th: 'TH',
  en: 'EN',
  zh: 'ZH',
};

interface TTSButtonProps {
  text: string;
  language: SpeechLanguage;
  disabled?: boolean;
}

export function TTSButton({ text, language, disabled }: TTSButtonProps) {
  const { speak, isSpeaking } = useSpeech();
  const active = isSpeaking(text, language);
  const isDisabled = disabled || !text.trim();

  return (
    <TouchableOpacity
      onPress={() => speak(text, language)}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityLabel={`ฟังเสียง ${LABELS[language]}`}
      accessibilityRole="button"
    >
      <View
        className="flex-row items-center gap-0.5 rounded-full px-2 py-0.5 border border-cream-200 bg-cream-100"
        style={{ opacity: isDisabled ? 0.35 : 1 }}
      >
        <Ionicons
          name={active ? 'volume-high' : 'volume-medium-outline'}
          size={13}
          color={active ? '#C9A84C' : '#A08060'}
        />
        <Text className="text-[11px] font-medium text-brown-600">{LABELS[language]}</Text>
      </View>
    </TouchableOpacity>
  );
}
