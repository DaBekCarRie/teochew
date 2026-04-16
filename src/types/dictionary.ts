export interface WordEntry {
  id: string;
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
  mandarin_char?: string;
  mandarin_pinyin?: string;
  category?: string;
  verified: boolean;
}
