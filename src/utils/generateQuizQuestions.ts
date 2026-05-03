import type { WordEntry, QuizQuestion, QuizChoice, QuestionType } from '../types/dictionary';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick 3 distractors: same category first, fill from pool if needed. */
function pickDistractors(targetWord: WordEntry, allWords: WordEntry[], count: number): WordEntry[] {
  const others = allWords.filter((w) => w.id !== targetWord.id);
  const sameCategory = others.filter((w) => w.category && w.category === targetWord.category);
  const diffCategory = others.filter((w) => !w.category || w.category !== targetWord.category);

  const pool = [...shuffle(sameCategory), ...shuffle(diffCategory)];
  return pool.slice(0, count);
}

function toChoice(word: WordEntry, questionType: QuestionType, isCorrect: boolean): QuizChoice {
  return {
    wordId: word.id,
    label: questionType === 'teochew_to_thai' ? word.thai_meaning : word.teochew_char,
    sublabel: questionType === 'thai_to_teochew' ? word.teochew_pengim : undefined,
    isCorrect,
  };
}

export function generateQuizQuestions(
  words: WordEntry[],
  questionCount: number = 10,
): QuizQuestion[] {
  if (words.length === 0) return [];

  const shuffled = shuffle(words);
  const selected = shuffled.slice(0, Math.min(questionCount, words.length));

  return selected.map((word) => {
    // BR-5: 60% teochew_to_thai, 40% thai_to_teochew
    const questionType: QuestionType = Math.random() < 0.6 ? 'teochew_to_thai' : 'thai_to_teochew';

    const distractors = pickDistractors(word, words, 3);
    const choices: QuizChoice[] = shuffle([
      toChoice(word, questionType, true),
      ...distractors.map((d) => toChoice(d, questionType, false)),
    ]);

    return { word, choices, questionType };
  });
}
