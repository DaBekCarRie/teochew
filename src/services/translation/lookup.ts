import { supabase } from '../supabase/client';
import { MOCK_WORDS } from '../supabase/mockWords';
import type { TranslationResult } from '../../types/translation';

const USE_MOCK = __DEV__;

export async function lookupTeochew(mandarin_char: string): Promise<TranslationResult | null> {
  if (USE_MOCK) {
    const word = MOCK_WORDS.find((w) => w.mandarin_char === mandarin_char);
    if (!word) return null;
    return {
      input_text: mandarin_char,
      mandarin_char: word.mandarin_char ?? mandarin_char,
      teochew_char: word.teochew_char,
      pengim: word.teochew_pengim,
      thai_meaning: word.thai_meaning,
      english_meaning: word.english_meaning ?? null,
      verified: true,
      source: 'dataset',
      detected_lang: 'zh',
    };
  }

  const { data, error } = await supabase
    .from('words')
    .select('teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char')
    .eq('mandarin_char', mandarin_char)
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    input_text: mandarin_char,
    mandarin_char: data.mandarin_char as string,
    teochew_char: data.teochew_char as string | null,
    pengim: data.teochew_pengim as string | null,
    thai_meaning: data.thai_meaning as string | null,
    english_meaning: (data.english_meaning as string | null) ?? null,
    verified: true,
    source: 'dataset',
    detected_lang: 'zh',
  };
}
