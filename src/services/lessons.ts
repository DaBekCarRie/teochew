import type { Lesson, WordEntry } from '../types/dictionary';
import { supabase } from './supabase/client';

const WORD_SELECT =
  'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio';

/** Fetch lesson words from Supabase, preserving the lesson's word order. */
export async function fetchLessonWords(wordIds: string[]): Promise<WordEntry[]> {
  if (wordIds.length === 0) return [];
  const { data, error } = await supabase.from('words').select(WORD_SELECT).in('id', wordIds);
  if (error || !data) return [];
  const map = new Map((data as WordEntry[]).map((w) => [w.id, w]));
  return wordIds.map((id) => map.get(id)).filter(Boolean) as WordEntry[];
}

// ─── Family Connection Flow ───────────────────────────────────────────────────
// NOTE: pengim and audio are placeholders — requires linguist review before
// production release (see spec open questions).

export const FAMILY_PHRASE_WORDS: WordEntry[] = [
  // ทักทาย
  {
    id: 'family-01',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '好無',
    teochew_pengim: 'hó bô',
    thai_meaning: 'สบายดีไหม',
    english_meaning: 'Are you well?',
    verified: false,
  },
  {
    id: 'family-02',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '食飯未',
    teochew_pengim: 'zia̍h bng bue',
    thai_meaning: 'กินข้าวหรือยัง',
    english_meaning: 'Have you eaten?',
    verified: false,
  },
  {
    id: 'family-03',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '今日按怎',
    teochew_pengim: 'kin-ji̍t án-zuáinn',
    thai_meaning: 'วันนี้เป็นยังไงบ้าง',
    english_meaning: 'How was your day?',
    verified: false,
  },
  {
    id: 'family-04',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '天氣熱',
    teochew_pengim: 'tinn-khì jua̍h',
    thai_meaning: 'อากาศร้อนนะ',
    english_meaning: 'The weather is hot',
    verified: false,
  },
  // ถามสารทุกข์
  {
    id: 'family-05',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '睏有好無',
    teochew_pengim: 'khùn ū hó bô',
    thai_meaning: 'นอนหลับได้ไหม',
    english_meaning: 'Are you sleeping well?',
    verified: false,
  },
  {
    id: 'family-06',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '有痛佗位',
    teochew_pengim: 'ū thiànn tó-ūi',
    thai_meaning: 'ปวดที่ไหนไหม',
    english_meaning: 'Where does it hurt?',
    verified: false,
  },
  {
    id: 'family-07',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '飢無',
    teochew_pengim: 'ki bô',
    thai_meaning: 'หิวข้าวไหม',
    english_meaning: 'Are you hungry?',
    verified: false,
  },
  {
    id: 'family-08',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '愛保重',
    teochew_pengim: 'ài pó-tiōng',
    thai_meaning: 'ดูแลตัวด้วยนะ',
    english_meaning: 'Take care of yourself',
    verified: false,
  },
  // บอกรัก / ใกล้ชิด
  {
    id: 'family-09',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '我愛汝',
    teochew_pengim: 'ua ài lṳ',
    thai_meaning: 'รักคุณนะ',
    english_meaning: 'I love you',
    verified: false,
  },
  {
    id: 'family-10',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '我上想汝',
    teochew_pengim: 'ua siōng siūnn lṳ',
    thai_meaning: 'คิดถึงมากเลย',
    english_meaning: 'I miss you so much',
    verified: false,
  },
  {
    id: 'family-11',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '汝真重要',
    teochew_pengim: 'lṳ tsin tiōng-iàu',
    thai_meaning: 'คุณสำคัญมากสำหรับฉัน',
    english_meaning: 'You are very important to me',
    verified: false,
  },
  {
    id: 'family-12',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '多謝',
    teochew_pengim: 'tō-sia',
    thai_meaning: 'ขอบคุณนะ',
    english_meaning: 'Thank you',
    verified: false,
  },
  // ประจำวัน
  {
    id: 'family-13',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '轉來了',
    teochew_pengim: 'tńg lâi liáu',
    thai_meaning: 'กลับบ้านแล้ว',
    english_meaning: "I'm home",
    verified: false,
  },
  {
    id: 'family-14',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '去做工',
    teochew_pengim: 'khì zoh-kang',
    thai_meaning: 'ไปทำงาน',
    english_meaning: 'Going to work',
    verified: false,
  },
  {
    id: 'family-15',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '好食無',
    teochew_pengim: 'hó-zia̍h bô',
    thai_meaning: 'อร่อยไหม',
    english_meaning: 'Is it delicious?',
    verified: false,
  },
  {
    id: 'family-16',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '無關係',
    teochew_pengim: 'bô-kuan-hē',
    thai_meaning: 'ไม่เป็นไร',
    english_meaning: "It's okay / Never mind",
    verified: false,
  },
  {
    id: 'family-17',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '愛細膩',
    teochew_pengim: 'ài sè-jī',
    thai_meaning: 'ระวังด้วยนะ',
    english_meaning: 'Be careful',
    verified: false,
  },
  {
    id: 'family-18',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '慢來',
    teochew_pengim: 'bān lâi',
    thai_meaning: 'เดี๋ยวมาหานะ',
    english_meaning: "I'll visit soon",
    verified: false,
  },
  {
    id: 'family-19',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '有閒打電話',
    teochew_pengim: 'ū-îng phah tiān-uē',
    thai_meaning: 'โทรมาบ้างนะ',
    english_meaning: 'Call me when you have time',
    verified: false,
  },
  {
    id: 'family-20',
    mandarin_char: '',
    mandarin_pinyin: '',
    teochew_char: '我上愛汝',
    teochew_pengim: 'ua siōng ài lṳ',
    thai_meaning: 'ฉันรักคุณที่สุด',
    english_meaning: 'I love you the most',
    verified: false,
  },
];

