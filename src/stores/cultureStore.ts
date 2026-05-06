import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_WORDS } from '../services/supabase/mockWords';
import type { WordEntry } from '../types/dictionary';
import * as Notifications from 'expo-notifications';

export interface CultureArticle {
  id: string;
  category: 'festival' | 'food' | 'wedding' | 'religion' | 'tradition';
  title_th: string;
  title_en?: string;
  cover_image_url: string;
  related_words: WordEntry[];
  content_th: string;
}

export interface WordOfDay {
  date: string; // YYYY-MM-DD
  word: WordEntry;
}

export interface CultureStoreState {
  hydrated: boolean;
  wordOfDay: WordOfDay | null;
  articles: CultureArticle[];

  hydrate: () => Promise<void>;
  refreshWordOfDay: () => Promise<void>;
  scheduleDailyNotification: (time: string, enabled: boolean) => Promise<void>;
}

const STORAGE_KEY = '@teochew_culture_cache';

// Mock some articles
const MOCK_ARTICLES: CultureArticle[] = [
  {
    id: 'art_001',
    category: 'festival',
    title_th: 'เทศกาลตรุษจีน',
    cover_image_url: 'https://images.unsplash.com/photo-1548123281-9b62a690e543?w=800&q=80',
    related_words: [],
    content_th:
      'ตรุษจีน (ซินเจียยู่อี่ ซินนี้ฮวดไช้) เป็นเทศกาลที่สำคัญที่สุดของชาวจีนและชาวแต้จิ๋ว...',
  },
  {
    id: 'art_002',
    category: 'festival',
    title_th: 'เทศกาลเช็งเม้ง',
    cover_image_url: 'https://images.unsplash.com/photo-1614704746401-094d483427be?w=800&q=80',
    related_words: [],
    content_th: 'เช็งเม้ง คือเทศกาลไหว้บรรพบุรุษ...',
  },
  {
    id: 'art_003',
    category: 'food',
    title_th: 'บะกุ๊ดเต๋',
    cover_image_url: 'https://images.unsplash.com/photo-1590487053535-6187b5a5e396?w=800&q=80',
    related_words: [],
    content_th: 'ซุปกระดูกหมูตุ๋นยาจีนที่มีต้นกำเนิดจากชาวแต้จิ๋ว...',
  },
];

export const useCultureStore = create<CultureStoreState>((set, get) => ({
  hydrated: false,
  wordOfDay: null,
  articles: MOCK_ARTICLES,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ ...parsed, hydrated: true });

        // Check if word of day needs refresh
        const today = new Date().toISOString().split('T')[0];
        if (parsed.wordOfDay?.date !== today) {
          get().refreshWordOfDay();
        }
      } else {
        set({ hydrated: true });
        get().refreshWordOfDay();
      }
    } catch (e) {
      console.error('Failed to hydrate culture store:', e);
      set({ hydrated: true });
      get().refreshWordOfDay();
    }
  },

  refreshWordOfDay: async () => {
    const today = new Date().toISOString().split('T')[0];

    // Deterministic random based on date string so it's consistent all day
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
    const index = seed % MOCK_WORDS.length;
    const word = MOCK_WORDS[index];

    const wordOfDay: WordOfDay = { date: today, word };
    set({ wordOfDay });

    // Save state
    await saveState(get());
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
      content: {
        title,
        body,
        data: { screen: 'culture' },
      },
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
    const dataToSave = {
      wordOfDay: state.wordOfDay,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Failed to save culture store:', e);
  }
}
