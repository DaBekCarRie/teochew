import { useState, useCallback, useRef } from 'react';
import { generateQuizQuestions } from '../utils/generateQuizQuestions';
import type { WordEntry, QuizQuestion, QuizAnswer, QuizResult } from '../types/dictionary';

type QuizStatus = 'idle' | 'ready' | 'insufficient' | 'complete';

interface UseQuizSessionReturn {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  status: QuizStatus;
  selectedChoiceId: string | null;
  showFeedback: boolean;
  correctCount: number;
  incorrectCount: number;
  initQuiz: (words: WordEntry[], questionCount?: number) => void;
  selectChoice: (choiceId: string) => void;
  nextQuestion: () => void;
  getResult: () => QuizResult;
  retryIncorrect: () => void;
}

export function useQuizSession(): UseQuizSessionReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const lockedRef = useRef(false); // prevent double-tap

  const initQuiz = useCallback((words: WordEntry[], questionCount = 10) => {
    if (words.length === 0) {
      setStatus('insufficient');
      return;
    }
    const generated = generateQuizQuestions(words, questionCount);
    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedChoiceId(null);
    setShowFeedback(false);
    lockedRef.current = false;
    questionStartTimeRef.current = Date.now();
    setStatus('ready');
  }, []);

  const selectChoice = useCallback(
    (choiceId: string) => {
      if (lockedRef.current || showFeedback) return;
      lockedRef.current = true;

      const timeSpent = Date.now() - questionStartTimeRef.current;
      const question = questions[currentIndex];
      if (!question) return;

      const correctChoice = question.choices.find((c) => c.isCorrect);
      const isCorrect = choiceId === correctChoice?.wordId;

      const answer: QuizAnswer = {
        wordId: question.word.id,
        selectedChoiceId: choiceId,
        correctChoiceId: correctChoice?.wordId ?? '',
        isCorrect,
        timeSpent,
      };

      setSelectedChoiceId(choiceId);
      setShowFeedback(true);
      setAnswers((prev) => [...prev, answer]);
    },
    [questions, currentIndex, showFeedback],
  );

  const nextQuestion = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= questions.length) {
      setStatus('complete');
      return;
    }
    setCurrentIndex(next);
    setSelectedChoiceId(null);
    setShowFeedback(false);
    lockedRef.current = false;
    questionStartTimeRef.current = Date.now();
  }, [currentIndex, questions.length]);

  const getResult = useCallback((): QuizResult => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const incorrectCount = answers.filter((a) => !a.isCorrect).length;
    const totalTimeSpent = answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    return {
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      score,
      answers,
      totalTimeSpent,
    };
  }, [answers, questions.length]);

  const retryIncorrect = useCallback(() => {
    const incorrectWordIds = new Set(answers.filter((a) => !a.isCorrect).map((a) => a.wordId));
    const incorrectWords = questions
      .filter((q) => incorrectWordIds.has(q.word.id))
      .map((q) => q.word);
    initQuiz(incorrectWords);
  }, [answers, questions, initQuiz]);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.filter((a) => !a.isCorrect).length;

  return {
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
    retryIncorrect,
  };
}
