export interface FestivalEvent {
  id: string;
  article_id: string | null;
  title_th: string;
  title_en: string;
  title_teochew_char: string;
  title_teochew_pengim: string;
  emoji: string;
  /** Fixed Gregorian month (1–12) */
  month: number;
  /** Fixed Gregorian day */
  day: number;
  accent_color: string;
  description_th: string;
}

export const MOCK_FESTIVALS: FestivalEvent[] = [
  {
    id: 'fest_001',
    article_id: 'art_002',
    title_th: 'เช็งเม้ง',
    title_en: 'Qingming',
    title_teochew_char: '清明',
    title_teochew_pengim: 'Ceng-mêng',
    emoji: '🌿',
    month: 4,
    day: 5,
    accent_color: '#5A8A4A',
    description_th: 'เทศกาลไหว้บรรพบุรุษ ทำความสะอาดสุสาน',
  },
  {
    id: 'fest_002',
    article_id: null,
    title_th: 'เทศกาลบะจ่าง',
    title_en: 'Dragon Boat Festival',
    title_teochew_char: '端午',
    title_teochew_pengim: 'Duan-ngou',
    emoji: '🎋',
    month: 6,
    day: 2,
    accent_color: '#2D7A4A',
    description_th: 'ห่อบะจ่าง แข่งเรือมังกร ระลึกถึงกวีฉูหยวน',
  },
  {
    id: 'fest_003',
    article_id: null,
    title_th: 'วันสารทจีน',
    title_en: 'Ghost Festival',
    title_teochew_char: '中元',
    title_teochew_pengim: 'Diong-guan',
    emoji: '🕯️',
    month: 8,
    day: 29,
    accent_color: '#6B4C2A',
    description_th: 'ไหว้วิญญาณบรรพบุรุษ จุดธูปเทียน ปล่อยโคม',
  },
  {
    id: 'fest_004',
    article_id: null,
    title_th: 'ไหว้พระจันทร์',
    title_en: 'Mid-Autumn Festival',
    title_teochew_char: '中秋',
    title_teochew_pengim: 'Diong-chiu',
    emoji: '🌕',
    month: 10,
    day: 6,
    accent_color: '#9A7A2E',
    description_th: 'กินขนมไหว้พระจันทร์ ชมจันทร์เต็มดวง',
  },
  {
    id: 'fest_005',
    article_id: null,
    title_th: 'เทศกาลกินเจ',
    title_en: 'Vegetarian Festival',
    title_teochew_char: '九皇',
    title_teochew_pengim: 'Gao-huang',
    emoji: '🙏',
    month: 10,
    day: 22,
    accent_color: '#B5451B',
    description_th: 'ถือศีลกินเจ 9 วัน บูชาเทพเก้าจักรพรรดิ์',
  },
  {
    id: 'fest_006',
    article_id: null,
    title_th: 'ตงจื้อ',
    title_en: 'Winter Solstice',
    title_teochew_char: '冬至',
    title_teochew_pengim: 'Tang-ji',
    emoji: '🧧',
    month: 12,
    day: 22,
    accent_color: '#C9A84C',
    description_th: 'ต้มทงยวน (ลูกกลมแป้งข้าวเหนียว) ทานร่วมกันในครอบครัว',
  },
  {
    id: 'fest_007',
    article_id: 'art_001',
    title_th: 'ตรุษจีน',
    title_en: 'Lunar New Year',
    title_teochew_char: '春節',
    title_teochew_pengim: 'Sin-ni',
    emoji: '🎆',
    month: 1,
    day: 29,
    accent_color: '#B5451B',
    description_th: 'ซินเจียยู่อี่ ซินนี้ฮวดไช้! เทศกาลใหญ่ที่สุดของชาวแต้จิ๋ว',
  },
  {
    id: 'fest_008',
    article_id: null,
    title_th: 'หยวนเซียว',
    title_en: 'Lantern Festival',
    title_teochew_char: '元宵',
    title_teochew_pengim: 'Nguang-siau',
    emoji: '🏮',
    month: 2,
    day: 12,
    accent_color: '#C9A84C',
    description_th: 'วันที่ 15 หลังตรุษจีน แขวนโคมไฟ ทานทงยวน',
  },
];

/**
 * Returns the next festival occurring within `windowDays` days from today.
 * Checks both current year and next year to handle year-boundary cases.
 */
export function getNextFestival(today: Date, windowDays = 60): FestivalEvent | null {
  const thisYear = today.getFullYear();
  const todayMs = today.getTime();

  const candidates: { festival: FestivalEvent; ms: number }[] = [];

  for (const festival of MOCK_FESTIVALS) {
    for (const year of [thisYear, thisYear + 1]) {
      const festDate = new Date(year, festival.month - 1, festival.day);
      const diffDays = (festDate.getTime() - todayMs) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= windowDays) {
        candidates.push({ festival, ms: festDate.getTime() });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.ms - b.ms);
  return candidates[0].festival;
}

export function getDaysUntilFestival(today: Date, festival: FestivalEvent): number {
  const thisYear = today.getFullYear();
  const todayMs = today.getTime();
  for (const year of [thisYear, thisYear + 1]) {
    const festDate = new Date(year, festival.month - 1, festival.day);
    const diffDays = Math.ceil((festDate.getTime() - todayMs) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) return diffDays;
  }
  return 0;
}
