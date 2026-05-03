import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateMastery, computeAccuracy } from '../utils/calculateMastery';
import type { WordProgress, StudySession, SyncStatus, MasteryLevel } from '../types/dictionary';
import { useStreakStore, MIN_STREAK_SESSION_MS } from './streakStore';

const STORAGE_KEY_WORD = '@teochew/wordProgress';
const STORAGE_KEY_SESSIONS = '@teochew/studySessions';
const MIN_SESSION_MS = 5000; // BR-6: sessions < 5s don't count

// ── Persistence helpers ───────────────────────────────────────────────────────

async function loadWordProgress(): Promise<Record<string, WordProgress>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_WORD);
    return raw ? (JSON.parse(raw) as Record<string, WordProgress>) : {};
  } catch {
    return {};
  }
}

async function saveWordProgress(data: Record<string, WordProgress>) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_WORD, JSON.stringify(data));
  } catch {}
}

async function loadSessions(): Promise<StudySession[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_SESSIONS);
    return raw ? (JSON.parse(raw) as StudySession[]) : [];
  } catch {
    return [];
  }
}

async function saveSessions(data: StudySession[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(data));
  } catch {}
}

// ── Default factories ─────────────────────────────────────────────────────────

function defaultWordProgress(wordId: string): WordProgress {
  return {
    wordId,
    timesSeen: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    masteryLevel: 'new',
    lastSeenAt: new Date().toISOString(),
  };
}

// ── Weak word helper ──────────────────────────────────────────────────────────

export interface WeakWord {
  wordId: string;
  accuracy: number; // 0-100
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  masteryLevel: MasteryLevel;
}

// ── Store interface ───────────────────────────────────────────────────────────

interface ProgressStoreState {
  wordProgress: Record<string, WordProgress>;
  sessions: StudySession[];
  pendingSessionIds: string[]; // IDs of sessions not yet synced
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
  hydrated: boolean;

  // Lifecycle
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;

  // Recording
  recordFlashcardSeen: (wordId: string) => void;
  recordQuizAnswer: (wordId: string, isCorrect: boolean) => void;
  startSession: (lessonId: string | null, type: 'flashcard' | 'quiz') => string;
  endSession: (sessionId: string, opts?: { score?: number; wordsStudied?: number }) => void;

