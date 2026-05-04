import type { TranslationResult } from '../types/translation';

export function buildCopyText(result: TranslationResult): string {
  const parts = [
    `${result.teochew_char ?? '—'} (${result.pengim ?? '—'})`,
    result.thai_meaning ? `ไทย: ${result.thai_meaning}` : null,
    result.mandarin_char ? `จีนกลาง: ${result.mandarin_char}` : null,
    result.english_meaning ? `English: ${result.english_meaning}` : null,
  ].filter(Boolean);
  return parts.join(' → ');
}

export function buildShareMessage(result: TranslationResult): string {
  const unverifiedNote = !result.verified
    ? '\n⚠️ หมายเหตุ: คำนี้ยังไม่ได้รับการยืนยันจากผู้เชี่ยวชาญ'
    : '';

  return `🎮 แต้จิ๋ว: ${result.teochew_char ?? '—'} (${result.pengim ?? '—'})
🇹🇭 ไทย: ${result.thai_meaning ?? '—'}
🇨🇳 จีนกลาง: ${result.mandarin_char ?? '—'}
🇬🇧 English: ${result.english_meaning ?? '—'}${unverifiedNote}

แปลด้วย Teochew 🎮`;
}
