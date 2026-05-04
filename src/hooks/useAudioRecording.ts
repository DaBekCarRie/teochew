import { useRef, useState, useCallback } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  setAudioModeAsync,
  RecordingPresets,
} from 'expo-audio';

const MIN_DURATION_MS = 500;
const MAX_DURATION_MS = 60_000;

export function useAudioRecording() {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  const recorder = useAudioRecorder(
    {
      ...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    },
    undefined,
  );

  const state = useAudioRecorderState(recorder, 50);

  const startRecording = useCallback(async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    startTimeRef.current = Date.now();
    setAudioUri(null);
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<{
    uri: string | null;
    durationMs: number;
    tooShort: boolean;
  }> => {
    const elapsed = Date.now() - startTimeRef.current;
    await recorder.stop();
    const uri = recorder.uri ?? null;
    setAudioUri(uri);
    return {
      uri,
      durationMs: elapsed,
      tooShort: elapsed < MIN_DURATION_MS,
    };
  }, [recorder]);

  const reset = useCallback(() => {
    setAudioUri(null);
  }, []);

  const autoStopNeeded =
    state.isRecording &&
    state.durationMillis !== undefined &&
    state.durationMillis >= MAX_DURATION_MS;

  return {
    recorder,
    state,
    audioUri,
    startRecording,
    stopRecording,
    reset,
    autoStopNeeded,
    metering: state.metering,
    durationMs: state.durationMillis ?? 0,
  };
}
