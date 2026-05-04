import React from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import type { ToneInfo } from '../../utils/toneData';
import { ToneDetailRow } from './ToneDetailRow';

interface ToneDetailTableProps {
  tones: ToneInfo[];
  playingTone: number | null;
  onPlayPress: (toneNumber: number) => void;
  /** Called with the table's y-offset in the scroll view, for auto-scroll */
  onLayout?: (y: number) => void;
}

export function ToneDetailTable({
  tones,
  playingTone,
  onPlayPress,
  onLayout,
}: ToneDetailTableProps) {
  function handleLayout(e: LayoutChangeEvent) {
    onLayout?.(e.nativeEvent.layout.y);
  }

  return (
    <View
      onLayout={handleLayout}
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        marginTop: 16,
        overflow: 'hidden',
      }}
    >
      {tones.map((tone, idx) => (
        <ToneDetailRow
          key={tone.number}
          tone={tone}
          isPlaying={playingTone === tone.number}
          isLast={idx === tones.length - 1}
          onPlayPress={() => onPlayPress(tone.number)}
        />
      ))}
    </View>
  );
}
