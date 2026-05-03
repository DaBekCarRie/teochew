import React, { useEffect, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FlashcardHeader } from '../../../components/flashcard/FlashcardHeader';
import { FlashcardProgress } from '../../../components/flashcard/FlashcardProgress';
import { CardStack } from '../../../components/flashcard/CardStack';
import { FlashcardActions } from '../../../components/flashcard/FlashcardActions';
import { SwipeHint } from '../../../components/flashcard/SwipeHint';
import { SkeletonCard } from '../../../components/flashcard/SkeletonCard';
import { EmptyDeckState } from '../../../components/flashcard/EmptyDeckState';
import { FetchErrorState } from '../../../components/flashcard/FetchErrorState';

import { useFlashcardDeck } from '../../../hooks/useFlashcardDeck';
import { useCardFlip } from '../../../hooks/useCardFlip';
import { useFlashcardGesture } from '../../../hooks/useFlashcardGesture';
import { MOCK_WORDS } from '../../../services/supabase/mockWords';
import { useProgressStore } from '../../../stores/progressStore';

export default function FlashcardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    deckTitle?: string;
    category?: string;
    lessonId?: string;
    wordIds?: string;
    unknownWordIds?: string;
  }>();
  const deckTitle = params.deckTitle ?? 'Flashcard';
  const category = params.category ?? null;
  const lessonId = params.lessonId ?? '';
  // wordIds: lesson-specific word list; unknownWordIds: retry flow from summary
  const wordIdsParam = params.wordIds ?? '';
  const unknownWordIdsParam = params.unknownWordIds ?? '';

  const { deck, currentIndex, results, status, errorMsg, loadDeck, recordResult, advance } =
    useFlashcardDeck();
  const { isFlipped, isAnimating, frontStyle, backStyle, flip, resetFlip } = useCardFlip();
  const cardStartTimeRef = useRef<number>(Date.now());

  const { recordFlashcardSeen, startSession, endSession } = useProgressStore();
  const sessionIdRef = useRef<string | null>(null);

  // Start session once deck is ready
  useEffect(() => {
    if (status === 'ready' && !sessionIdRef.current) {
      sessionIdRef.current = startSession(lessonId || null, 'flashcard');
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to summary when deck completes
  useEffect(() => {
    if (status === 'complete') {
      const known = results.filter((r) => r.status === 'known').map((r) => r.wordId);
      const unknown = results.filter((r) => r.status === 'unknown').map((r) => r.wordId);
      const totalMs = results.reduce((sum, r) => sum + r.timeSpent, 0);
      const avgSec =
        results.length > 0 ? Math.round((totalMs / results.length / 1000) * 10) / 10 : 0;

      if (sessionIdRef.current) {
        endSession(sessionIdRef.current, { wordsStudied: results.length });
        sessionIdRef.current = null;
      }

      router.replace({
        pathname: '/learn/summary',
        params: {
          deckTitle,
          total: String(deck.length),
          knownCount: String(known.length),
          unknownCount: String(unknown.length),
          avgSec: String(avgSec),
          unknownWordIds: unknown.join(','),
          category: category ?? '',
          lessonId,
          wordIds: wordIdsParam,
        },
      });
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right') => {
      const timeSpent = Date.now() - cardStartTimeRef.current;
      const word = deck[currentIndex];
      if (word) {
        recordResult(word.word.id, direction, timeSpent);
        recordFlashcardSeen(word.word.id);
      }
      // Reset flip state immediately, then advance after a short delay to let
      // the swipe-out animation finish
      resetFlip();
      setTimeout(() => {
        advance();
        cardStartTimeRef.current = Date.now();
        resetPosition();
      }, 320);
    },
    [deck, currentIndex, recordResult, resetFlip, advance], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { panGesture, cardAnimatedStyle, rightOverlayStyle, leftOverlayStyle, resetPosition } =
    useFlashcardGesture({
      isAnimating,
      onSwipeComplete: handleSwipeComplete,
    });

  // Load deck on mount — lesson/retry flows filter MOCK_WORDS by ID param
  useEffect(() => {
    const idStr = wordIdsParam || unknownWordIdsParam;
    if (idStr) {
      const ids = idStr.split(',').filter(Boolean);
      const filtered = ids
        .map((id) => MOCK_WORDS.find((w) => w.id === id))
        .filter(Boolean) as typeof MOCK_WORDS;
      loadDeck(null, filtered);
    } else {
      loadDeck(category);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const knownCount = results.filter((r) => r.status === 'known').length;
  const unknownCount = results.filter((r) => r.status === 'unknown').length;
  const currentCard = deck[currentIndex];
  const nextCards = deck.slice(currentIndex + 1, currentIndex + 3);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
        <FlashcardHeader
          title={deckTitle}
          current={Math.min(currentIndex + 1, deck.length)}
          total={deck.length}
          onBack={handleBack}
        />

        {(status === 'ready' || status === 'complete') && (
          <FlashcardProgress
            current={currentIndex}
            total={deck.length}
            knownCount={knownCount}
            unknownCount={unknownCount}
          />
        )}

        {/* Deck area */}
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}
        >
          {status === 'loading' && <SkeletonCard />}
          {status === 'empty' && <EmptyDeckState onGoBack={handleBack} />}
          {status === 'error' && (
            <FetchErrorState message={errorMsg} onRetry={() => loadDeck(category)} />
          )}
          {status === 'ready' && currentCard && (
            <CardStack
              currentCard={currentCard}
              nextCards={nextCards}
              frontStyle={frontStyle}
              backStyle={backStyle}
              cardAnimatedStyle={cardAnimatedStyle}
              rightOverlayStyle={rightOverlayStyle}
              leftOverlayStyle={leftOverlayStyle}
              panGesture={panGesture}
              onFlip={flip}
            />
          )}
        </View>

        {/* Swipe hint — first 2 cards */}
        {status === 'ready' && currentIndex < 2 && <SwipeHint />}

        {/* Fallback action buttons */}
        {status === 'ready' && (
          <FlashcardActions
            onUnknown={() => handleSwipeComplete('left')}
            onKnown={() => handleSwipeComplete('right')}
            disabled={isAnimating}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
