import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase/client';
import { MOCK_PHRASES } from '../data/mockPhrases';
import type { TeochewPhrase } from '../data/mockPhrases';
import type { WordEntry } from '../types/dictionary';
import * as Notifications from 'expo-notifications';
import {
  fetchCultureArticles,
  fetchWordOfDay as fetchWotDService,
} from '../services/supabase/culture';
import type { CultureArticleData } from '../services/supabase/culture';

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

export const useCultureStore = create<CultureStoreState>((set, get) => ({
  hydrated: false,
  wordOfDay: null,
  phraseOfDay: null,
  articles: [],

  hydrate: async () => {
    fetchCultureArticles().then((data) => {
      if (data && data.length > 0) {
        const mappedArticles = data.map((d) => ({
          ...d,
          related_words: [],
          vocab: [],
          read_minutes: 3,
        })) as CultureArticle[];
        set({ articles: mappedArticles });
      }
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
    try {
      const wotd = await fetchWotDService();
      if (wotd) {
        set({ wordOfDay: { date: wotd.date, word: wotd.word as any } });
        await saveState(get());
      } else {
        // Fallback to random if no explicit WOTD is set for today
        const today = new Date().toISOString().split('T')[0];
        const seed = today.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
        const { count } = await supabase
          .from('words')
          .select('*', { count: 'exact', head: true })
          .eq('verified', true)
          .not('teochew_char', 'is', null);
        const total = count ?? 0;
        if (total === 0) {
          set({ wordOfDay: null });
          return;
        }
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
