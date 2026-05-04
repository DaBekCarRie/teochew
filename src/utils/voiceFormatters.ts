import type { TranscribeResponse } from '../types/voice';

export function buildVoiceShareMessage(result: TranscribeResponse): string {
  const unverifiedNote = !result.verified
    ? '\n⚠️ หมายเหตุ: คำนี้ยังไม่ได้รับการยืนยันจากผู้เชี่ยวชาญ'
    : '';

  return `🎙️ เงียม: ${result.transcript}
🎮 แต้จิ๋ว: ${result.teochew_char ?? '—'} (${result.pengim ?? '—'})
🇹🇭 ไทย: ${result.thai_meaning ?? '—'}
🇨🇳 จีนกลาง: ${result.mandarin_char ?? '—'}
🇬🇧 English: ${result.english_meaning ?? '—'}${unverifiedNote}

แปลด้วย Teochew 🎮`;
}

export function buildVoiceCopyText(result: TranscribeResponse): string {
  return [
    `${result.teochew_char ?? '—'} (${result.pengim ?? '—'})`,
    result.thai_meaning ? `ไทย: ${result.thai_meaning}` : null,
    result.english_meaning ? `English: ${result.english_meaning}` : null,
  ]
    .filter(Boolean)
    .join(' → ');
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
