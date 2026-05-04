import { checkBadgeConditions, BadgeCheckInput } from '../utils/badgeConditions';

describe('Badge Conditions', () => {
  const defaultInput: BadgeCheckInput = {
    lessonsDone: 0,
    totalLessons: 10,
    perfectQuizCount: 0,
    hasCompletedAnyQuiz: false,
    currentStreak: 0,
    wordsMastered: 0,
    earnedBadgeKeys: new Set(),
  };

  it('returns empty array when no conditions are met', () => {
    expect(checkBadgeConditions(defaultInput)).toEqual([]);
  });

  describe('Learning Badges', () => {
    it('awards first_lesson when 1 lesson is done', () => {
      expect(checkBadgeConditions({ ...defaultInput, lessonsDone: 1 })).toContain('first_lesson');
    });

    it('awards three_lessons when 3 lessons are done', () => {
      const earned = checkBadgeConditions({ ...defaultInput, lessonsDone: 3 });
      expect(earned).toContain('first_lesson');
      expect(earned).toContain('three_lessons');
    });

    it('awards all_lessons when all lessons are done', () => {
      const earned = checkBadgeConditions({ ...defaultInput, lessonsDone: 10, totalLessons: 10 });
      expect(earned).toContain('all_lessons');
    });
  });

  describe('Quiz Badges', () => {
    it('awards first_quiz', () => {
      expect(checkBadgeConditions({ ...defaultInput, hasCompletedAnyQuiz: true })).toContain(
        'first_quiz',
      );
    });

    it('awards first_perfect and three_perfects', () => {
      expect(checkBadgeConditions({ ...defaultInput, perfectQuizCount: 1 })).toContain(
        'first_perfect',
      );
      expect(checkBadgeConditions({ ...defaultInput, perfectQuizCount: 3 })).toContain(
        'three_perfects',
      );
    });
  });

  describe('Streak Badges', () => {
    it('awards streak badges progressively', () => {
      expect(checkBadgeConditions({ ...defaultInput, currentStreak: 7 })).toContain('streak_7');
      expect(checkBadgeConditions({ ...defaultInput, currentStreak: 14 })).toContain('streak_14');
      expect(checkBadgeConditions({ ...defaultInput, currentStreak: 30 })).toContain('streak_30');
      expect(checkBadgeConditions({ ...defaultInput, currentStreak: 100 })).toContain('streak_100');
    });
  });

  describe('Mastery Badges', () => {
    it('awards mastery badges progressively', () => {
      expect(checkBadgeConditions({ ...defaultInput, wordsMastered: 10 })).toContain('mastered_10');
      expect(checkBadgeConditions({ ...defaultInput, wordsMastered: 30 })).toContain('mastered_30');
      expect(checkBadgeConditions({ ...defaultInput, wordsMastered: 50 })).toContain('mastered_50');
    });
  });

  describe('Already Earned', () => {
    it('does not return badges that are already in earnedBadgeKeys', () => {
      const earned = checkBadgeConditions({
        ...defaultInput,
        currentStreak: 7,
        earnedBadgeKeys: new Set(['streak_7']),
      });
      expect(earned).toEqual([]); // streak_7 is not returned because it's already earned
    });
  });
});
