import type { XPSource } from '../types/dictionary';

/** Base XP awarded per source action. */
export const XP_AMOUNTS: Record<XPSource, number> = {
  flashcard_complete: 10,
  quiz_complete: 15,
  quiz_bonus_80: 5, // awarded on top of quiz_complete when score ≥ 80
  quiz_perfect: 10, // awarded on top of quiz_bonus_80 when score = 100
  lesson_complete: 10, // awarded when both flashcard + quiz ≥ 60 done
  streak_milestone: 20,
  daily_bonus: 5,
  first_lesson: 50, // one-time
  word_mastered: 3,
};
