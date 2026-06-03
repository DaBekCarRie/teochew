import { generateQuizQuestions } from '../utils/generateQuizQuestions';
import type { WordEntry } from '../types/dictionary';

function makeWord(overrides: Partial<WordEntry> & { id: string }): WordEntry {
  return {
    mandarin_char: '好',
    mandarin_pinyin: 'hǎo',
    thai_meaning: 'ดี',
    english_meaning: 'good',
    teochew_char: '好',
    teochew_pengim: 'hó',
    verified: true,
    ...overrides,
  };
}

describe('generateQuizQuestions', () => {
  it('returns an empty array when given no words', () => {
    expect(generateQuizQuestions([])).toEqual([]);
  });

  it('caps the number of questions at the requested count', () => {
    const words = Array.from({ length: 20 }, (_, i) => makeWord({ id: `w${i}` }));
    expect(generateQuizQuestions(words, 10)).toHaveLength(10);
  });

  it('never produces more questions than available words', () => {
    const words = [makeWord({ id: 'a' }), makeWord({ id: 'b' })];
    expect(generateQuizQuestions(words, 10)).toHaveLength(2);
  });

  it('builds 4 choices with exactly one correct answer', () => {
    const words = Array.from({ length: 6 }, (_, i) => makeWord({ id: `w${i}` }));
    for (const q of generateQuizQuestions(words, 6)) {
      expect(q.choices).toHaveLength(4);
      expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
    }
  });

  it('the correct choice always belongs to the question word', () => {
    const words = Array.from({ length: 6 }, (_, i) => makeWord({ id: `w${i}` }));
    for (const q of generateQuizQuestions(words, 6)) {
      const correct = q.choices.find((c) => c.isCorrect);
      expect(correct?.wordId).toBe(q.word.id);
    }
  });

  it('falls back to mandarin_char for teochew choice labels when teochew is an empty string', () => {
    // Mixed data: most words have only mandarin_char (teochew_char = "").
    const words = [
      makeWord({
        id: 'a',
        teochew_char: '',
        teochew_pengim: '',
        mandarin_char: '人',
        mandarin_pinyin: 'rén',
      }),
      makeWord({ id: 'b', teochew_char: '', teochew_pengim: '' }),
      makeWord({ id: 'c', teochew_char: '', teochew_pengim: '' }),
      makeWord({ id: 'd', teochew_char: '', teochew_pengim: '' }),
    ];
    const questions = generateQuizQuestions(words, 4);
    const thaiToTeochew = questions.filter((q) => q.questionType === 'thai_to_teochew');
    for (const q of thaiToTeochew) {
      for (const choice of q.choices) {
        // Labels must never be the empty string — fallback must kick in.
        expect(choice.label).not.toBe('');
        expect(choice.label).toBeTruthy();
      }
    }
  });

  it('uses teochew_char for teochew choice labels when present', () => {
    const words = [
      makeWord({ id: 'a', teochew_char: '汝好', teochew_pengim: 'lṳ hó' }),
      makeWord({ id: 'b', teochew_char: '食飯', teochew_pengim: 'zia̍h bng' }),
      makeWord({ id: 'c', teochew_char: '多謝', teochew_pengim: 'tō-sia' }),
      makeWord({ id: 'd', teochew_char: '慢來', teochew_pengim: 'bān lâi' }),
    ];
    const questions = generateQuizQuestions(words, 4);
    const teochewChars = new Set(words.map((w) => w.teochew_char));
    for (const q of questions.filter((x) => x.questionType === 'thai_to_teochew')) {
      for (const choice of q.choices) {
        expect(teochewChars.has(choice.label)).toBe(true);
      }
    }
  });
});
