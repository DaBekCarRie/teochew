import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InputLang, TranslationResult } from '../../types/translation';
import { supabase } from '../supabase/client';

const MAX_CALLS_PER_DAY = 20;

function todayKey(): string {
  return `@teochew/claude_rate_${new Date().toISOString().slice(0, 10)}`;
}

async function getRateCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(todayKey());
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function incrementRateCount(): Promise<void> {
  try {
    const count = await getRateCount();
    await AsyncStorage.setItem(todayKey(), String(count + 1));
  } catch {}
}

export async function claudeFallback(
  mandarin_char: string,
  input_text: string,
  detected_lang: InputLang,
): Promise<TranslationResult> {
  const count = await getRateCount();
  if (count >= MAX_CALLS_PER_DAY) {
    const err = new Error('Claude rate limit exceeded');
    err.name = 'RateLimitClaudeError';
    throw err;
  }

  await incrementRateCount();

  if (__DEV__) {
    return {
      input_text,
      mandarin_char,
      teochew_char: null,
      pengim: null,
      thai_meaning: `[AI: ${mandarin_char}]`,
      english_meaning: `[AI: ${mandarin_char}]`,
      verified: false,
      source: 'claude_ai',
      detected_lang,
    };
  }

  const { data, error } = await supabase.functions.invoke<{
    content: { type: string; text: string }[];
  }>('translate-fallback', { body: { mandarin_char } });

  if (error || !data) {
    const err = new Error('Claude API error');
    err.name = 'NetworkError';
    throw err;
  }

  const text = data.content.find((c) => c.type === 'text')?.text ?? '{}';

  let parsed: { thai_meaning?: string; english_meaning?: string } = {};
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {}

  return {
    input_text,
    mandarin_char,
    teochew_char: null,
    pengim: null,
    thai_meaning: parsed.thai_meaning ?? null,
    english_meaning: parsed.english_meaning ?? null,
    verified: false,
    source: 'claude_ai',
    detected_lang,
  };
}
