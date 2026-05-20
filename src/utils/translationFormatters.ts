import type { TranslationResult } from '../types/translation';

const LANG_NAME: Record<string, string> = {
  th: 'ไทย',
  zh: 'จีนกลาง',
  en: 'English',
};

export function buildCopyText(result: TranslationResult): string {
  return result.output_text;
}

export function buildShareMessage(result: TranslationResult): string {
  const srcName = LANG_NAME[result.source_lang] ?? result.source_lang;
  const tgtName = LANG_NAME[result.target_lang] ?? result.target_lang;
  return `${srcName}: ${result.input_text}
${tgtName}: ${result.output_text}

แปลด้วย Teochew App`;
}
