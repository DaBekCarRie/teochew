import type { Lesson, WordEntry } from '../types/dictionary';
import { MOCK_WORDS } from './supabase/mockWords';

// ─── Family Connection Flow ───────────────────────────────────────────────────
// NOTE: pengim and audio are placeholders — requires linguist review before
// production release (see spec open questions).

export const FAMILY_PHRASE_WORDS: WordEntry[] = [
  // ทักทาย
  {
    id: 'family-01',
    teochew_char: '好無',
    teochew_pengim: 'hó bô',
    thai_meaning: 'สบายดีไหม',
    english_meaning: 'Are you well?',
    verified: false,
  },
  {
    id: 'family-02',
    teochew_char: '食飯未',
    teochew_pengim: 'zia̍h bng bue',
    thai_meaning: 'กินข้าวหรือยัง',
    english_meaning: 'Have you eaten?',
    verified: false,
  },
  {
    id: 'family-03',
    teochew_char: '今日按怎',
    teochew_pengim: 'kin-ji̍t án-zuáinn',
    thai_meaning: 'วันนี้เป็นยังไงบ้าง',
    english_meaning: 'How was your day?',
    verified: false,
  },
  {
    id: 'family-04',
    teochew_char: '天氣熱',
    teochew_pengim: 'tinn-khì jua̍h',
    thai_meaning: 'อากาศร้อนนะ',
    english_meaning: 'The weather is hot',
    verified: false,
  },
  // ถามสารทุกข์
  {
    id: 'family-05',
    teochew_char: '睏有好無',
    teochew_pengim: 'khùn ū hó bô',
    thai_meaning: 'นอนหลับได้ไหม',
    english_meaning: 'Are you sleeping well?',
    verified: false,
  },
  {
    id: 'family-06',
    teochew_char: '有痛佗位',
    teochew_pengim: 'ū thiànn tó-ūi',
    thai_meaning: 'ปวดที่ไหนไหม',
    english_meaning: 'Where does it hurt?',
    verified: false,
  },
  {
    id: 'family-07',
    teochew_char: '飢無',
    teochew_pengim: 'ki bô',
    thai_meaning: 'หิวข้าวไหม',
    english_meaning: 'Are you hungry?',
    verified: false,
  },
  {
    id: 'family-08',
    teochew_char: '愛保重',
    teochew_pengim: 'ài pó-tiōng',
    thai_meaning: 'ดูแลตัวด้วยนะ',
    english_meaning: 'Take care of yourself',
    verified: false,
  },
  // บอกรัก / ใกล้ชิด
  {
    id: 'family-09',
    teochew_char: '我愛汝',
    teochew_pengim: 'ua ài lṳ',
    thai_meaning: 'รักคุณนะ',
    english_meaning: 'I love you',
    verified: false,
  },
  {
    id: 'family-10',
    teochew_char: '我上想汝',
    teochew_pengim: 'ua siōng siūnn lṳ',
    thai_meaning: 'คิดถึงมากเลย',
    english_meaning: 'I miss you so much',
    verified: false,
  },
  {
    id: 'family-11',
    teochew_char: '汝真重要',
    teochew_pengim: 'lṳ tsin tiōng-iàu',
    thai_meaning: 'คุณสำคัญมากสำหรับฉัน',
    english_meaning: 'You are very important to me',
    verified: false,
  },
  {
    id: 'family-12',
    teochew_char: '多謝',
    teochew_pengim: 'tō-sia',
    thai_meaning: 'ขอบคุณนะ',
    english_meaning: 'Thank you',
    verified: false,
  },
  // ประจำวัน
  {
    id: 'family-13',
    teochew_char: '轉來了',
    teochew_pengim: 'tńg lâi liáu',
    thai_meaning: 'กลับบ้านแล้ว',
    english_meaning: "I'm home",
    verified: false,
  },
  {
    id: 'family-14',
    teochew_char: '去做工',
    teochew_pengim: 'khì zoh-kang',
    thai_meaning: 'ไปทำงาน',
    english_meaning: 'Going to work',
    verified: false,
  },
  {
    id: 'family-15',
    teochew_char: '好食無',
    teochew_pengim: 'hó-zia̍h bô',
    thai_meaning: 'อร่อยไหม',
    english_meaning: 'Is it delicious?',
    verified: false,
  },
  {
    id: 'family-16',
    teochew_char: '無關係',
    teochew_pengim: 'bô-kuan-hē',
    thai_meaning: 'ไม่เป็นไร',
    english_meaning: "It's okay / Never mind",
    verified: false,
  },
  {
    id: 'family-17',
    teochew_char: '愛細膩',
    teochew_pengim: 'ài sè-jī',
    thai_meaning: 'ระวังด้วยนะ',
    english_meaning: 'Be careful',
    verified: false,
  },
  {
    id: 'family-18',
    teochew_char: '慢來',
    teochew_pengim: 'bān lâi',
    thai_meaning: 'เดี๋ยวมาหานะ',
    english_meaning: "I'll visit soon",
    verified: false,
  },
  {
    id: 'family-19',
    teochew_char: '有閒打電話',
    teochew_pengim: 'ū-îng phah tiān-uē',
    thai_meaning: 'โทรมาบ้างนะ',
    english_meaning: 'Call me when you have time',
    verified: false,
  },
  {
    id: 'family-20',
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
  sort_order: 0, // แสดงก่อน lesson อื่นทุกอัน
  word_ids: FAMILY_PHRASE_WORDS.map((w) => w.id),
};

/** Returns family phrase WordEntry objects (self-contained, no Supabase lookup needed). */
export function getFamilyPhraseWords(): WordEntry[] {
  return FAMILY_PHRASE_WORDS;
}

// Static lesson definitions (mirror the Supabase seed)
export const LESSONS: Lesson[] = [
  {
    id: 'lesson-greetings',
    title: 'การทักทาย',
    subtitle: 'คำพูดทักทายพื้นฐาน 10 คำ',
    icon: 'hand-left-outline',
    sort_order: 1,
    word_ids: [
      'mock-010',
      'mock-020',
      'mock-011',
      'mock-012',
      'mock-013',
      'mock-014',
      'mock-003',
      'mock-017',
      'mock-018',
      'mock-019',
    ],
  },
  {
    id: 'lesson-family',
    title: 'ครอบครัว',
    subtitle: 'คำเรียกญาติ 8 คำ',
    icon: 'people-outline',
    sort_order: 2,
    word_ids: [
      'mock-008',
      'mock-009',
      'mock-003',
      'mock-010',
      'mock-011',
      'mock-012',
      'mock-013',
      'mock-014',
    ],
  },
  {
    id: 'lesson-food',
    title: 'อาหาร',
    subtitle: 'อาหารและเครื่องดื่ม 9 คำ',
    icon: 'restaurant-outline',
    sort_order: 3,
    word_ids: [
      'mock-004',
      'mock-005',
      'mock-006',
      'mock-007',
      'mock-019',
      'mock-002',
      'mock-010',
      'mock-015',
      'mock-016',
    ],
  },
  {
    id: 'lesson-food-2',
    title: 'อาหารแต้จิ๋ว',
    subtitle: 'คำศัพท์อาหาร 12 คำ',
    icon: 'restaurant-outline',
    sort_order: 4,
    word_ids: [
      'mock-food-01',
      'mock-food-02',
      'mock-food-03',
      'mock-food-04',
      'mock-food-05',
      'mock-food-06',
      'mock-food-07',
      'mock-food-08',
      'mock-food-09',
      'mock-food-10',
      'mock-food-11',
      'mock-food-12',
    ],
  },
  {
    id: 'lesson-colors',
    title: 'สี',
    subtitle: 'คำศัพท์สี 10 คำ',
    icon: 'color-palette-outline',
    sort_order: 5,
    word_ids: [
      'mock-color-01',
      'mock-color-02',
      'mock-color-03',
      'mock-color-04',
      'mock-color-05',
      'mock-color-06',
      'mock-color-07',
      'mock-color-08',
      'mock-color-09',
      'mock-color-10',
    ],
  },
];

/** Returns the WordEntry objects for a given lesson (from mock data in dev). */
export function getLessonWords(lesson: Lesson) {
  return lesson.word_ids
    .map((id) => MOCK_WORDS.find((w) => w.id === id))
    .filter(Boolean) as (typeof MOCK_WORDS)[number][];
}
