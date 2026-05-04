import { parseToneNumbers } from '../utils/toneParser';

describe('parseToneNumbers', () => {
  describe('single syllable', () => {
    it('parses tone 1', () => expect(parseToneNumbers('hung1')).toEqual([1]));
    it('parses tone 2', () => expect(parseToneNumbers('ho2')).toEqual([2]));
    it('parses tone 8', () => expect(parseToneNumbers('hug8')).toEqual([8]));
    it('parses tone 5', () => expect(parseToneNumbers('hung5')).toEqual([5]));
  });

  describe('multi-syllable', () => {
    it('parses two syllables with same tone', () =>
      expect(parseToneNumbers('leu2 ho2')).toEqual([2, 2]));
    it('parses two syllables with different tones', () =>
      expect(parseToneNumbers('guê2 diao5')).toEqual([2, 5]));
    it('parses three syllables', () =>
      expect(parseToneNumbers('hung1 hung5 hung7')).toEqual([1, 5, 7]));
  });

  describe('out-of-range values', () => {
    it('ignores digit 0', () => expect(parseToneNumbers('ho0')).toEqual([]));
    it('ignores digit 9', () => expect(parseToneNumbers('ho9')).toEqual([]));
  });

  describe('edge cases', () => {
    it('returns empty array for empty string', () => expect(parseToneNumbers('')).toEqual([]));
    it('returns empty array for non-numeric suffix (diacritics)', () =>
      expect(parseToneNumbers('zuì')).toEqual([]));
    it('returns empty array for whitespace-only string', () =>
      expect(parseToneNumbers('   ')).toEqual([]));
    it('handles mixed valid/invalid syllables', () =>
      expect(parseToneNumbers('hung1 bad0 hung3')).toEqual([1, 3]));
  });

  describe('business rule BR-1: last digit is tone number', () => {
    it('ziah8 → 8', () => expect(parseToneNumbers('ziah8')).toEqual([8]));
    it('ghua3 → 3', () => expect(parseToneNumbers('ghua3')).toEqual([3]));
    it('bho5 → 5', () => expect(parseToneNumbers('bho5')).toEqual([5]));
  });
});
