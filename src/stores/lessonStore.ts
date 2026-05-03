import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LessonProgress } from '../types/dictionary';

const STORAGE_KEY = '@teochew/lessonProgress';

async function loadFromStorage(): Promise<Record<string, LessonProgress>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, LessonProgress>;
  } catch {
    return {};
  }
}

async function saveToStorage(data: Record<string, LessonProgress>) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

interface LessonStoreState {
  progress: Record<string, LessonProgress>; // keyed by lessonId
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setFlashcardDone: (lessonId: string) => void;
  setQuizScore: (lessonId: string, score: number) => void;
  getProgress: (lessonId: string) => LessonProgress;
  isUnlocked: (lessonId: string, allIds: string[]) => boolean;
  reset: () => void;
}

const defaultProgress = (lessonId: string): LessonProgress => ({
  lessonId,
  flashcardDone: false,
  quizBestScore: null,
  completedAt: null,
});

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  progress: {},
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const progress = await loadFromStorage();
    set({ progress, hydrated: true });
  },

  getProgress(lessonId) {
    return get().progress[lessonId] ?? defaultProgress(lessonId);
  },

  setFlashcardDone(lessonId) {
    set((state) => {
      const prev = state.progress[lessonId] ?? defaultProgress(lessonId);
      const next = { ...prev, flashcardDone: true };
      const updated = { ...state.progress, [lessonId]: next };
      saveToStorage(updated);
      return { progress: updated };
    });
  },

  setQuizScore(lessonId, score) {
    set((state) => {
      const prev = state.progress[lessonId] ?? defaultProgress(lessonId);
      const prevBest = prev.quizBestScore ?? -1;
      const newBest = Math.max(prevBest, score);
      const isComplete = newBest >= 60;
      const next: LessonProgress = {
        ...prev,
        quizBestScore: newBest,
        completedAt: isComplete && !prev.completedAt ? new Date().toISOString() : prev.completedAt,
      };
      const updated = { ...state.progress, [lessonId]: next };
      saveToStorage(updated);
      return { progress: updated };
    });
  },

  // Lesson N is unlocked if: it's the first lesson, OR the previous lesson's quiz >= 60
  isUnlocked(lessonId, allIds) {
    const idx = allIds.indexOf(lessonId);
    if (idx <= 0) return true;
    const prevId = allIds[idx - 1];
    const prevProgress = get().progress[prevId];
    return (prevProgress?.quizBestScore ?? -1) >= 60;
  },

  reset() {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    set({ progress: {} });
  },
}));
