export interface ToneInfo {
  number: number;
  name_zh: string;
  name_th: string;
  pitch_contour: string;
  description_th: string;
  example_char: string;
  example_pengim: string;
  example_meaning_th: string;
  audio_url: string | null;
  color: string;
}

export const TONE_COLORS: string[] = [
  '#4A6FA5', // tone 1 — blue
  '#4A7C59', // tone 2 — green
  '#C9A84C', // tone 3 — gold
  '#B5451B', // tone 4 — brick
  '#7B4F9D', // tone 5 — purple
  '#2C8C7C', // tone 6 — teal
  '#8B6914', // tone 7 — dark gold
  '#C44569', // tone 8 — rose
];

export const TONES: ToneInfo[] = [
  {
    number: 1,
    name_zh: '陰平',
    name_th: 'อิ๋ง ติง',
    pitch_contour: '33',
    description_th: 'เสียงราบกลาง',
    example_char: '分',
    example_pengim: 'hung1',
    example_meaning_th: 'แบ่ง',
    audio_url: null,
    color: TONE_COLORS[0],
  },
  {
    number: 2,
    name_zh: '陰上',
    name_th: 'อิ๋ง สั้ง',
    pitch_contour: '53',
    description_th: 'เสียงตกสูง→กลาง',
    example_char: '粉',
    example_pengim: 'hung2',
    example_meaning_th: 'แป้ง',
    audio_url: null,
    color: TONE_COLORS[1],
  },
  {
    number: 3,
    name_zh: '陰去',
    name_th: 'อิ๋ง คี้',
    pitch_contour: '213',
    description_th: 'เสียงต่ำ→ขึ้น',
    example_char: '訓',
    example_pengim: 'hung3',
    example_meaning_th: 'สอน',
    audio_url: null,
    color: TONE_COLORS[2],
  },
  {
    number: 4,
    name_zh: '陰入',
    name_th: 'อิ๋ง ยิง',
    pitch_contour: '2',
    description_th: 'เสียงสั้นต่ำ (-p/-t/-k)',
    example_char: '忽',
    example_pengim: 'hug4',
    example_meaning_th: 'ทันใด',
    audio_url: null,
    color: TONE_COLORS[3],
  },
  {
    number: 5,
    name_zh: '陽平',
    name_th: 'เอี๋ยง ติง',
    pitch_contour: '55',
    description_th: 'เสียงราบสูง',
    example_char: '雲',
    example_pengim: 'hung5',
    example_meaning_th: 'เมฆ',
    audio_url: null,
    color: TONE_COLORS[4],
  },
  {
    number: 6,
    name_zh: '陽上',
    name_th: 'เอี๋ยง สั้ง',
    pitch_contour: '35',
    description_th: 'เสียงขึ้นกลาง→สูง',
    example_char: '混',
    example_pengim: 'hung6',
    example_meaning_th: 'ผสม',
    audio_url: null,
    color: TONE_COLORS[5],
  },
  {
    number: 7,
    name_zh: '陽去',
    name_th: 'เอี๋ยง คี้',
    pitch_contour: '11',
    description_th: 'เสียงราบต่ำ',
    example_char: '份',
    example_pengim: 'hung7',
    example_meaning_th: 'ส่วน',
    audio_url: null,
    color: TONE_COLORS[6],
  },
  {
    number: 8,
    name_zh: '陽入',
    name_th: 'เอี๋ยง ยิง',
    pitch_contour: '5',
    description_th: 'เสียงสั้นสูง (-p/-t/-k)',
    example_char: '佛',
    example_pengim: 'hug8',
    example_meaning_th: 'พระพุทธ',
    audio_url: null,
    color: TONE_COLORS[7],
  },
];
