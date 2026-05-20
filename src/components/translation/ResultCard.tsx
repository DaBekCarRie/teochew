import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import type { TranslationResult } from '../../types/translation';
import { CopyButton } from './CopyButton';
import { ShareButton } from './ShareButton';

const LANG_FLAG: Record<string, string> = { th: '🇹🇭', zh: '🇨🇳', en: '🇬🇧' };

interface ResultCardProps {
  result: TranslationResult;
  onCopied: () => void;
}

export function ResultCard({ result, onCopied }: ResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

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

  const sourceFlag = LANG_FLAG[result.source_lang] ?? '';
  const targetFlag = LANG_FLAG[result.target_lang] ?? '';

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      {/* Gold accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.body}>
        {/* Source section */}
        <View style={styles.sourceRow}>
          <Text style={styles.sourceFlag}>{sourceFlag}</Text>
          <Text style={styles.sourceText} numberOfLines={3}>
            {result.input_text}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Output section */}
        <View style={styles.outputRow}>
          <Text style={styles.outputFlag}>{targetFlag}</Text>
          <Text style={styles.outputText} numberOfLines={4}>
            {result.output_text}
          </Text>
        </View>

        <View style={styles.dividerLight} />

        {/* Actions */}
        <View style={styles.actionRow}>
          <CopyButton result={result} onCopied={onCopied} flex={1} />
          <ShareButton result={result} flex={1} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9C9A8',
    shadowColor: '#6B4C2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#FAF6EE',
  },
  accentBar: {
    height: 5,
    backgroundColor: '#C9A84C',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 14,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sourceFlag: {
    fontSize: 20,
    marginTop: 2,
  },
  sourceText: {
    flex: 1,
    fontSize: 15,
    color: '#A08060',
    lineHeight: 22,
    fontFamily: 'Sarabun',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE0C4',
  },
  outputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  outputFlag: {
    fontSize: 22,
    marginTop: 2,
  },
  outputText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1A0E',
    lineHeight: 32,
    fontFamily: 'Sarabun',
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#EDE0C4',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
