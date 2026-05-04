export type VoiceState =
  | 'idle'
  | 'recording'
  | 'preview'
  | 'uploading'
  | 'transcribing'
  | 'looking_up'
  | 'error';

export type VoiceErrorType =
  | 'mic_permission_denied'
  | 'too_short'
  | 'low_confidence'
  | 'silence'
  | 'upload_failed'
  | 'transcription_failed'
  | 'timeout'
  | 'network';

export interface TranscribeResponse {
  transcript: string;
  teochew_char: string | null;
  pengim: string | null;
  thai_meaning: string | null;
  english_meaning: string | null;
  mandarin_char: string | null;
  verified: boolean;
  confidence: number;
  processing_ms?: number;
}

export interface VoiceHistoryEntry {
  id: string;
  transcript: string;
  result: TranscribeResponse;
  recorded_at: string;
}
