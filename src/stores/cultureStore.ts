import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase/client';
import { MOCK_PHRASES } from '../data/mockPhrases';
import type { TeochewPhrase } from '../data/mockPhrases';
import type { WordEntry } from '../types/dictionary';
import * as Notifications from 'expo-notifications';

export interface VocabItem {
  char: string;
  thai: string;
  pengim: string;
}

export interface CultureArticle {
  id: string;
  category: 'festival' | 'food' | 'wedding' | 'religion' | 'tradition';
  title_th: string;
  title_en?: string;
  title_teochew_char?: string;
  title_teochew_pengim?: string;
  cover_image_url: string;
  related_words: WordEntry[];
  content_th: string;
  meaning_label?: string;
  meaning_th?: string;
  customs_label?: string;
  customs_th?: string;
  vocab?: VocabItem[];
  read_minutes?: number;
}

export interface WordOfDay {
  date: string; // YYYY-MM-DD
  word: WordEntry;
}

export type { TeochewPhrase };

export interface CultureStoreState {
  hydrated: boolean;
  wordOfDay: WordOfDay | null;
  phraseOfDay: TeochewPhrase | null;
  articles: CultureArticle[];

  hydrate: () => Promise<void>;
  refreshWordOfDay: () => Promise<void>;
  refreshPhraseOfDay: () => Promise<void>;
  scheduleDailyNotification: (time: string, enabled: boolean) => Promise<void>;
}

const STORAGE_KEY = '@teochew_culture_cache';

