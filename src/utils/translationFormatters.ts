import type { TranslationResult } from '../types/translation';

export function buildCopyText(result: TranslationResult): string {
  const parts = [
    result.thai_meaning ? `ไทย: ${result.thai_meaning}` : null,
    result.mandarin_char ? `จีนกลาง: ${result.mandarin_char}` : null,
    result.english_meaning ? `English: ${result.english_meaning}` : null,
  ].filter(Boolean);
  return parts.join(' · ');
}

export function buildShareMessage(result: TranslationResult): string {
  return `🇹🇭 ไทย: ${result.thai_meaning ?? '—'}
🇨🇳 จีนกลาง: ${result.mandarin_char ?? '—'}
🇬🇧 English: ${result.english_meaning ?? '—'}

แปลด้วย Teochew App`;
}