  // Queries
  getWordProgress: (wordId: string) => WordProgress;
  getWeakWords: (limit?: number) => WeakWord[];
  getMasteryBreakdown: () => Record<MasteryLevel, number>;
  getTotalStudyTimeMs: () => number;
  getTotalWordsLearned: () => number;
  getTotalWordsMastered: () => number;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useProgressStore = create<ProgressStoreState>((set, get) => ({
  wordProgress: {},
  sessions: [],
  pendingSessionIds: [],
  syncStatus: 'synced',
  lastSyncAt: null,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const [wordProgress, sessions] = await Promise.all([loadWordProgress(), loadSessions()]);
    set({ wordProgress, sessions, hydrated: true });
  },

  async reset() {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY_WORD),
      AsyncStorage.removeItem(STORAGE_KEY_SESSIONS),
    ]);
    set({
      wordProgress: {},
      sessions: [],
      pendingSessionIds: [],
      syncStatus: 'synced',
      lastSyncAt: null,
    });
  },

  // ── Recording ───────────────────────────────────────────────────────────────

  recordFlashcardSeen(wordId) {
    set((state) => {
      const prev = state.wordProgress[wordId] ?? defaultWordProgress(wordId);
      const next: WordProgress = {
        ...prev,
        timesSeen: prev.timesSeen + 1,
        lastSeenAt: new Date().toISOString(),
        masteryLevel: calculateMastery({
          timesSeen: prev.timesSeen + 1,
          timesCorrect: prev.timesCorrect,
          timesIncorrect: prev.timesIncorrect,
        }),
      };
      const updated = { ...state.wordProgress, [wordId]: next };
      saveWordProgress(updated);
      return { wordProgress: updated };
    });
  },

  recordQuizAnswer(wordId, isCorrect) {
    set((state) => {
      const prev = state.wordProgress[wordId] ?? defaultWordProgress(wordId);
      const timesCorrect = prev.timesCorrect + (isCorrect ? 1 : 0);
      const timesIncorrect = prev.timesIncorrect + (isCorrect ? 0 : 1);
      const next: WordProgress = {
        ...prev,
        timesSeen: Math.max(prev.timesSeen, 1), // quiz implies seen
        timesCorrect,
        timesIncorrect,
        lastSeenAt: new Date().toISOString(),
        masteryLevel: calculateMastery({
          timesSeen: Math.max(prev.timesSeen, 1),
          timesCorrect,
          timesIncorrect,
        }),
      };
      const updated = { ...state.wordProgress, [wordId]: next };
      saveWordProgress(updated);
      return { wordProgress: updated };
    });
  },

  startSession(lessonId, type) {
    const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const session: StudySession = {
      id,
      lessonId,
      activityType: type,
      startedAt: new Date().toISOString(),
      endedAt: null,
      durationMs: 0,
      wordsStudied: 0,
      score: null,
    };
    set((state) => {
      const updated = [...state.sessions, session];
      saveSessions(updated);
      return { sessions: updated };
    });
    return id;
  },

  endSession(sessionId, opts = {}) {
    set((state) => {
      const idx = state.sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return state;

      const session = state.sessions[idx];
      const endedAt = new Date().toISOString();
      const durationMs = new Date(endedAt).getTime() - new Date(session.startedAt).getTime();

      // BR-6: discard sessions shorter than 5 seconds
      if (durationMs < MIN_SESSION_MS) {
        const filtered = state.sessions.filter((s) => s.id !== sessionId);
        saveSessions(filtered);
        return { sessions: filtered };
      }

      const updated: StudySession = {
        ...session,
        endedAt,
        durationMs,
        score: opts.score ?? session.score,
        wordsStudied: opts.wordsStudied ?? session.wordsStudied,
      };
      const sessions = [...state.sessions];
      sessions[idx] = updated;
      saveSessions(sessions);

      // BR-1: sessions ≥30s count toward streak
      if (durationMs >= MIN_STREAK_SESSION_MS) {
        useStreakStore.getState().recordStudyDay();
      }

      return {
        sessions,
        pendingSessionIds: [...state.pendingSessionIds, sessionId],
        syncStatus: 'pending' as SyncStatus,
      };
    });
  },

  // ── Queries ─────────────────────────────────────────────────────────────────

  getWordProgress(wordId) {
    return get().wordProgress[wordId] ?? defaultWordProgress(wordId);
  },

  getWeakWords(limit = 20) {
    const { wordProgress } = get();
    return Object.values(wordProgress)
      .map((p) => {
        const accuracy = computeAccuracy(p);
        return { ...p, accuracy: accuracy ?? 0 };
      })
      .filter((p) => {
        // Only words attempted in quiz (timesCorrect + timesIncorrect > 0) and accuracy < 50
        const total = p.timesCorrect + p.timesIncorrect;
        return total > 0 && p.accuracy < 50;
      })
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit)
      .map((p) => ({
        wordId: p.wordId,
        accuracy: p.accuracy,
        timesSeen: p.timesSeen,
        timesCorrect: p.timesCorrect,
        timesIncorrect: p.timesIncorrect,
        masteryLevel: p.masteryLevel,
      }));
  },

  getMasteryBreakdown() {
    const breakdown: Record<MasteryLevel, number> = {
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
    };
    for (const p of Object.values(get().wordProgress)) {
      breakdown[p.masteryLevel] += 1;
    }
    return breakdown;
  },

  getTotalStudyTimeMs() {
    return get()
      .sessions.filter((s) => s.endedAt !== null)
      .reduce((sum, s) => sum + s.durationMs, 0);
  },

  getTotalWordsLearned() {
    return Object.values(get().wordProgress).filter((p) => p.masteryLevel !== 'new').length;
  },

  getTotalWordsMastered() {
    return Object.values(get().wordProgress).filter((p) => p.masteryLevel === 'mastered').length;
  },
}));