export const FAMILY_LESSON: Lesson = {
  id: 'lesson-family-phrases',
  title: 'คุยกับปู่ย่า',
  subtitle: '20 ประโยคพูดได้เลยวันนี้',
  icon: 'heart-outline',
  sort_order: 0,
  word_ids: [
    '40000001-0000-0000-0000-000000000000',
    '40000002-0000-0000-0000-000000000000',
    '40000003-0000-0000-0000-000000000000',
    '40000004-0000-0000-0000-000000000000',
    '40000005-0000-0000-0000-000000000000',
    '40000006-0000-0000-0000-000000000000',
    '40000007-0000-0000-0000-000000000000',
    '40000008-0000-0000-0000-000000000000',
    '40000009-0000-0000-0000-000000000000',
    '40000010-0000-0000-0000-000000000000',
    '40000011-0000-0000-0000-000000000000',
    '40000012-0000-0000-0000-000000000000',
    '40000013-0000-0000-0000-000000000000',
    '40000014-0000-0000-0000-000000000000',
    '40000015-0000-0000-0000-000000000000',
    '40000016-0000-0000-0000-000000000000',
    '40000017-0000-0000-0000-000000000000',
    '40000018-0000-0000-0000-000000000000',
    '40000019-0000-0000-0000-000000000000',
    '40000020-0000-0000-0000-000000000000',
  ],
};

