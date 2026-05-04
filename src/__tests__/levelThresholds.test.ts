import {
  getLevelForXP,
  getNextLevel,
  getXPWithinLevel,
  getXPToNextLevel,
  getLevelProgress,
} from '../utils/levelThresholds';

describe('Level Thresholds', () => {
  describe('getLevelForXP', () => {
    it('returns Level 1 for 0 XP', () => {
      expect(getLevelForXP(0).level).toBe(1);
    });

    it('returns Level 1 for 99 XP', () => {
      expect(getLevelForXP(99).level).toBe(1);
    });

    it('returns Level 2 for 100 XP', () => {
      expect(getLevelForXP(100).level).toBe(2);
    });

    it('returns Level 3 for 300 XP', () => {
      expect(getLevelForXP(300).level).toBe(3);
    });

    it('returns max level (8) for 4000+ XP', () => {
      expect(getLevelForXP(4000).level).toBe(8);
      expect(getLevelForXP(9999).level).toBe(8);
    });
  });

  describe('getNextLevel', () => {
    it('returns Level 2 for Level 1', () => {
      expect(getNextLevel(1)?.level).toBe(2);
    });

    it('returns null for max level (8)', () => {
      expect(getNextLevel(8)).toBeNull();
    });
  });

  describe('getXPWithinLevel', () => {
    it('returns offset from current level threshold', () => {
      expect(getXPWithinLevel(0)).toBe(0);
      expect(getXPWithinLevel(50)).toBe(50);
      expect(getXPWithinLevel(150)).toBe(50); // Lv2 is 100
      expect(getXPWithinLevel(400)).toBe(100); // Lv3 is 300
    });
  });

  describe('getXPToNextLevel', () => {
    it('returns total XP needed in the current level bracket', () => {
      expect(getXPToNextLevel(0)).toBe(100); // Lv1 to Lv2 is 100
      expect(getXPToNextLevel(150)).toBe(200); // Lv2 (100) to Lv3 (300) is 200
    });

    it('returns 1 for max level to avoid division by zero', () => {
      expect(getXPToNextLevel(5000)).toBe(1);
    });
  });

  describe('getLevelProgress', () => {
    it('returns fraction of progress within current level', () => {
      expect(getLevelProgress(50)).toBeCloseTo(0.5); // 50/100
      expect(getLevelProgress(200)).toBeCloseTo(0.5); // 100/200 (Lv2 requires 100, next is 300)
    });

    it('caps at 1', () => {
      expect(getLevelProgress(5000)).toBe(1);
    });
  });
});
