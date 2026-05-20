import type { Lang, TranslationResult } from '../../types/translation';
import { callMyMemory } from './normalize';

export class NetworkError extends Error {
  constructor(message = 'ไม่มีอินเทอร์เน็ต') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('เกินจำนวนการแปลในขณะนี้');
    this.name = 'RateLimitError';
  }
}

export async function translateInput(
  text: string,
  source: Lang,
  target: Lang,
): Promise<TranslationResult> {
  try {
    const output = await callMyMemory(text, source, target);
    return {
      input_text: text,
      output_text: output,
      source_lang: source,
      target_lang: target,
      source: 'api',
    };
  } catch (e) {
    const err = e as Error;
    if (err.name === 'RateLimitError') throw new RateLimitError();
    throw new NetworkError();
  }
}
