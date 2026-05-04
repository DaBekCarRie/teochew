import { useRef, useCallback } from 'react';

const MAX_BARS = 40;
const MIN_HEIGHT = 0.08;
const NOISE_FLOOR_DB = -40;

export function useWaveform() {
  const barsRef = useRef<number[]>(Array(MAX_BARS).fill(MIN_HEIGHT));

  const pushMeterLevel = useCallback((meteringDb: number | undefined): number[] => {
    const db = meteringDb ?? -160;
    // Normalise dB (-160..0) to amplitude 0..1
    const clamped = Math.max(-80, Math.min(0, db));
    const amplitude = Math.max(MIN_HEIGHT, (clamped + 80) / 80);

    const next = [...barsRef.current.slice(1), amplitude];
    barsRef.current = next;
    return next;
  }, []);

  function reset() {
    barsRef.current = Array(MAX_BARS).fill(MIN_HEIGHT);
  }

  function isNoisyBackground(meteringDb: number | undefined): boolean {
    if (meteringDb === undefined) return false;
    return meteringDb > NOISE_FLOOR_DB;
  }

  return { bars: barsRef.current, pushMeterLevel, reset, isNoisyBackground };
}
