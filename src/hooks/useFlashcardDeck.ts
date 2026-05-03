import { useState, useCallback } from 'react';
import { getFlashcardWords } from '../services/supabase/words';
import { MOCK_WORDS } from '../services/supabase/mockWords';
import type { WordEntry, FlashcardItem, FlashcardResult } from '../types/dictionary';

const USE_MOCK = false;

type DeckStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error' | 'complete';

interface UseFlashcardDeckReturn {
  deck: FlashcardItem[];
  currentIndex: number;
  results: FlashcardResult[];
  status: DeckStatus;
  errorMsg: string | null;
  loadDeck: (category?: string | null, words?: WordEntry[]) => Promise<void>;
  recordResult: (wordId: string, direction: 'left' | 'right', timeSpent: number) => void;
  advance: () => void;
  resetWithWords: (words: WordEntry[]) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toItems(words: WordEntry[]): FlashcardItem[] {
  return words.map((word) => ({ word, status: 'unseen' as const }));
}

export function useFlashcardDeck(): UseFlashcardDeckReturn {
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<FlashcardResult[]>([]);
  const [status, setStatus] = useState<DeckStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDeck = useCallback(async (category?: string | null, words?: WordEntry[]) => {
    setStatus('loading');
    setResults([]);
    setCurrentIndex(0);
    setErrorMsg(null);

    try {
      let fetched: WordEntry[];
      if (words && words.length > 0) {
        fetched = words;
      } else if (USE_MOCK) {
        fetched = category
          ? MOCK_WORDS.filter((w) => w.category === category && w.verified)
          : MOCK_WORDS.filter((w) => w.verified);
      } else {
        fetched = await getFlashcardWords(category, 30);
      }

      const shuffled = shuffle(fetched);
      if (shuffled.length === 0) {
        setDeck([]);
        setStatus('empty');
        return;
      }
      setDeck(toItems(shuffled));
      setStatus('ready');
    } catch {
      setErrorMsg('ไม่สามารถโหลดคำศัพท์ได้ กรุณาลองใหม่');
      setStatus('error');
    }
  }, []);

  const recordResult = useCallback(
    (wordId: string, direction: 'left' | 'right', timeSpent: number) => {
      const result: FlashcardResult = {
        wordId,
        status: direction === 'right' ? 'known' : 'unknown',
        timeSpent,
      };
      setResults((prev) => [...prev, result]);
    },
    [],
  );

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= deck.length) {
        setStatus('complete');
      }
      return next;
    });
  }, [deck.length]);

  const resetWithWords = useCallback((words: WordEntry[]) => {
    const shuffled = shuffle(words);
    setDeck(toItems(shuffled));
    setCurrentIndex(0);
    setResults([]);
    setStatus(shuffled.length > 0 ? 'ready' : 'empty');
  }, []);

  return {
    deck,
    currentIndex,
    results,
    status,
    errorMsg,
    loadDeck,
    recordResult,
    advance,
    resetWithWords,
  };
}
