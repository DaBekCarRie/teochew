import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningIntent } from '../types/dictionary';

export type AppLanguage = 'th' | 'en' | 'zh';
export type PlaybackSpeed = '0.75' | '1.0' | '1.25' | '1.5';
export type { LearningIntent };

export interface UserProfile {
  avatarUrl: string | null;
  displayName: string;
  email: string;
}

export interface RecentActivity {
  id: string;
  module: 'dictionary' | 'translation' | 'voice' | 'learning';
  label: string;
  timestamp: string;
}

export interface UserStoreState {
  hydrated: boolean;
  user: UserProfile;
  language: AppLanguage;
  playbackSpeed: PlaybackSpeed;
  notifEnabled: boolean;
  notifTime: string;
  recentActivity: RecentActivity[];
  learningIntent: LearningIntent;

  hydrate: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  setPlaybackSpeed: (speed: PlaybackSpeed) => Promise<void>;
  setNotifEnabled: (enabled: boolean) => Promise<void>;
  setNotifTime: (time: string) => Promise<void>;
  setLearningIntent: (intent: LearningIntent) => Promise<void>;
  addActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => Promise<void>;
  clearCache: () => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = '@teochew_user_store';

export const useUserStore = create<UserStoreState>((set, get) => ({
  hydrated: false,
  user: {
    avatarUrl: null,
    displayName: '',
    email: '',
  },
  language: 'th',
  playbackSpeed: '1.0',
  notifEnabled: true,
  notifTime: '08:00',
  recentActivity: [],
  learningIntent: 'general',

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ ...parsed, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch (e) {
      console.error('Failed to hydrate user store:', e);
      set({ hydrated: true });
    }
  },

  updateUser: async (updates) => {
    const updatedUser = { ...get().user, ...updates };
    set({ user: updatedUser });
    await saveState(get());
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    await saveState(get());
  },

  setPlaybackSpeed: async (speed) => {
    set({ playbackSpeed: speed });
    await saveState(get());
  },

  setNotifEnabled: async (enabled) => {
    set({ notifEnabled: enabled });
    await saveState(get());
  },

  setNotifTime: async (time) => {
    set({ notifTime: time });
    await saveState(get());
  },

  setLearningIntent: async (intent) => {
    set({ learningIntent: intent });
    await saveState(get());
  },

  addActivity: async (activity) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Keep only the last 20 activities
    const current = get().recentActivity;
    const updated = [newActivity, ...current].slice(0, 20);

    set({ recentActivity: updated });
    await saveState(get());
  },

  clearCache: async () => {
    // We only clear specific caches, not the preferences or auth state.
    await AsyncStorage.removeItem('@teochew_dict_cache');
    await AsyncStorage.removeItem('@teochew_wotd_cache');
    await AsyncStorage.removeItem('@teochew_culture_cache');
    // We don't remove translation or voice history as per S5-3 specs.
  },

  logout: async () => {
    // Clear everything
    await AsyncStorage.clear();
    set({
      user: { avatarUrl: null, displayName: '', email: '' },
      recentActivity: [],
    });
  },
}));

async function saveState(state: UserStoreState) {
  try {
    const dataToSave = {
      user: state.user,
      language: state.language,
      playbackSpeed: state.playbackSpeed,
      notifEnabled: state.notifEnabled,
      notifTime: state.notifTime,
      recentActivity: state.recentActivity,
      learningIntent: state.learningIntent,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Failed to save user store:', e);
  }
}
