export interface ContourPoint {
  x: number;
  y: number;
}

/**
 * Convert a pitch contour string (e.g. "213", "53", "33") to
 * normalised (0–1) coordinate points for rendering.
 *
 * Pitch levels 1–5: 1 = lowest (y=1.0), 5 = highest (y=0.0).
 * x is distributed evenly across [0, 1].
 */
function pitchLevelToY(level: number): number {
  return 1 - (level - 1) / 4;
}

export function contourToPoints(contour: string): ContourPoint[] {
  const digits = contour
    .split('')
    .map(Number)
    .filter((n) => n >= 1 && n <= 5);
  if (digits.length === 0) return [];

  return digits.map((level, i) => ({
    x: digits.length === 1 ? 0.5 : i / (digits.length - 1),
    y: pitchLevelToY(level),
  }));
}

/** Whether this contour represents a short (checked) tone — single digit */
export function isShortTone(contour: string): boolean {
  return contour.length === 1;
}
