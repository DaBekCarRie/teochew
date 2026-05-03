import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import type { UserStreak, ReminderSettings } from '../types/dictionary';
import {
  getTodayDate,
  checkAndUpdateStreak,
  getMilestone,
  diffInDays,
} from '../utils/streakCalculation';
import { pickTemplate } from '../utils/notificationTemplates';

const STORAGE_KEY_STREAK = '@teochew/streak';
const STORAGE_KEY_REMINDER = '@teochew/reminderSettings';

const MIN_STREAK_SESSION_MS = 30000; // BR-1: session must be ≥30s to count for streak

export { MIN_STREAK_SESSION_MS };

// ── Default factories ─────────────────────────────────────────────────────────

const DEFAULT_STREAK: UserStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  streakFrozen: false,
  freezeCount: 2, // BR-3: new users start with 2 free freezes
  lastFreezeUsedDate: null,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_REMINDER: ReminderSettings = {
  enabled: false,
  time: '20:00',
  days: [0, 1, 2, 3, 4, 5, 6], // all days
};

// ── Persistence helpers ───────────────────────────────────────────────────────

async function loadStreak(): Promise<UserStreak> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_STREAK);
    return raw ? (JSON.parse(raw) as UserStreak) : { ...DEFAULT_STREAK };
  } catch {
    return { ...DEFAULT_STREAK };
  }
}

async function saveStreak(streak: UserStreak) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak));
  } catch {}
}

async function loadReminder(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_REMINDER);
    return raw ? (JSON.parse(raw) as ReminderSettings) : { ...DEFAULT_REMINDER };
  } catch {
    return { ...DEFAULT_REMINDER };
  }
}

async function saveReminder(settings: ReminderSettings) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(settings));
  } catch {}
}

// ── Store interface ───────────────────────────────────────────────────────────

interface StreakStoreState {
  streak: UserStreak;
  reminderSettings: ReminderSettings;
  pendingMilestone: number | null; // triggers celebration modal
  hydrated: boolean;

  // Lifecycle
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;

  // Streak actions
  recordStudyDay: () => void;
  useFreeze: () => 'ok' | 'no_freezes' | 'limit_reached';
  clearMilestone: () => void;

  // Notification actions
  updateReminderSettings: (partial: Partial<ReminderSettings>) => Promise<void>;
  scheduleNotification: () => Promise<void>;
  cancelNotification: () => Promise<void>;

  // Derived
  getHasStudiedToday: () => boolean;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStreakStore = create<StreakStoreState>((set, get) => ({
  streak: { ...DEFAULT_STREAK },
  reminderSettings: { ...DEFAULT_REMINDER },
  pendingMilestone: null,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const [streak, reminderSettings] = await Promise.all([loadStreak(), loadReminder()]);
    set({ streak, reminderSettings, hydrated: true });
  },

  async reset() {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY_STREAK),
      AsyncStorage.removeItem(STORAGE_KEY_REMINDER),
    ]);
    set({
      streak: { ...DEFAULT_STREAK },
      reminderSettings: { ...DEFAULT_REMINDER },
      pendingMilestone: null,
    });
  },

  recordStudyDay() {
    const today = getTodayDate();
    set((state) => {
      const updated = checkAndUpdateStreak(state.streak, today);

      // Only trigger milestone if streak actually changed
      let pendingMilestone = state.pendingMilestone;
      if (updated.currentStreak !== state.streak.currentStreak) {
        const milestone = getMilestone(updated.currentStreak);
        if (milestone !== null) {
          // Add +1 freeze as bonus (BR-5)
          updated.freezeCount = updated.freezeCount + 1;
          pendingMilestone = milestone;
        }
      }

      saveStreak(updated);
      return { streak: updated, pendingMilestone };
    });
  },

  useFreeze() {
    const today = getTodayDate();
    const { streak } = get();

    if (streak.freezeCount <= 0) return 'no_freezes';

    // BR-4: limit to 1 freeze per week
    if (streak.lastFreezeUsedDate) {
      const daysSinceFreeze = diffInDays(today, streak.lastFreezeUsedDate);
      if (daysSinceFreeze < 7) return 'limit_reached';
    }

    set((state) => {
      const updated: UserStreak = {
        ...state.streak,
        streakFrozen: true,
        freezeCount: state.streak.freezeCount - 1,
        lastFreezeUsedDate: today,
        updatedAt: new Date().toISOString(),
      };
      saveStreak(updated);
      return { streak: updated };
    });
    return 'ok';
  },

  clearMilestone() {
    set({ pendingMilestone: null });
  },

  async updateReminderSettings(partial) {
    const updated = { ...get().reminderSettings, ...partial };
    await saveReminder(updated);
    set({ reminderSettings: updated });
    // Reschedule notifications whenever settings change
    await get().scheduleNotification();
  },

  async scheduleNotification() {
    const { reminderSettings, streak } = get();

    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!reminderSettings.enabled) return;

    // Request permission (required on iOS — BR-7)
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    const [hourStr, minuteStr] = reminderSettings.time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const { title, body } = pickTemplate(streak.currentStreak);

    // Schedule one notification per selected day of week
    for (const day of reminderSettings.days) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { screen: 'learn' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day + 1, // expo-notifications: 1=Sun, 2=Mon, … 7=Sat
          hour,
          minute,
        },
      });
    }
  },

  async cancelNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  getHasStudiedToday() {
    const { streak } = get();
    if (!streak.lastActivityDate) return false;
    return streak.lastActivityDate === getTodayDate();
  },
}));