/** Returns family phrase WordEntry objects (self-contained, no Supabase lookup needed). */
export function getFamilyPhraseWords(): WordEntry[] {
  return FAMILY_PHRASE_WORDS;
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-greetings',
    title: 'การทักทาย',
    subtitle: 'คำพูดทักทายพื้นฐาน 10 คำ',
    icon: 'hand-left-outline',
    sort_order: 1,
    word_ids: [
      '10000010-0000-0000-0000-000000000000',
      '10000020-0000-0000-0000-000000000000',
      '10000011-0000-0000-0000-000000000000',
      '10000012-0000-0000-0000-000000000000',
      '10000013-0000-0000-0000-000000000000',
      '10000014-0000-0000-0000-000000000000',
      '10000003-0000-0000-0000-000000000000',
      '10000017-0000-0000-0000-000000000000',
      '10000018-0000-0000-0000-000000000000',
      '10000019-0000-0000-0000-000000000000',
    ],
  },
  {
    id: 'lesson-family',
    title: 'ครอบครัว',
    subtitle: 'คำเรียกญาติ 8 คำ',
    icon: 'people-outline',
    sort_order: 2,
    word_ids: [
      '10000008-0000-0000-0000-000000000000',
      '10000009-0000-0000-0000-000000000000',
      '10000003-0000-0000-0000-000000000000',
      '10000010-0000-0000-0000-000000000000',
      '10000011-0000-0000-0000-000000000000',
      '10000012-0000-0000-0000-000000000000',
      '10000013-0000-0000-0000-000000000000',
      '10000014-0000-0000-0000-000000000000',
    ],
  },
  {
    id: 'lesson-food',
    title: 'อาหาร',
    subtitle: 'อาหารและเครื่องดื่ม 9 คำ',
    icon: 'restaurant-outline',
    sort_order: 3,
    word_ids: [
      '10000004-0000-0000-0000-000000000000',
      '10000005-0000-0000-0000-000000000000',
      '10000006-0000-0000-0000-000000000000',
      '10000007-0000-0000-0000-000000000000',
      '10000019-0000-0000-0000-000000000000',
      '10000002-0000-0000-0000-000000000000',
      '10000010-0000-0000-0000-000000000000',
      '10000015-0000-0000-0000-000000000000',
      '10000016-0000-0000-0000-000000000000',
    ],
  },
  {
    id: 'lesson-food-2',
    title: 'อาหารแต้จิ๋ว',
    subtitle: 'คำศัพท์อาหาร 12 คำ',
    icon: 'restaurant-outline',
    sort_order: 4,
    word_ids: [
      '20000001-0000-0000-0000-000000000000',
      '20000002-0000-0000-0000-000000000000',
      '20000003-0000-0000-0000-000000000000',
      '20000004-0000-0000-0000-000000000000',
      '20000005-0000-0000-0000-000000000000',
      '20000006-0000-0000-0000-000000000000',
      '20000007-0000-0000-0000-000000000000',
      '20000008-0000-0000-0000-000000000000',
      '20000009-0000-0000-0000-000000000000',
      '20000010-0000-0000-0000-000000000000',
      '20000011-0000-0000-0000-000000000000',
      '20000012-0000-0000-0000-000000000000',
    ],
  },
  {
    id: 'lesson-colors',
    title: 'สี',
    subtitle: 'คำศัพท์สี 10 คำ',
    icon: 'color-palette-outline',
    sort_order: 5,
    word_ids: [
      '30000001-0000-0000-0000-000000000000',
      '30000002-0000-0000-0000-000000000000',
      '30000003-0000-0000-0000-000000000000',
      '30000004-0000-0000-0000-000000000000',
      '30000005-0000-0000-0000-000000000000',
      '30000006-0000-0000-0000-000000000000',
      '30000007-0000-0000-0000-000000000000',
      '30000008-0000-0000-0000-000000000000',
      '30000009-0000-0000-0000-000000000000',
      '30000010-0000-0000-0000-000000000000',
    ],
  },
];

export async function fetchLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, subtitle, icon, sort_order, word_ids')
    .order('sort_order');
  if (error || !data || data.length === 0) return [FAMILY_LESSON, ...LESSONS];
  return data as Lesson[];
}

/**
 * Resolve a lesson's words from its ID alone (e.g. deep link / direct nav where
 * the caller didn't pass an explicit wordIds list). Falls back to the local
 * LESSONS / FAMILY_LESSON definitions when the lesson isn't in Supabase.
 */
export async function fetchWordsByLessonId(lessonId: string): Promise<WordEntry[]> {
  if (!lessonId) return [];
  // Family phrases are self-contained (no Supabase lookup needed).
  if (lessonId === FAMILY_LESSON.id) return getFamilyPhraseWords();

  const lessons = await fetchLessons();
  const lesson = lessons.find((l) => l.id === lessonId) ?? LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return [];
  return fetchLessonWords(lesson.word_ids);
}

/** @deprecated Use fetchLessonWords instead. */
export async function getLessonWords(lesson: Lesson): Promise<WordEntry[]> {
  return fetchLessonWords(lesson.word_ids);
}
