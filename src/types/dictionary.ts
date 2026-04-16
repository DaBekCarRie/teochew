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

export interface UsageExample {
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
}

export interface WordDetail extends WordEntry {
  notes?: string; // e.g. tone notes, cultural context
  usage_examples: UsageExample[];
}

export interface BookmarkItem {
  id: string; // word_id
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
  category?: string;
  bookmarked_at: string; // ISO 8601
}
