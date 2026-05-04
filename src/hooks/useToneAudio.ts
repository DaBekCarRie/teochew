import { useCallback, useEffect, useRef, useState } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { TONES } from '../utils/toneData';

/** Gap between tones in compare mode (ms) */
const COMPARE_GAP_MS = 500;
/** Highlight duration when no audio_url available (ms) */
const NO_AUDIO_HIGHLIGHT_MS = 1000;
/** Estimated playback duration used to schedule toneB in compare when no real audio */
const ESTIMATED_AUDIO_MS = 1200;

/** Module-level singleton — only one tone plays at a time */
let _activeTonePlayer: AudioPlayer | null = null;

function killActiveTonePlayer() {
  if (_activeTonePlayer) {
    try {
      _activeTonePlayer.remove();
    } catch {
      /* noop */
    }
    _activeTonePlayer = null;
  }
}

export interface UseToneAudioReturn {
  /** Which tone number is currently playing (null = idle) */
  playingTone: number | null;
  /** Play example audio for a single tone */
  playTone: (toneNumber: number) => void;
  /** Play toneA → gap → toneB (compare mode) */
  playCompare: (toneA: number, toneB: number) => void;
  /** Stop all playback and clear pending compare timers */
  stopAll: () => void;
}

export function useToneAudio(): UseToneAudioReturn {
  const [playingTone, setPlayingTone] = useState<number | null>(null);
  const unmountedRef = useRef(false);
  const audioModeSetRef = useRef(false);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearPending = useCallback(() => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      clearPending();
      killActiveTonePlayer();
    };
  }, [clearPending]);

  const stopAll = useCallback(() => {
    clearPending();
    killActiveTonePlayer();
    if (!unmountedRef.current) setPlayingTone(null);
  }, [clearPending]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      pendingTimers.current = pendingTimers.current.filter((t) => t !== id);
      fn();
    }, ms);
    pendingTimers.current.push(id);
  }, []);

  const playTone = useCallback(
    (toneNumber: number): void => {
      clearPending();
      killActiveTonePlayer();
      if (unmountedRef.current) return;

      const tone = TONES.find((t) => t.number === toneNumber);
      if (!tone) return;

      setPlayingTone(toneNumber);

      if (!tone.audio_url) {
        // No audio yet — highlight for UI feedback only
        schedule(() => {
          if (!unmountedRef.current) setPlayingTone(null);
        }, NO_AUDIO_HIGHLIGHT_MS);
        return;
      }

      // Real audio playback
      void (async () => {
        try {
          if (!audioModeSetRef.current) {
            await setAudioModeAsync({ playsInSilentMode: false, shouldPlayInBackground: false });
            audioModeSetRef.current = true;
          }
          const player = createAudioPlayer({ uri: tone.audio_url! }, { updateInterval: 100 });
          _activeTonePlayer = player;
          player.addListener('playbackStatusUpdate', (s) => {
            if (unmountedRef.current || _activeTonePlayer !== player) return;
            if (s.didJustFinish) {
              if (!unmountedRef.current) setPlayingTone(null);
              try {
                player.remove();
              } catch {
                /* noop */
              }
              if (_activeTonePlayer === player) _activeTonePlayer = null;
            }
          });
          player.play();
        } catch {
          if (!unmountedRef.current) setPlayingTone(null);
        }
      })();
    },
    [clearPending, schedule],
  );

  const playCompare = useCallback(
    (toneA: number, toneB: number): void => {
      const toneAInfo = TONES.find((t) => t.number === toneA);
      const toneADuration = toneAInfo?.audio_url ? ESTIMATED_AUDIO_MS : NO_AUDIO_HIGHLIGHT_MS;

      playTone(toneA);
      schedule(() => {
        if (!unmountedRef.current) playTone(toneB);
      }, toneADuration + COMPARE_GAP_MS);
    },
    [playTone, schedule],
  );

  return { playingTone, playTone, playCompare, stopAll };
}
