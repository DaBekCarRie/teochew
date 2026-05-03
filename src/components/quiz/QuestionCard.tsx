import React from 'react';
import { View, Text } from 'react-native';
import { CardAudioButton } from '../flashcard/CardAudioButton';
import type { QuizQuestion } from '../../types/dictionary';

interface QuestionCardProps {
  question: QuizQuestion;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { word, questionType } = question;

  return (
    <View className="bg-cream-100 border border-cream-300 rounded-[14px] p-6 items-center mt-4 mb-4">
      {questionType === 'teochew_to_thai' ? (
        <>
          <Text className="text-[36px] font-bold text-brown-900 text-center">
            {word.teochew_char}
          </Text>
          <Text className="text-base italic text-gold-700 mt-2 text-center">
            {word.teochew_pengim}
          </Text>
          <CardAudioButton audioUrl={word.teochew_audio} size="md" />
          <Text className="text-base text-brown-600 mt-4 text-center">คำนี้แปลว่าอะไร?</Text>
        </>
      ) : (
        <>
          <Text className="text-2xl font-bold text-brown-900 text-center">{word.thai_meaning}</Text>
          <Text className="text-base text-brown-600 mt-4 text-center">
            คำนี้ภาษาเตี้จิ๋วคือข้อไหน?
          </Text>
        </>
      )}
    </View>
  );
}
