import type { MasteryLevel, WordProgress } from '../types/dictionary';

/**
 * Calculate mastery level from word progress counters.
 *
 * Rules (from BA AC-2):
 *   new      → times_seen = 0
 *   learning → times_seen ≥ 1 AND accuracy < 60%
 *   reviewing→ accuracy ≥ 60% AND < 90%
 *   mastered → accuracy ≥ 90% AND times_correct ≥ 3
 *
 * accuracy = timesCorrect / (timesCorrect + timesIncorrect)
 * When no quiz attempts yet (denominator = 0) accuracy is treated as 0.
 */
export function calculateMastery(
  p: Pick<WordProgress, 'timesSeen' | 'timesCorrect' | 'timesIncorrect'>,
): MasteryLevel {
  if (p.timesSeen === 0) return 'new';

  const total = p.timesCorrect + p.timesIncorrect;
  const accuracy = total > 0 ? (p.timesCorrect / total) * 100 : 0;

  if (accuracy >= 90 && p.timesCorrect >= 3) return 'mastered';
  if (accuracy >= 60) return 'reviewing';
  return 'learning';
}

/** Compute accuracy percentage (0-100). Returns null if never attempted in quiz. */
export function computeAccuracy(
  p: Pick<WordProgress, 'timesCorrect' | 'timesIncorrect'>,
): number | null {
  const total = p.timesCorrect + p.timesIncorrect;
  if (total === 0) return null;
  return Math.round((p.timesCorrect / total) * 100);
}
