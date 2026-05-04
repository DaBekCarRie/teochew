import type { InputLang, TranslationResult } from '../../types/translation';
import { normalizeToMandarin } from './normalize';
import { lookupTeochew } from './lookup';
import { claudeFallback } from './claudeFallback';

export class NetworkError extends Error {
  constructor(message = 'ไม่มีอินเทอร์เน็ต') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitGoogleError extends Error {
  constructor() {
    super('เกินจำนวนการแปลในขณะนี้');
    this.name = 'RateLimitGoogleError';
  }
}

export class RateLimitClaudeError extends Error {
  constructor() {
    super('ใช้การแปล AI ครบ 20 ครั้งแล้ววันนี้');
    this.name = 'RateLimitClaudeError';
  }
}

export async function translateInput(input: string, lang: InputLang): Promise<TranslationResult> {
  let normalized: Awaited<ReturnType<typeof normalizeToMandarin>>;
  try {
    normalized = await normalizeToMandarin(input, lang);
  } catch (e) {
    const err = e as Error;
    if (err.name === 'RateLimitGoogleError') throw new RateLimitGoogleError();
    throw new NetworkError();
  }

  let result: TranslationResult | null = null;
  try {
    result = await lookupTeochew(normalized.mandarin_char);
  } catch {
    throw new NetworkError();
  }

  if (result) {
    return { ...result, input_text: input, detected_lang: normalized.detected_lang };
  }

  try {
    const fallback = await claudeFallback(
      normalized.mandarin_char,
      input,
      normalized.detected_lang,
    );
    return fallback;
  } catch (e) {
    const err = e as Error;
    if (err.name === 'RateLimitClaudeError') throw new RateLimitClaudeError();
    throw new NetworkError();
  }
}
