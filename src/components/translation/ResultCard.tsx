import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import type { TranslationResult } from '../../types/translation';
import { CopyButton } from './CopyButton';
import { ShareButton } from './ShareButton';
import { useUserStore } from '../../stores/userStore';

interface ResultCardProps {
  result: TranslationResult;
  onCopied: () => void;
}

interface MeaningRowProps {
  flag: string;
  text: string;
  accessibilityLabel: string;
}

function MeaningRow({ flag, text, accessibilityLabel }: MeaningRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={{ fontSize: 20 }}>{flag}</Text>
      <Text style={{ fontSize: 16, color: '#2C1A0E', flex: 1, lineHeight: 24, fontWeight: '500' }}>
        {text}
      </Text>
    </View>
  );
}

export function ResultCard({ result, onCopied }: ResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const { language } = useUserStore();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, tension: 100, friction: 14 }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 14,
      }),
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
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        shadowColor: '#6B4C2A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        opacity,
        transform: [{ translateY }],
        backgroundColor: '#FAF6EE',
      }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
        {hasMeanings && (
          <>
            <View style={{ marginBottom: 4 }}>{orderedNodes}</View>
            <View
              style={{ height: 1, backgroundColor: '#EDE0C4', marginTop: 4, marginBottom: 16 }}
            />
          </>
        )}

        {!hasMeanings && (
          <View style={{ height: 1, backgroundColor: '#EDE0C4', marginBottom: 16 }} />
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <CopyButton result={result} onCopied={onCopied} flex={1} />
          <ShareButton result={result} flex={1} />
        </View>
      </View>
    </Animated.View>
  );
}
