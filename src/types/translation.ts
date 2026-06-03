export type Lang = 'th' | 'zh' | 'en' | 'tc';

export type TranslationScreenState = 'idle' | 'loading' | 'success' | 'error';

export type ErrorType = 'network' | 'rate_limit' | 'unknown' | null;

export interface TranslationResult {
  input_text: string;
  output_text: string;
  source_lang: Lang;
  target_lang: Lang;
  source: 'api' | 'cache';
}

export interface HistoryEntry {
  id: string;
  translated_at: string;
  result: TranslationResult;
}
