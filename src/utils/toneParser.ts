/**
 * Parse tone numbers from a Peng'im romanization string.
 * Handles numeric-suffix format (e.g. "bung7", "guê2 diao5") only.
 * Returns [] for diacritic-only strings (e.g. "zuì") — no badge shown.
 */
export function parseToneNumbers(pengim: string): number[] {
  return pengim
    .split(/\s+/)
    .map((syllable) => {
      const lastChar = syllable[syllable.length - 1];
      const n = parseInt(lastChar, 10);
      return n >= 1 && n <= 8 ? n : 0;
    })
    .filter((n) => n > 0);
}
