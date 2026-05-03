import React from 'react';
import { View } from 'react-native';
import { ChoiceButton } from './ChoiceButton';
import type { QuizChoice } from '../../types/dictionary';

interface ChoiceListProps {
  choices: QuizChoice[];
  selectedChoiceId: string | null;
  showFeedback: boolean;
  onSelect: (choiceId: string) => void;
}

export function ChoiceList({ choices, selectedChoiceId, showFeedback, onSelect }: ChoiceListProps) {
  return (
    <View style={{ gap: 10 }}>
      {choices.map((choice, index) => (
        <ChoiceButton
          key={choice.wordId}
          label={choice.label}
          sublabel={choice.sublabel}
          index={index}
          isSelected={selectedChoiceId === choice.wordId}
          isCorrect={choice.isCorrect}
          showFeedback={showFeedback}
          onPress={() => onSelect(choice.wordId)}
          disabled={showFeedback}
        />
      ))}
    </View>
  );
}
