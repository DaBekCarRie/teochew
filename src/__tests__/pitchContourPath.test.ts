import { contourToPoints, isShortTone } from '../utils/pitchContourPath';

describe('contourToPoints', () => {
  describe('single-digit (short tones)', () => {
    it('"2" → one point at x=0.5, y=0.75', () => {
      const pts = contourToPoints('2');
      expect(pts).toHaveLength(1);
      expect(pts[0].x).toBe(0.5);
      expect(pts[0].y).toBeCloseTo(0.75); // pitchLevelToY(2) = 1 - (2-1)/4 = 0.75
    });

    it('"5" → one point at x=0.5, y=0 (top)', () => {
      const pts = contourToPoints('5');
      expect(pts).toHaveLength(1);
      expect(pts[0].x).toBe(0.5);
      expect(pts[0].y).toBe(0); // pitchLevelToY(5) = 0
    });
  });

  describe('two-digit contours', () => {
    it('"33" → flat line at y=0.5 (mid)', () => {
      const pts = contourToPoints('33');
      expect(pts).toHaveLength(2);
      expect(pts[0].y).toBeCloseTo(0.5);
      expect(pts[1].y).toBeCloseTo(0.5);
      expect(pts[0].x).toBe(0);
      expect(pts[1].x).toBe(1);
    });

    it('"55" → flat line at y=0 (top)', () => {
      const pts = contourToPoints('55');
      expect(pts[0].y).toBe(0);
      expect(pts[1].y).toBe(0);
    });

    it('"11" → flat line at y=1 (bottom)', () => {
      const pts = contourToPoints('11');
      expect(pts[0].y).toBe(1); // pitchLevelToY(1) = 1
      expect(pts[1].y).toBe(1);
    });

    it('"53" → descending (high→mid): pts[0].y < pts[1].y', () => {
      const pts = contourToPoints('53');
      expect(pts).toHaveLength(2);
      // pitch 5 = y=0 (high), pitch 3 = y=0.5 (mid)
      expect(pts[0].y).toBeLessThan(pts[1].y);
    });

    it('"35" → ascending (mid→high): pts[0].y > pts[1].y', () => {
      const pts = contourToPoints('35');
      expect(pts[0].y).toBeGreaterThan(pts[1].y);
    });
  });

  describe('three-digit contours', () => {
    it('"213" → 3 points', () => {
      const pts = contourToPoints('213');
      expect(pts).toHaveLength(3);
    });

    it('"213" → x values evenly spaced at 0, 0.5, 1', () => {
      const pts = contourToPoints('213');
      expect(pts[0].x).toBe(0);
      expect(pts[1].x).toBe(0.5);
      expect(pts[2].x).toBe(1);
    });

    it('"213" → mid (2) low (1) mid (3): dips then rises', () => {
      const pts = contourToPoints('213');
      // y values: pitch 2→y=0.75, pitch 1→y=1, pitch 3→y=0.5
      expect(pts[1].y).toBeGreaterThan(pts[0].y); // 2→1: descends (y increases)
      expect(pts[2].y).toBeLessThan(pts[1].y); // 1→3: ascends (y decreases)
    });
  });

  describe('invalid / empty', () => {
    it('empty string → []', () => expect(contourToPoints('')).toEqual([]));
    it('all-letter string → []', () => expect(contourToPoints('abc')).toEqual([]));
    it('digits out of 1-5 range are filtered', () => {
      // "06" → 0 and 6 are filtered; no valid points
      const pts = contourToPoints('06');
      expect(pts).toEqual([]);
    });
  });

  describe('y-axis: lower pitch level = higher y value', () => {
    it('pitch 1 → y=1.0 (bottom)', () => {
      const pts = contourToPoints('1');
      expect(pts[0].y).toBe(1);
    });
    it('pitch 3 → y=0.5 (middle)', () => {
      const pts = contourToPoints('3');
      expect(pts[0].y).toBeCloseTo(0.5);
    });
    it('pitch 5 → y=0 (top)', () => {
      const pts = contourToPoints('5');
      expect(pts[0].y).toBe(0);
    });
  });
});

describe('isShortTone', () => {
  it('"2" is a short tone (tone 4)', () => expect(isShortTone('2')).toBe(true));
  it('"5" is a short tone (tone 8)', () => expect(isShortTone('5')).toBe(true));
  it('"33" is not a short tone', () => expect(isShortTone('33')).toBe(false));
  it('"53" is not a short tone', () => expect(isShortTone('53')).toBe(false));
  it('"55" is not a short tone', () => expect(isShortTone('55')).toBe(false));
  it('"11" is not a short tone', () => expect(isShortTone('11')).toBe(false));
  it('"213" is not a short tone', () => expect(isShortTone('213')).toBe(false));
  it('"35" is not a short tone', () => expect(isShortTone('35')).toBe(false));
});
