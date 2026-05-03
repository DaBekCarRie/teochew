import React, { useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, type ScrollView as ScrollViewType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { QuizHeader } from '../../../components/quiz/QuizHeader';
import { QuizProgress } from '../../../components/quiz/QuizProgress';
import { QuestionCard } from '../../../components/quiz/QuestionCard';
import { ChoiceList } from '../../../components/quiz/ChoiceList';
import { FeedbackBanner } from '../../../components/quiz/FeedbackBanner';
import { NextButton } from '../../../components/quiz/NextButton';
import { InsufficientWordsState } from '../../../components/quiz/InsufficientWordsState';
import { SkeletonQuestion } from '../../../components/quiz/SkeletonQuestion';

import { useQuizSession } from '../../../hooks/useQuizSession';
import { getFlashcardWords } from '../../../services/supabase/words';
import { useProgressStore } from '../../../stores/progressStore';

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    deckTitle?: string;
    category?: string;
    wordIds?: string; // comma-separated IDs for lesson or retry-incorrect flow
    lessonId?: string;
  }>();

  const deckTitle = params.deckTitle ?? 'Quiz';
  const category = params.category ?? null;
  const wordIds = params.wordIds ? params.wordIds.split(',').filter(Boolean) : null;
  const lessonId = params.lessonId ?? '';

  const {
    questions,
    currentIndex,
    answers,
    status,
    selectedChoiceId,
    showFeedback,
    correctCount,
    incorrectCount,
    initQuiz,
    selectChoice,
    nextQuestion,
    getResult,
  } = useQuizSession();

  // Transition animation
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollViewType>(null);
  const sessionIdRef = useRef<string | null>(null);

  const { recordQuizAnswer, startSession, endSession } = useProgressStore();

  // Load words on mount
  useEffect(() => {
    async function load() {
      try {
        const words = await getFlashcardWords(category && !wordIds ? category : null, 50);
        // If wordIds supplied (retry flow), filter to those words
        const filtered = wordIds ? words.filter((w) => wordIds.includes(w.id)) : words;
        initQuiz(filtered);
      } catch {
        initQuiz([]);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start session once quiz is ready
  useEffect(() => {
    if (status === 'ready' && !sessionIdRef.current) {
      sessionIdRef.current = startSession(lessonId || null, 'quiz');
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to summary when complete
  useEffect(() => {
    if (status === 'complete') {
      const result = getResult();
      const incorrectWordIds = answers
        .filter((a) => !a.isCorrect)
        .map((a) => a.wordId)
        .join(',');
      const totalMs = result.totalTimeSpent;
      const totalMin = Math.floor(totalMs / 60000);
      const totalSec = Math.round((totalMs % 60000) / 1000);

      if (sessionIdRef.current) {
        endSession(sessionIdRef.current, {
          score: result.score,
          wordsStudied: result.totalQuestions,
        });
        sessionIdRef.current = null;
      }

      router.replace({
        pathname: '/learn/quiz-summary',
        params: {
          deckTitle,
          totalQuestions: String(result.totalQuestions),
          correctCount: String(result.correctCount),
          incorrectCount: String(result.incorrectCount),
          score: String(result.score),
          incorrectWordIds,
          totalMin: String(totalMin),
          totalSec: String(totalSec),
          category: category ?? '',
          lessonId,
          wordIds: params.wordIds ?? '',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Handle choice selection: haptics + auto-advance for correct
  useEffect(() => {
    if (!showFeedback || !selectedChoiceId) return;

    const currentAnswer = answers[answers.length - 1];
    if (!currentAnswer) return;

    // Record answer in progress store
    recordQuizAnswer(currentAnswer.wordId, currentAnswer.isCorrect);

    // Scroll to bottom so NextButton is visible
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    if (currentAnswer.isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Auto-advance after 1.5s (BR-7)
      autoAdvanceTimer.current = setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // No auto-advance for incorrect (BR-8)
    }

    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeedback]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const handleNext = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    // Scroll back to top for next question
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    // Exit animation
    translateX.value = withTiming(-80, { duration: 200, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 180 }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(nextQuestion)();
        // Enter from right
        translateX.value = 80;
        opacity.value = 0;
        translateX.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: 220 });
      }
    });
  }, [nextQuestion, translateX, opacity]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  if (status === 'idle') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
        <QuizHeader title={deckTitle} current={1} total={10} onBack={handleBack} />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <SkeletonQuestion />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'insufficient') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
        <QuizHeader title={deckTitle} current={0} total={0} onBack={handleBack} />
        <InsufficientWordsState onGoBack={handleBack} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <QuizHeader
        title={deckTitle}
        current={currentIndex + 1}
        total={questions.length}
        onBack={handleBack}
      />

      <QuizProgress
        current={currentIndex}
        total={questions.length}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentQuestion && (
          <Animated.View style={cardStyle}>
            <QuestionCard question={currentQuestion} />

            <ChoiceList
              choices={currentQuestion.choices}
              selectedChoiceId={selectedChoiceId}
              showFeedback={showFeedback}
              onSelect={selectChoice}
            />

            {showFeedback && (
              <>
                <FeedbackBanner
                  isCorrect={answers[answers.length - 1]?.isCorrect ?? false}
                  correctWord={currentQuestion.word}
                />
                {!answers[answers.length - 1]?.isCorrect && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <NextButton isLast={isLast} onPress={handleNext} />
                  </View>
                )}
              </>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
