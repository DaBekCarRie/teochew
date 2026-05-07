import { supabase } from './client';
import type { TranslationResult } from '../../types/translation';

interface SubmitCorrectionParams {
  wordResult: TranslationResult;
  suggestedTeochewChar: string;
  suggestedPengim: string;
  note: string;
}

export async function submitCorrection({
  wordResult,
  suggestedTeochewChar,
  suggestedPengim,
  note,
}: SubmitCorrectionParams): Promise<void> {
  const { error } = await supabase.from('corrections').insert({
    mandarin_char: wordResult.mandarin_char,
    original_teochew_char: wordResult.teochew_char,
    original_pengim: wordResult.pengim,
    suggested_teochew_char: suggestedTeochewChar.trim(),
    suggested_pengim: suggestedPengim.trim(),
    note: note.trim() || null,
  });

  if (error) {
    const err = new Error(error.message);
    err.name = 'NetworkError';
    throw err;
  }
}
