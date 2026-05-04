import React, { useState, useCallback } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import type {
  TranslationResult,
  TranslationScreenState,
  ErrorType,
  InputLang,
} from '../../../types/translation';
import {
  translateInput,
  NetworkError,
  RateLimitGoogleError,
  RateLimitClaudeError,
} from '../../../services/translation/pipeline';
import { useTranslationStore } from '../../../stores/translationStore';

import { TranslationHeader } from '../../../components/translation/TranslationHeader';
import { LanguageSelectorRow } from '../../../components/translation/LanguageSelectorRow';
import { InputArea } from '../../../components/translation/InputArea';
import { TranslateButton } from '../../../components/translation/TranslateButton';
import { ResultCard } from '../../../components/translation/ResultCard';
import { ResultSkeleton } from '../../../components/translation/ResultSkeleton';
import { TranslationEmptyState } from '../../../components/translation/TranslationEmptyState';
import { TranslationErrorState } from '../../../components/translation/TranslationErrorState';
import { CopiedToast } from '../../../components/translation/CopiedToast';
import { CrowdsourceBottomSheet } from '../../../components/translation/CrowdsourceBottomSheet';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TranslationScreen() {
  const router = useRouter();
  const { addEntry, pendingResult, setPendingResult, hydrate, hydrated } = useTranslationStore();

  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState<InputLang>('th');
  const [screenState, setScreenState] = useState<TranslationScreenState>('idle');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showCrowdsource, setShowCrowdsource] = useState(false);

  React.useEffect(() => {
    if (!hydrated) hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Consume pending result from history re-use
  useFocusEffect(
    useCallback(() => {
      if (pendingResult) {
        setResult(pendingResult);
        setInputText(pendingResult.input_text);
        setSelectedLang(pendingResult.detected_lang);
        setScreenState('success');
        setPendingResult(null);
      }
    }, [pendingResult, setPendingResult]),
  );

  async function handleTranslate() {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setScreenState('loading');
    setResult(null);
    setErrorType(null);

    try {
      const res = await translateInput(trimmed, selectedLang);
      setResult(res);
      setScreenState('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await addEntry({
        id: generateId(),
        input_text: trimmed,
        detected_lang: selectedLang,
        result: res,
        translated_at: new Date().toISOString(),
      });
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (e instanceof RateLimitClaudeError) {
        setScreenState('rate_limited');
        setErrorType('rate_limit_claude');
      } else if (e instanceof RateLimitGoogleError) {
        setScreenState('error');
        setErrorType('rate_limit_google');
      } else if (e instanceof NetworkError) {
        setScreenState('error');
        setErrorType('network');
      } else {
        setScreenState('error');
        setErrorType('unknown');
      }
    }
  }

  function handleClear() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText('');
    setScreenState('idle');
    setResult(null);
    setErrorType(null);
  }

  function handleCopied() {
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <TranslationHeader onHistoryPress={() => router.push('/translate/history')} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LanguageSelectorRow selectedLang={selectedLang} onSelectLang={setSelectedLang} />

        <InputArea
          value={inputText}
          onChangeText={setInputText}
          onClear={handleClear}
          maxLength={200}
        />

        <TranslateButton
          onPress={handleTranslate}
          disabled={inputText.trim().length === 0}
          isLoading={screenState === 'loading'}
        />

        <View style={{ marginTop: 24 }}>
          {screenState === 'idle' && <TranslationEmptyState />}
          {screenState === 'loading' && <ResultSkeleton />}
          {screenState === 'success' && result && (
            <ResultCard
              result={result}
              onCopied={handleCopied}
              onSubmitCorrection={() => setShowCrowdsource(true)}
            />
          )}
          {(screenState === 'error' || screenState === 'rate_limited') && (
            <TranslationErrorState errorType={errorType} onRetry={handleTranslate} />
          )}
        </View>
      </ScrollView>

      <CopiedToast visible={showCopiedToast} />

      {showCrowdsource && result && (
        <CrowdsourceBottomSheet
          isVisible={showCrowdsource}
          onClose={() => setShowCrowdsource(false)}
          wordResult={result}
        />
      )}
    </SafeAreaView>
  );
}
