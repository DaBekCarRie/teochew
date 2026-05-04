export interface BadgeCheckInput {
  /** Number of lessons completed (quiz ≥ 60). */
  lessonsDone: number;
  /** Total number of lessons in the app. */
  totalLessons: number;
  /** Number of times the user has scored 100% on any quiz. */
  perfectQuizCount: number;
  /** Whether the user has ever completed a quiz (score recorded). */
  hasCompletedAnyQuiz: boolean;
  /** Current streak in days. */
  currentStreak: number;
  /** Number of words at mastered level. */
  wordsMastered: number;
  /** Set of condition_keys the user has already earned (to avoid re-awarding). */
  earnedBadgeKeys: Set<string>;
}

/**
 * Pure function — checks all badge conditions and returns condition_keys
 * for newly earned badges (not already in earnedBadgeKeys).
 * Called client-side after every XP-earning action (BR-6).
 */
export function checkBadgeConditions(input: BadgeCheckInput): string[] {
  const {
    lessonsDone,
    totalLessons,
    perfectQuizCount,
    hasCompletedAnyQuiz,
    currentStreak,
    wordsMastered,
    earnedBadgeKeys,
  } = input;

  const newlyEarned: string[] = [];

  function check(key: string, condition: boolean) {
    if (condition && !earnedBadgeKeys.has(key)) {
      newlyEarned.push(key);
    }
  }

  // Learning badges
  check('first_lesson', lessonsDone >= 1);
  check('three_lessons', lessonsDone >= 3);
  check('all_lessons', totalLessons > 0 && lessonsDone >= totalLessons);

  // Quiz badges
  check('first_quiz', hasCompletedAnyQuiz);
  check('first_perfect', perfectQuizCount >= 1);
  check('three_perfects', perfectQuizCount >= 3);

  // Streak badges
  check('streak_7', currentStreak >= 7);
  check('streak_14', currentStreak >= 14);
  check('streak_30', currentStreak >= 30);
  check('streak_100', currentStreak >= 100);

  // Mastery badges
  check('mastered_10', wordsMastered >= 10);
  check('mastered_30', wordsMastered >= 30);
  check('mastered_50', wordsMastered >= 50);

  return newlyEarned;
}
