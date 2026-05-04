import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InputLang, TranslationResult } from '../../types/translation';

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
      teochew_char: '？',
      pengim: 'aa1',
      thai_meaning: `[AI: ${mandarin_char}]`,
      english_meaning: null,
      verified: false,
      source: 'claude_ai',
      detected_lang,
    };
  }

  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_ANTHROPIC_KEY not set');

  const prompt = `Translate the Mandarin Chinese word/phrase "${mandarin_char}" into Teochew dialect.
Provide JSON with keys: teochew_char, pengim (Teochew romanization with tone numbers 1-8), thai_meaning, english_meaning.
Return only valid JSON, no explanation.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = new Error('Claude API error');
    err.name = 'NetworkError';
    throw err;
  }

  const json = (await response.json()) as {
    content: { type: string; text: string }[];
  };
  const text = json.content.find((c) => c.type === 'text')?.text ?? '{}';

  let parsed: {
    teochew_char?: string;
    pengim?: string;
    thai_meaning?: string;
    english_meaning?: string;
  } = {};
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {}

  return {
    input_text,
    mandarin_char,
    teochew_char: parsed.teochew_char ?? null,
    pengim: parsed.pengim ?? null,
    thai_meaning: parsed.thai_meaning ?? null,
    english_meaning: parsed.english_meaning ?? null,
    verified: false,
    source: 'claude_ai',
    detected_lang,
  };
}