const MOCK_ARTICLES: CultureArticle[] = [
  {
    id: 'art_001',
    category: 'festival',
    title_th: 'เทศกาลตรุษจีน',
    title_en: 'Lunar New Year',
    title_teochew_char: '春節',
    title_teochew_pengim: 'Chunjié',
    cover_image_url: 'https://images.unsplash.com/photo-1548123281-9b62a690e543?w=800&q=80',
    related_words: [],
    read_minutes: 5,
    content_th:
      'ตรุษจีน (ซินเจียยู่อี่ ซินนี้ฮวดไช้) เป็นเทศกาลที่สำคัญที่สุดของชาวจีนและชาวแต้จิ๋ว เป็นวันขึ้นปีใหม่ตามปฏิทินจันทรคติ ครอบครัวจะมารวมตัวกัน รับประทานอาหารมงคล และไหว้บรรพบุรุษ',
    meaning_label: 'ความหมายของเทศกาล',
    meaning_th:
      'คำว่า "ตรุษจีน" หมายถึงวันสิ้นปีและเริ่มต้นปีใหม่ตามปฏิทินจันทรคติ สำหรับชาวแต้จิ๋วถือเป็นช่วงเวลาที่ครอบครัวทุกคนต้องกลับมาอยู่ร่วมกัน เพื่อแสดงความกตัญญูต่อบรรพบุรุษ และส่งความปรารถนาดีให้กันและกัน',
    customs_label: 'ประเพณีสำคัญ',
    customs_th:
      'การจุดประทัด แจกอั้งเปา ไหว้เจ้าและบรรพบุรุษ และร่วมรับประทานอาหารกับครอบครัว เป็นกิจกรรมหลักที่ชาวแต้จิ๋วในไทยยังคงรักษาไว้ตั้งแต่รุ่นสู่รุ่น',
    vocab: [
      { char: '春', thai: 'ฤดูใบไม้ผลิ', pengim: 'cung1' },
      { char: '節', thai: 'เทศกาล', pengim: 'zoih4' },
      { char: '紅包', thai: 'อั้งเปา', pengim: 'ang-bao' },
    ],
  },
  {
    id: 'art_002',
    category: 'festival',
    title_th: 'เทศกาลเช็งเม้ง',
    title_en: 'Qingming',
    title_teochew_char: '清明',
    title_teochew_pengim: 'Ceng-mêng',
    cover_image_url: 'https://images.unsplash.com/photo-1614704746401-094d483427be?w=800&q=80',
    related_words: [],
    read_minutes: 4,
    content_th:
      'เช็งเม้ง คือเทศกาลไหว้บรรพบุรุษ ตรงกับช่วงต้นเมษายนของทุกปี ลูกหลานจะพาสมาชิกครอบครัวไปทำความสะอาดสุสานและจัดดอกไม้ ผลไม้ อาหารไว้ไหว้บรรพบุรุษ',
    meaning_label: 'ความหมายของเทศกาล',
    meaning_th:
      '"เช็งเม้ง" แปลว่า สว่าง-ใส เป็นช่วงฤดูกาลที่อากาศดีเหมาะแก่การออกไปไหว้สุสาน ชาวแต้จิ๋วถือว่าการดูแลสุสานบรรพบุรุษเป็นหน้าที่สำคัญของลูกหลาน',
    customs_label: 'ประเพณีสำคัญ',
    customs_th:
      'ลูกหลานจะนำอาหาร ผลไม้ และข้าวของเครื่องใช้จำลองไปเผา เพื่อส่งให้บรรพบุรุษในโลกอื่น แล้วร่วมกันรับประทานอาหารที่สุสาน',
    vocab: [
      { char: '清', thai: 'ใส สะอาด', pengim: 'ceng1' },
      { char: '明', thai: 'สว่าง', pengim: 'mêng5' },
      { char: '掃墓', thai: 'ทำความสะอาดสุสาน', pengim: 'sao-bong' },
    ],
  },
  {
    id: 'art_003',
    category: 'food',
    title_th: 'บะกุ๊ดเต๋',
    title_en: 'Bak Kut Teh',
    title_teochew_char: '肉骨茶',
    title_teochew_pengim: 'Bah-kut-tê',
    cover_image_url: 'https://images.unsplash.com/photo-1590487053535-6187b5a5e396?w=800&q=80',
    related_words: [],
    read_minutes: 3,
    content_th:
      'ซุปกระดูกหมูตุ๋นยาจีนที่มีต้นกำเนิดจากชาวแต้จิ๋ว ชื่อแปลตรงตัวว่า "ชาเนื้อกระดูก" เพราะดื่มคู่กับชาจีน เป็นอาหารที่กรรมกรท่าเรือชาวแต้จิ๋วนิยมกินตอนเช้า',
    meaning_label: 'ที่มาของชื่อ',
    meaning_th:
      '"บะกุ๊ดเต๋" มาจากภาษาแต้จิ๋ว แปลว่า เนื้อ-กระดูก-ชา ตั้งชื่อตามวิธีรับประทานที่ต้องดื่มชาจีนร้อนๆ คู่กัน เพื่อช่วยย่อยอาหารและตัดความมัน',
    customs_label: 'วิธีรับประทาน',
    customs_th:
      'เสิร์ฟพร้อมข้าวสวย ข้าวต้ม หรือขนมปังทอด คนแต้จิ๋วดั้งเดิมจะกินพร้อมชาอู่หลงหรือเต๋ เทซุปใส่ถ้วยชาเล็กๆ แล้วจิบสลับ',
    vocab: [
      { char: '肉', thai: 'เนื้อ', pengim: 'bah4' },
      { char: '骨', thai: 'กระดูก', pengim: 'kut4' },
      { char: '茶', thai: 'ชา', pengim: 'tê5' },
    ],
  },
  {
    id: 'art_004',
    category: 'food',
    title_th: 'ก๋วยเตี๋ยวแต้จิ๋ว',
    title_en: 'Teochew noodles',
    title_teochew_char: '粿條',
    title_teochew_pengim: 'Guê-diao',
    cover_image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    related_words: [],
    read_minutes: 3,
    content_th:
      'ก๋วยเตี๋ยวเส้นแบนทำจากแป้งข้าวเจ้า หรือที่ชาวแต้จิ๋วเรียกว่า "กวยเตี๋ยว" เป็นอาหารประจำชาติที่พบได้ทุกตลาดในย่านที่ชาวแต้จิ๋วอาศัยอยู่',
    meaning_label: 'ความแตกต่างจากก๋วยเตี๋ยวทั่วไป',
    meaning_th:
      'ก๋วยเตี๋ยวแต้จิ๋วมีน้ำซุปที่ใสกว่า ปรุงรสด้วยซีอิ๊ว ปลาหมึกแห้ง และน้ำมันหมู เสิร์ฟพร้อมลูกชิ้นปลาและเนื้อหมูหั่นบาง',
    customs_label: 'วัฒนธรรมการกิน',
    customs_th:
      'ชาวแต้จิ๋วนิยมกินก๋วยเตี๋ยวตอนเช้าเป็นอาหารจุกจิก ร้านก๋วยเตี๋ยวในย่านเยาวราชหลายร้านยังคงใช้สูตรดั้งเดิมที่สืบทอดมาหลายชั่วอายุคน',
    vocab: [
      { char: '粿', thai: 'แป้งข้าวเจ้า', pengim: 'guê2' },
      { char: '條', thai: 'เส้น', pengim: 'diao5' },
      { char: '魚丸', thai: 'ลูกชิ้นปลา', pengim: 'hü-uang' },
    ],
  },
  {
    id: 'art_005',
    category: 'wedding',
    title_th: 'พิธีหมั้นแต้จิ๋ว',
    title_en: 'Engagement rites',
    title_teochew_char: '訂婚',
    title_teochew_pengim: 'Dêng-hung',
    cover_image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80',
    related_words: [],
    read_minutes: 4,
    content_th:
      'พิธีหมั้นของชาวแต้จิ๋วเป็นพิธีกรรมสำคัญที่มีหลายขั้นตอน ตั้งแต่การสู่ขอ การแลกของหมั้น ไปจนถึงการกำหนดวันแต่งงาน',
    meaning_label: 'ความสำคัญของพิธี',
    meaning_th:
      'พิธีหมั้นในวัฒนธรรมแต้จิ๋วถือเป็นสัญญาผูกพันระหว่างสองครอบครัว ไม่ใช่แค่คู่บ่าวสาว การให้เกียรติทั้งสองฝ่ายมีความสำคัญมากกว่าสิ่งของที่แลกเปลี่ยน',
    customs_label: 'ของมงคลในพิธี',
    customs_th:
      'ของหมั้นประกอบด้วยขนมเค้กมงคล ผลไม้คู่ เหล้า และทองคำ ฝ่ายหญิงจะส่งของตอบแทนเพื่อแสดงความขอบคุณ',
    vocab: [
      { char: '訂', thai: 'กำหนด', pengim: 'dêng3' },
      { char: '婚', thai: 'แต่งงาน', pengim: 'hung1' },
      { char: '喜糖', thai: 'ขนมมงคล', pengim: 'hi-teng' },
    ],
  },
  {
    id: 'art_006',
    category: 'wedding',
    title_th: 'งานวันเกิด 60 ปี',
    title_en: 'Sixtieth birthday',
    title_teochew_char: '做六十',
    title_teochew_pengim: 'Zo-lak-zab',
    cover_image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    related_words: [],
    read_minutes: 3,
    content_th:
      'การฉลองวันเกิดครบ 60 ปีของชาวแต้จิ๋วเป็นพิธีใหญ่ที่ญาติมิตรมาร่วมงานจำนวนมาก ถือเป็นการเริ่มต้นวัยผู้อาวุโสที่ควรได้รับการเคารพ',
    meaning_label: 'ทำไมถึงฉลองที่ 60?',
    meaning_th:
      'ตามปฏิทินจีน รอบ 60 ปี (6 รอบ 10 ปี หรือ 5 รอบปีนักษัตร) ถือเป็นการครบรอบของชีวิต เปรียบเหมือนการเกิดใหม่ในฐานะผู้อาวุโส',
    customs_label: 'ของมงคลในงาน',
    customs_th:
      'ขนมเต่าแดง (อั้งกุย) สัญลักษณ์ของอายุยืน ผ่อมีอาหารมังสวิรัติ และบะหมี่ยาว เป็นสิ่งที่ขาดไม่ได้ในงานวันเกิด 60 ปี',
    vocab: [
      { char: '六十', thai: 'หกสิบ', pengim: 'lak-zab' },
      { char: '壽', thai: 'อายุ/สุขภาพ', pengim: 'siu7' },
      { char: '龜', thai: 'เต่า (มงคล)', pengim: 'gu1' },
    ],
  },
];

