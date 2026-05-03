import type { Lesson } from '../types/dictionary';
import { MOCK_WORDS } from './supabase/mockWords';

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
