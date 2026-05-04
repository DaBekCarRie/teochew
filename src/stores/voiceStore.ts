import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VoiceHistoryEntry, TranscribeResponse } from '../types/voice';

const STORAGE_KEY = '@teochew/voice_history';
const MAX_ENTRIES = 50;

interface VoiceStoreState {
  history: VoiceHistoryEntry[];
  hydrated: boolean;
  pendingResult: TranscribeResponse | null;

  hydrate: () => Promise<void>;
  addEntry: (entry: VoiceHistoryEntry) => Promise<void>;
  clearHistory: () => Promise<void>;
  setPendingResult: (result: TranscribeResponse | null) => void;
}

async function loadHistory(): Promise<VoiceHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VoiceHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

async function saveHistory(data: VoiceHistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export const useVoiceStore = create<VoiceStoreState>((set, get) => ({
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