async function fetchPhrasesFromDB(): Promise<TeochewPhrase[]> {
  try {
    const { data, error } = await supabase
      .from('daily_phrases')
      .select(
        'id, teochew_char, teochew_pengim, thai_meaning, thai_context, english_meaning, audio_url, category',
      )
      .order('sort_order');
    if (error || !data || data.length === 0) return [];
    return data as TeochewPhrase[];
  } catch {
    return [];
  }
}

async function fetchArticlesFromDB(): Promise<CultureArticle[]> {
  try {
    const { data, error } = await supabase.from('culture_articles').select('*').order('sort_order');
    if (error || !data || data.length === 0) return [];
    return data.map((row: any) => ({
      ...row,
      related_words: [],
      vocab: row.vocab ?? [],
    })) as CultureArticle[];
  } catch {
    return [];
  }
}

export const useCultureStore = create<CultureStoreState>((set, get) => ({
  hydrated: false,
  wordOfDay: null,
  phraseOfDay: null,
  articles: MOCK_ARTICLES,

  hydrate: async () => {
    fetchArticlesFromDB().then((articles) => {
      if (articles.length > 0) set({ articles });
    });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ ...parsed, hydrated: true });

        const today = new Date().toISOString().split('T')[0];
        if (parsed.wordOfDay?.date !== today) {
          get().refreshWordOfDay();
        }
        get().refreshPhraseOfDay();
      } else {
        set({ hydrated: true });
        get().refreshWordOfDay();
        get().refreshPhraseOfDay();
      }
    } catch (e) {
      console.error('Failed to hydrate culture store:', e);
      set({ hydrated: true });
      get().refreshWordOfDay();
      get().refreshPhraseOfDay();
    }
  },

  refreshWordOfDay: async () => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
    try {
      const { count } = await supabase
        .from('words')
        .select('*', { count: 'exact', head: true })
        .eq('verified', true)
        .not('teochew_char', 'is', null);
      const total = count ?? 1;
      const offset = seed % total;
      const { data } = await supabase
        .from('words')
        .select(
          'id, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, mandarin_pinyin, category, verified, teochew_audio',
        )
        .eq('verified', true)
        .not('teochew_char', 'is', null)
        .range(offset, offset)
        .single();
      if (data) {
        set({ wordOfDay: { date: today, word: data as any } });
        await saveState(get());
      }
    } catch {
      // keep existing wordOfDay on error
    }
  },

  refreshPhraseOfDay: async () => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0) + 7;
    const phrases = await fetchPhrasesFromDB();
    const pool = phrases.length > 0 ? phrases : MOCK_PHRASES;
    set({ phraseOfDay: pool[seed % pool.length] });
  },

  scheduleDailyNotification: async (time: string, enabled: boolean) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const wordOfDay = get().wordOfDay;
    const title = '🏮 คำแต้จิ๋วประจำวัน';
    const body = wordOfDay
      ? `${wordOfDay.word.teochew_char} (${wordOfDay.word.teochew_pengim}) — ${wordOfDay.word.thai_meaning}`
      : 'เรียนรู้คำแต้จิ๋วใหม่ๆ ทุกวัน!';
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { screen: 'culture' } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },
}));

async function saveState(state: CultureStoreState) {
  try {
    const dataToSave = { wordOfDay: state.wordOfDay };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Failed to save culture store:', e);
  }
}
