export type InputLang = 'th' | 'zh' | 'en';

export type TranslationScreenState = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

export type ErrorType = 'network' | 'rate_limit_google' | 'rate_limit_claude' | 'unknown' | null;

export interface TranslationResult {
  input_text: string;
  mandarin_char: string;
  teochew_char: string | null;
  pengim: string | null;
  thai_meaning: string | null;
  english_meaning: string | null;
  verified: boolean;
  source: 'dataset' | 'claude_ai';
  detected_lang: InputLang;
}

export interface HistoryEntry {
  id: string;
  input_text: string;
  detected_lang: InputLang;
  result: TranslationResult;
  translated_at: string;
}
