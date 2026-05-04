import React from 'react';
import { View, Text } from 'react-native';
import { ConfidenceBar } from './ConfidenceBar';

interface TranscriptCardProps {
  transcript: string;
  confidence: number;
}

export function TranscriptCard({ transcript, confidence }: TranscriptCardProps) {
  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
        marginBottom: 12,
      }}
      accessibilityLabel={`Whisper เงียม ${transcript || '—'} ความมั่นใจ ${confidence >= 0.8 ? 'สูง' : confidence >= 0.5 ? 'กลาง' : 'ต่ำ'}`}
    >
      <Text style={{ fontSize: 12, color: '#A08060', marginBottom: 8 }}>Whisper เงียม:</Text>
      <Text
        style={{
          fontSize: 32,
          fontWeight: '700',
          color: '#2C1A0E',
          textAlign: 'center',
          marginVertical: 8,
        }}
      >
        {transcript || '—'}
      </Text>
      <ConfidenceBar confidence={confidence} />
    </View>
  );
}
