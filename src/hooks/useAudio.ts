import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer, AudioStatus as ExpoAudioStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PlaybackRate = 0.75 | 1.0;
export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'finished' | 'error';

export interface AudioError {
  code: 'LOAD_ERROR' | 'PLAYBACK_ERROR' | 'TIMEOUT_ERROR' | 'NO_URL';
  message: string;
}

export interface UseAudioReturn {
  status: AudioStatus;
  isPlaying: boolean;
  isLoading: boolean;
  currentRate: PlaybackRate;
  error: AudioError | null;
  positionMs: number;
  durationMs: number;
  play: () => void;
  pause: () => void;
  replay: () => void;
  toggleSlowMode: () => void;
  stop: () => void;
}

// Module-level singleton: ensures only one player plays at a time (BR-3 / AC-8)
let _activePlayer: AudioPlayer | null = null;

function pauseGlobal() {
  if (_activePlayer) {
    try {
      _activePlayer.pause();
    } catch {
      // ignore
    }
    _activePlayer = null;
  }
}

export function useAudio(audioUrl: string | null | undefined): UseAudioReturn {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [currentRate, setCurrentRate] = useState<PlaybackRate>(1.0);
  const [error, setError] = useState<AudioError | null>(null);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  const playerRef = useRef<AudioPlayer | null>(null);
  const rateRef = useRef<PlaybackRate>(1.0);
  const replayDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioModeSetRef = useRef(false);
  const unmountedRef = useRef(false);

  // Keep rateRef in sync
  useEffect(() => {
    rateRef.current = currentRate;
  }, [currentRate]);

  const destroyPlayer = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    playerRef.current = null;
    if (_activePlayer === p) _activePlayer = null;
    try {
      p.remove();
    } catch {
      // ignore
    }
    if (!unmountedRef.current) {
      setStatus('idle');
      setPositionMs(0);
      setDurationMs(0);
    }
  }, []);

  // Cleanup on unmount (AC-9 / BR-6)
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      if (replayDebounceRef.current) clearTimeout(replayDebounceRef.current);
      destroyPlayer();
    };
  }, [destroyPlayer]);

  // Reset when URL changes
  useEffect(() => {
    destroyPlayer();
    setError(null);
    setStatus('idle');
  }, [audioUrl, destroyPlayer]);

  const ensureAudioMode = useCallback(async () => {
    if (audioModeSetRef.current) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: false,
        shouldPlayInBackground: false,
      });
      audioModeSetRef.current = true;
    } catch {
      // non-fatal
    }
  }, []);

  const attachStatusListener = useCallback((player: AudioPlayer) => {
    player.addListener('playbackStatusUpdate', (s: ExpoAudioStatus) => {
      if (unmountedRef.current || playerRef.current !== player) return;
      setPositionMs(Math.round((s.currentTime ?? 0) * 1000));
      setDurationMs(Math.round((s.duration ?? 0) * 1000));
      if (s.didJustFinish) {
        setStatus('finished');
        setPositionMs(0);
      } else if (s.playing) {
        setStatus('playing');
      } else if (s.isLoaded && !s.playing) {
        // only flip to paused if we were playing (avoid overwriting 'loading')
        setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
      }
    });
  }, []);

  const loadAndPlay = useCallback(async () => {
    if (!audioUrl) {
      setError({ code: 'NO_URL', message: 'ไม่มีเสียงสำหรับคำนี้' });
      setStatus('error');
      return;
    }

    // Stop any other globally playing audio
    if (_activePlayer && _activePlayer !== playerRef.current) {
      pauseGlobal();
    }

    // Destroy existing player
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }

    await ensureAudioMode();
    setStatus('loading');
    setError(null);
    setPositionMs(0);
    setDurationMs(0);

    try {
      const player = createAudioPlayer({ uri: audioUrl }, { updateInterval: 100 });
      player.shouldCorrectPitch = true; // preserve pitch at 0.75x (AC-5)
      player.volume = 1.0;
      player.setPlaybackRate(rateRef.current, 'high');

      attachStatusListener(player);

      playerRef.current = player;
      _activePlayer = player;

      player.play();
    } catch {
      if (!unmountedRef.current) {
        setError({
          code: 'LOAD_ERROR',
          message: 'ไม่สามารถโหลดเสียงได้ กรุณาลองใหม่',
        });
        setStatus('error');
      }
    }
  }, [audioUrl, ensureAudioMode, attachStatusListener]);

  const play = useCallback(() => {
    if (status === 'playing') return;
    if (status === 'paused' && playerRef.current) {
      playerRef.current.play();
      setStatus('playing');
      return;
    }
    loadAndPlay();
  }, [status, loadAndPlay]);

  const pause = useCallback(() => {
    if (status !== 'playing' || !playerRef.current) return;
    playerRef.current.pause();
    setStatus('paused');
  }, [status]);

  const replay = useCallback(() => {
    // Debounce rapid taps (EC-7)
    if (replayDebounceRef.current) return;
    replayDebounceRef.current = setTimeout(() => {
      replayDebounceRef.current = null;
    }, 300);

    if (playerRef.current) {
      const p = playerRef.current;
      p.seekTo(0).then(() => {
        if (playerRef.current === p) {
          p.play();
          setStatus('playing');
        }
      });
    } else {
      loadAndPlay();
    }
  }, [loadAndPlay]);

  const toggleSlowMode = useCallback(() => {
    const nextRate: PlaybackRate = rateRef.current === 1.0 ? 0.75 : 1.0;
    setCurrentRate(nextRate);
    rateRef.current = nextRate;
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(nextRate, 'high');
    }
  }, []);

  const stop = useCallback(() => {
    destroyPlayer();
  }, [destroyPlayer]);

  return {
    status,
    isPlaying: status === 'playing',
    isLoading: status === 'loading',
    currentRate,
    error,
    positionMs,
    durationMs,
    play,
    pause,
    replay,
    toggleSlowMode,
    stop,
  };
}
