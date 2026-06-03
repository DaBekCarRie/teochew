import {
  fetchWordsByLessonId,
  getFamilyPhraseWords,
  FAMILY_LESSON,
  FAMILY_PHRASE_WORDS,
} from '../services/lessons';

describe('fetchWordsByLessonId', () => {
  it('returns an empty array for an empty lessonId', async () => {
    await expect(fetchWordsByLessonId('')).resolves.toEqual([]);
  });

  it('returns the self-contained family phrases without a Supabase lookup', async () => {
    const words = await fetchWordsByLessonId(FAMILY_LESSON.id);
    expect(words).toEqual(getFamilyPhraseWords());
    expect(words).toHaveLength(FAMILY_PHRASE_WORDS.length);
  });
});

describe('FAMILY_PHRASE_WORDS data integrity', () => {
  it('every family phrase has a teochew_char and a thai_meaning', () => {
    for (const w of FAMILY_PHRASE_WORDS) {
      expect(w.teochew_char).toBeTruthy();
      expect(w.thai_meaning).toBeTruthy();
    }
  });
});
