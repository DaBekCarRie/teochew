import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import type { TranslationResult } from '../../types/translation';
import { UnverifiedBadge } from './UnverifiedBadge';
import { CopyButton } from './CopyButton';
import { ShareButton } from './ShareButton';
import { CorrectionButton } from './CorrectionButton';

import { useUserStore } from '../../stores/userStore';

interface ResultCardProps {
  result: TranslationResult;
  onCopied: () => void;
  onSubmitCorrection: () => void;
}

interface MeaningRowProps {
  flag: string;
  text: string;
  accessibilityLabel: string;
}

function MeaningRow({ flag, text, accessibilityLabel }: MeaningRowProps) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={{ fontSize: 18 }}>{flag}</Text>
      <Text style={{ fontSize: 15, color: '#2C1A0E', flex: 1 }}>{text}</Text>
    </View>
  );
}

export function ResultCard({ result, onCopied, onSubmitCorrection }: ResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const { language } = useUserStore();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const hasMeanings = result.thai_meaning || result.mandarin_char || result.english_meaning;

  const thaiNode = result.thai_meaning ? (
    <MeaningRow
      key="th"
      flag="🇹🇭"
      text={result.thai_meaning}
      accessibilityLabel={`ภาษาไทย: ${result.thai_meaning}`}
    />
  ) : null;

  const zhNode = result.mandarin_char ? (
    <MeaningRow
      key="zh"
      flag="🇨🇳"
      text={result.mandarin_char}
      accessibilityLabel={`จีนกลาง: ${result.mandarin_char}`}
    />
  ) : null;

  const enNode = result.english_meaning ? (
    <MeaningRow
      key="en"
      flag="🇬🇧"
      text={result.english_meaning}
      accessibilityLabel={`English: ${result.english_meaning}`}
    />
  ) : null;

  const orderedNodes = [];
  if (language === 'th') {
    orderedNodes.push(thaiNode, enNode, zhNode);
  } else if (language === 'en') {
    orderedNodes.push(enNode, thaiNode, zhNode);
  } else {
    orderedNodes.push(zhNode, thaiNode, enNode);
  }

  return (
    <Animated.View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        opacity,
        transform: [{ translateY }],
      }}
    >
      {!result.verified && <UnverifiedBadge />}

      {/* Main Teochew result */}
      <Text
        style={{
          fontSize: 40,
          fontWeight: '700',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 4,
          marginBottom: 4,
        }}
        accessibilityLabel={`${result.teochew_char ?? '—'} อ่านว่า ${result.pengim ?? '—'}`}
      >
        {result.teochew_char ?? '—'}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontStyle: 'italic',
          color: '#9A7A2E',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {result.pengim ?? '—'}
      </Text>

      {hasMeanings && (
        <>
          <View style={{ height: 1, backgroundColor: '#D9C9A8', marginBottom: 8 }} />
          {orderedNodes}
        </>
      )}

      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginTop: 8, marginBottom: 12 }} />

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <CopyButton result={result} onCopied={onCopied} flex={1} />
        <ShareButton result={result} flex={1} />
      </View>

      {!result.verified && <CorrectionButton onPress={onSubmitCorrection} />}
    </Animated.View>
  );
}
