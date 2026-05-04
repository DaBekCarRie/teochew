import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { VoiceHeader } from '../../../components/voice/VoiceHeader';
import { VoiceIdleState } from '../../../components/voice/VoiceIdleState';
import { RecordButton } from '../../../components/voice/RecordButton';
import { RecordingStateView } from '../../../components/voice/RecordingStateView';
import { PreviewStateView } from '../../../components/voice/PreviewStateView';
import { PreviewActionRow } from '../../../components/voice/PreviewActionRow';
import { PipelineLoadingView } from '../../../components/voice/PipelineLoadingView';
import { VoiceErrorState } from '../../../components/voice/VoiceErrorState';
import { PermissionRequestView } from '../../../components/voice/PermissionRequestView';

import { useAudioRecording } from '../../../hooks/useAudioRecording';
import { useWaveform } from '../../../hooks/useWaveform';
import { useMicPermission } from '../../../hooks/useMicPermission';
import { useVoiceStore } from '../../../stores/voiceStore';

import type { VoiceState, VoiceErrorType, TranscribeResponse } from '../../../types/voice';

const PIPELINE_STATES: VoiceState[] = ['uploading', 'transcribing', 'looking_up'];

async function mockPipeline(
  _uri: string,
  onProgress: (p: number) => void,
  onStep: (s: VoiceState) => void,
): Promise<TranscribeResponse> {
  onStep('uploading');
  for (let i = 0; i <= 100; i += 20) {
    await new Promise((r) => setTimeout(r, 120));
    onProgress(i);
  }
  onStep('transcribing');
  await new Promise((r) => setTimeout(r, 800));
  onStep('looking_up');
  await new Promise((r) => setTimeout(r, 600));

  return {
    transcript: '汝好',
    teochew_char: '汝好',
    pengim: 'le2 ho2',
    thai_meaning: 'สวัสดี',
    english_meaning: 'Hello',
    mandarin_char: '你好',
    verified: false,
    confidence: 0.85,
    processing_ms: 1520,
  };
}

export default function VoiceScreen() {
  const router = useRouter();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [errorType, setErrorType] = useState<VoiceErrorType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [noiseWarning, setNoiseWarning] = useState(false);
  const [waveformSnapshot, setWaveformSnapshot] = useState<number[]>([]);

  const { status: micStatus, request: requestMic } = useMicPermission();
  const { bars, pushMeterLevel, reset: resetWaveform, isNoisyBackground } = useWaveform();
  const {
    audioUri,
    startRecording,
    stopRecording,
    reset: resetAudio,
    autoStopNeeded,
    metering,
    durationMs,
  } = useAudioRecording();

  const { addEntry, pendingResult, setPendingResult } = useVoiceStore();
  const waveUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (pendingResult) {
        setPendingResult(null);
        router.push({
          pathname: '/(tabs)/voice/result',
          params: { resultJson: JSON.stringify(pendingResult) },
        });
      }
    }, [pendingResult, setPendingResult, router]),
  );

  useEffect(() => {
    if (voiceState === 'recording') {
      waveUpdateRef.current = setInterval(() => {
        pushMeterLevel(metering);
        setNoiseWarning(isNoisyBackground(metering));
      }, 50);
    } else {
      if (waveUpdateRef.current) {
        clearInterval(waveUpdateRef.current);
        waveUpdateRef.current = null;
      }
    }
    return () => {
      if (waveUpdateRef.current) {
        clearInterval(waveUpdateRef.current);
        waveUpdateRef.current = null;
      }
    };
  }, [voiceState, metering, pushMeterLevel, isNoisyBackground]);

  useEffect(() => {
    if (autoStopNeeded && voiceState === 'recording') {
      handleStopRecording();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [autoStopNeeded]);

  async function handleStartRecording() {
    if (micStatus === 'denied') {
      setErrorType('mic_permission_denied');
      setVoiceState('error');
      return;
    }
    resetWaveform();
    setNoiseWarning(false);
    setVoiceState('recording');
    try {
      await startRecording();
    } catch {
      setVoiceState('error');
      setErrorType('network');
    }
  }

  async function handleStopRecording() {
    try {
      const { tooShort } = await stopRecording();
      if (tooShort) {
        setVoiceState('error');
        setErrorType('too_short');
        setTimeout(() => {
          setVoiceState('idle');
          setErrorType(null);
        }, 2000);
        return;
      }
      setWaveformSnapshot([...bars]);
      setVoiceState('preview');
    } catch {
      setVoiceState('error');
      setErrorType('network');
    }
  }

  async function handleSendAudio() {
    if (!audioUri) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUploadProgress(0);

    try {
      const result = await mockPipeline(
        audioUri,
        (p) => setUploadProgress(p),
        (s) => setVoiceState(s),
      );

      await addEntry({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        transcript: result.transcript,
        result,
        recorded_at: new Date().toISOString(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: '/(tabs)/voice/result',
        params: {
          resultJson: JSON.stringify(result),
          showLowConfidenceWarning: result.confidence < 0.4 ? 'true' : 'false',
        },
      });
      handleReset();
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setVoiceState('error');
      setErrorType('upload_failed');
    }
  }

  function handleReset() {
    resetAudio();
    resetWaveform();
    setWaveformSnapshot([]);
    setNoiseWarning(false);
    setVoiceState('idle');
    setErrorType(null);
    setUploadProgress(0);
  }

  async function handleRequestPermission() {
    const status = await requestMic();
    if (status === 'denied') {
      setErrorType('mic_permission_denied');
      setVoiceState('error');
    }
  }

  const isPipelineState = PIPELINE_STATES.includes(voiceState as (typeof PIPELINE_STATES)[number]);

  if (micStatus === 'undetermined') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
        <VoiceHeader onOpenHistory={() => router.push('/(tabs)/voice/history')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PermissionRequestView onRequest={handleRequestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <VoiceHeader onOpenHistory={() => router.push('/(tabs)/voice/history')} />

      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
      >
        {voiceState === 'idle' && <VoiceIdleState />}

        {voiceState === 'recording' && (
          <RecordingStateView
            waveformData={bars}
            durationMs={durationMs}
            noiseWarning={noiseWarning}
          />
        )}

        {voiceState === 'preview' && audioUri && (
          <PreviewStateView
            audioUri={audioUri}
            waveformData={waveformSnapshot}
            durationMs={durationMs}
          />
        )}

        {isPipelineState && (
          <PipelineLoadingView
            state={voiceState as 'uploading' | 'transcribing' | 'looking_up'}
            uploadProgress={uploadProgress}
          />
        )}

        {voiceState === 'error' && (
          <VoiceErrorState errorType={errorType} onRetry={handleReset} onReRecord={handleReset} />
        )}
      </View>

      <View style={{ paddingBottom: 32, alignItems: 'center' }}>
        {voiceState === 'idle' && (
          <RecordButton recording={false} onPressIn={handleStartRecording} />
        )}
        {voiceState === 'recording' && <RecordButton recording onPressOut={handleStopRecording} />}
        {voiceState === 'preview' && (
          <PreviewActionRow onSend={handleSendAudio} onCancel={handleReset} />
        )}
      </View>
    </SafeAreaView>
  );
}
