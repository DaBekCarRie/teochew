import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryEntry, TranslationResult } from '../types/translation';

const STORAGE_KEY = '@teochew/translation_history';
const MAX_ENTRIES = 100;

interface TranslationStoreState {
  history: HistoryEntry[];
  hydrated: boolean;
  pendingResult: TranslationResult | null;

  hydrate: () => Promise<void>;
  addEntry: (entry: HistoryEntry) => Promise<void>;
  clearHistory: () => Promise<void>;
  setPendingResult: (result: TranslationResult | null) => void;
}

async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

async function saveHistory(data: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export const useTranslationStore = create<TranslationStoreState>((set, get) => ({
  history: [],
  hydrated: false,
  pendingResult: null,

  hydrate: async () => {
    if (get().hydrated) return;
    const history = await loadHistory();
    set({ history, hydrated: true });
  },

  addEntry: async (entry) => {
    const updated = [entry, ...get().history];
    if (updated.length > MAX_ENTRIES) updated.splice(MAX_ENTRIES);
    set({ history: updated });
    await saveHistory(updated);
  },

  clearHistory: async () => {
    set({ history: [] });
    await saveHistory([]);
  },

  setPendingResult: (result) => set({ pendingResult: result }),
}));
