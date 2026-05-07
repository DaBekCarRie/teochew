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
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={{ fontSize: 16 }}>{flag}</Text>
      <Text style={{ fontSize: 15, color: '#3C2A18', flex: 1, lineHeight: 22 }}>{text}</Text>
    </View>
  );
}

export function ResultCard({ result, onCopied, onSubmitCorrection }: ResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const charScale = useRef(new Animated.Value(0.82)).current;
  const { language } = useUserStore();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, tension: 120, friction: 14 }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }),
      Animated.spring(charScale, { toValue: 1, useNativeDriver: true, tension: 90, friction: 11 }),
    ]).start();
  }, [opacity, translateY, charScale]);

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

  const orderedNodes: (React.ReactNode | null)[] = [];
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
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 8,
        opacity,
        transform: [{ translateY }],
      }}
    >
      {/* Hero section — amber background */}
      <View
        style={{
          backgroundColor: '#EDE0C4',
          alignItems: 'center',
          paddingTop: result.verified ? 28 : 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        {!result.verified && <UnverifiedBadge />}

        {/* Character in a lit circle */}
        <Animated.View
          style={{
            transform: [{ scale: charScale }],
            width: 116,
            height: 116,
            borderRadius: 58,
            backgroundColor: '#FAF6EE',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#6B4C2A',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.14,
            shadowRadius: 14,
            elevation: 4,
            marginTop: result.verified ? 0 : 10,
            marginBottom: 14,
          }}
        >
          <Text
            style={{ fontSize: 52, fontWeight: '700', color: '#2C1A0E', textAlign: 'center' }}
            accessibilityLabel={`${result.teochew_char ?? '—'} อ่านว่า ${result.pengim ?? '—'}`}
          >
            {result.teochew_char ?? '—'}
          </Text>
        </Animated.View>

        {/* Pengim in serif italic */}
        <Text
          style={{
            fontSize: 20,
            fontStyle: 'italic',
            color: '#9A7A2E',
            textAlign: 'center',
            fontFamily: 'Georgia',
            letterSpacing: 0.5,
          }}
        >
          {result.pengim ?? '—'}
        </Text>
      </View>

      {/* Meanings + actions section */}
      <View
        style={{
          backgroundColor: '#F5EDD8',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 20,
        }}
      >
        {hasMeanings && (
          <>
            {orderedNodes}
            <View
              style={{ height: 1, backgroundColor: '#D9C9A8', marginTop: 8, marginBottom: 16 }}
            />
          </>
        )}

        {!hasMeanings && (
          <View style={{ height: 1, backgroundColor: '#D9C9A8', marginBottom: 16 }} />
        )}

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <CopyButton result={result} onCopied={onCopied} flex={1} />
          <ShareButton result={result} flex={1} />
        </View>

        {!result.verified && <CorrectionButton onPress={onSubmitCorrection} />}
      </View>
    </Animated.View>
  );
}
