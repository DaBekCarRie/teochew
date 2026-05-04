import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import type { XPSource, EarnedBadge, RewardNotification } from '../types/dictionary';
import { XP_AMOUNTS } from '../utils/xpSources';
import { getLevelForXP, getNextLevel } from '../utils/levelThresholds';
import { checkBadgeConditions } from '../utils/badgeConditions';
import { useProgressStore } from './progressStore';
import { useStreakStore } from './streakStore';
import { useLessonStore } from './lessonStore';
import { LESSONS } from '../services/lessons';

const STORAGE_KEY_XP = '@teochew/xp';
const STORAGE_KEY_BADGES = '@teochew/earnedBadges';
const STORAGE_KEY_DAILY = '@teochew/lastDailyBonus';
const STORAGE_KEY_PERFECT = '@teochew/perfectQuizCount';

// ── Persistence helpers ───────────────────────────────────────────────────────

async function loadXP(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_XP);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

async function saveXP(xp: number) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_XP, String(xp));
  } catch {}
}

async function loadEarnedBadges(): Promise<EarnedBadge[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_BADGES);
    return raw ? (JSON.parse(raw) as EarnedBadge[]) : [];
  } catch {
    return [];
  }
}

async function saveEarnedBadges(badges: EarnedBadge[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
  } catch {}
}

async function loadLastDailyBonus(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY_DAILY);
  } catch {
    return null;
  }
}

async function saveLastDailyBonus(date: string) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_DAILY, date);
  } catch {}
}

async function loadPerfectQuizCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PERFECT);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

async function savePerfectQuizCount(count: number) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_PERFECT, String(count));
  } catch {}
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// ── Store interface ───────────────────────────────────────────────────────────

interface XPStoreState {
  totalXP: number;
  earnedBadges: EarnedBadge[];
  perfectQuizCount: number;
  lastDailyBonusDate: string | null;
  hydrated: boolean;
  /** Pending reward notifications — shown in order by RewardQueue */
  pendingNotifications: RewardNotification[];

  // Lifecycle
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;

  /**
   * Award XP for a given source. Automatically:
   * - Adds quiz bonus XP based on score
   * - Awards lesson_complete XP if both flashcard + quiz ≥ 60 done
   * - Awards daily_bonus if not yet claimed today
   * - Awards first_lesson if first lesson completed
   * - Checks level-up and queues LevelUpNotification
   * - Checks badge conditions and queues BadgeNotifications
   */
  awardXP: (
    source: XPSource,
    opts?: {
      lessonId?: string;
      quizScore?: number;
    },
  ) => void;

  /** Dismiss the first notification in the queue (call from modal onDismiss). */
  dismissNotification: () => void;

  /** Record a quiz perfect and persist. */
  recordPerfectQuiz: () => void;

  // Derived (computed synchronously from state)
  getLevel: () => number;
  getLevelDef: () => import('../utils/levelThresholds').LevelDef;
  getXPWithinCurrentLevel: () => number;
  getXPToNextLevel: () => number;
  getEarnedBadgeKeys: () => Set<string>;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useXPStore = create<XPStoreState>((set, get) => ({
  totalXP: 0,
  earnedBadges: [],
  perfectQuizCount: 0,
  lastDailyBonusDate: null,
  hydrated: false,
  pendingNotifications: [],

  async hydrate() {
    if (get().hydrated) return;
    const [totalXP, earnedBadges, lastDailyBonusDate, perfectQuizCount] = await Promise.all([
      loadXP(),
      loadEarnedBadges(),
      loadLastDailyBonus(),
      loadPerfectQuizCount(),
    ]);
    set({ totalXP, earnedBadges, lastDailyBonusDate, perfectQuizCount, hydrated: true });
  },

  async reset() {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY_XP),
      AsyncStorage.removeItem(STORAGE_KEY_BADGES),
      AsyncStorage.removeItem(STORAGE_KEY_DAILY),
      AsyncStorage.removeItem(STORAGE_KEY_PERFECT),
    ]);
    set({
      totalXP: 0,
      earnedBadges: [],
      perfectQuizCount: 0,
      lastDailyBonusDate: null,
      pendingNotifications: [],
    });
  },

  awardXP(source, opts = {}) {
    const { lessonId, quizScore } = opts;
    const state = get();
    const newNotifications: RewardNotification[] = [];
    let xpDelta = 0;

    // ── 1. Base XP ────────────────────────────────────────────────────────────
    const base = XP_AMOUNTS[source];
    xpDelta += base;
    newNotifications.push({ type: 'xp', amount: base, source, isBonus: false });

    // ── 2. Quiz bonuses ───────────────────────────────────────────────────────
    if (source === 'quiz_complete' && quizScore !== undefined) {
      if (quizScore === 100) {
        // Perfect: +5 (80% bonus) + +10 (perfect bonus) = +15 total bonus
        const bonus80 = XP_AMOUNTS.quiz_bonus_80;
        const bonusPerfect = XP_AMOUNTS.quiz_perfect;
        xpDelta += bonus80 + bonusPerfect;
        newNotifications.push({
          type: 'xp',
          amount: bonus80 + bonusPerfect,
          source: 'quiz_perfect',
          isBonus: true,
        });
        get().recordPerfectQuiz();
      } else if (quizScore >= 80) {
        const bonus = XP_AMOUNTS.quiz_bonus_80;
        xpDelta += bonus;
        newNotifications.push({
          type: 'xp',
          amount: bonus,
          source: 'quiz_bonus_80',
          isBonus: true,
        });
      }
    }

    // ── 3. Lesson complete bonus ──────────────────────────────────────────────
    if (source === 'quiz_complete' && lessonId && quizScore !== undefined && quizScore >= 60) {
      const lessonProgress = useLessonStore.getState().getProgress(lessonId);
      if (lessonProgress.flashcardDone) {
        const bonus = XP_AMOUNTS.lesson_complete;
        xpDelta += bonus;
        newNotifications.push({
          type: 'xp',
          amount: bonus,
          source: 'lesson_complete',
          isBonus: true,
        });
      }
    }

    // ── 4. First lesson one-time bonus ────────────────────────────────────────
    if (source === 'flashcard_complete' && lessonId) {
      const lessonIds = LESSONS.map((l) => l.id);
      const isFirstLesson = lessonIds[0] === lessonId;
      if (isFirstLesson && !state.earnedBadges.find((b) => b.condition_key === 'first_lesson')) {
        const bonus = XP_AMOUNTS.first_lesson;
        xpDelta += bonus;
        newNotifications.push({ type: 'xp', amount: bonus, source: 'first_lesson', isBonus: true });
      }
    }

    // ── 5. Daily bonus ────────────────────────────────────────────────────────
    const today = getTodayDate();
    let newLastDailyBonus = state.lastDailyBonusDate;
    if (state.lastDailyBonusDate !== today) {
      const dailyBonus = XP_AMOUNTS.daily_bonus;
      xpDelta += dailyBonus;
      newLastDailyBonus = today;
      newNotifications.push({
        type: 'xp',
        amount: dailyBonus,
        source: 'daily_bonus',
        isBonus: true,
      });
      saveLastDailyBonus(today);
    }

    // ── 6. Apply XP + check level up ─────────────────────────────────────────
    const prevXP = state.totalXP;
    const newXP = prevXP + xpDelta;
    const prevLevel = getLevelForXP(prevXP).level;
    const newLevel = getLevelForXP(newXP).level;

    if (newLevel > prevLevel) {
      newNotifications.push({ type: 'level_up', newLevel });
    }

    saveXP(newXP);

    // ── 7. Badge condition check ──────────────────────────────────────────────
    const progressState = useProgressStore.getState();
    const streakState = useStreakStore.getState();
    const lessonStoreState = useLessonStore.getState();
    const lessonIds = LESSONS.map((l) => l.id);
    const lessonsDone = lessonIds.filter((id) => {
      const p = lessonStoreState.getProgress(id);
      return (p.quizBestScore ?? -1) >= 60;
    }).length;
    const hasCompletedAnyQuiz =
      lessonsDone > 0 ||
      lessonIds.some((id) => lessonStoreState.getProgress(id).quizBestScore !== null);
    const newPerfectCount =
      source === 'quiz_complete' && quizScore === 100
        ? state.perfectQuizCount + 1
        : state.perfectQuizCount;

    const newBadgeKeys = checkBadgeConditions({
      lessonsDone,
      totalLessons: LESSONS.length,
      perfectQuizCount: newPerfectCount,
      hasCompletedAnyQuiz,
      currentStreak: streakState.streak.currentStreak,
      wordsMastered: progressState.getTotalWordsMastered(),
      earnedBadgeKeys: new Set(state.earnedBadges.map((b) => b.condition_key)),
    });

    const newEarnedBadges: EarnedBadge[] = [
      ...state.earnedBadges,
      ...newBadgeKeys.map((key) => ({ condition_key: key, earned_at: new Date().toISOString() })),
    ];

    if (newBadgeKeys.length > 0) {
      saveEarnedBadges(newEarnedBadges);
      newBadgeKeys.forEach((key) => {
        newNotifications.push({ type: 'badge', conditionKey: key });
      });
    }

    // ── 8. Commit state ───────────────────────────────────────────────────────
    set((prev) => ({
      totalXP: newXP,
      earnedBadges: newEarnedBadges,
      lastDailyBonusDate: newLastDailyBonus,
      pendingNotifications: [...prev.pendingNotifications, ...newNotifications],
    }));

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },

  dismissNotification() {
    set((state) => ({
      pendingNotifications: state.pendingNotifications.slice(1),
    }));
  },

  recordPerfectQuiz() {
    set((state) => {
      const next = state.perfectQuizCount + 1;
      savePerfectQuizCount(next);
      return { perfectQuizCount: next };
    });
  },

  // ── Derived ──────────────────────────────────────────────────────────────────

  getLevel() {
    return getLevelForXP(get().totalXP).level;
  },

  getLevelDef() {
    return getLevelForXP(get().totalXP);
  },

  getXPWithinCurrentLevel() {
    const { totalXP } = get();
    const current = getLevelForXP(totalXP);
    return totalXP - current.xpRequired;
  },

  getXPToNextLevel() {
    const { totalXP } = get();
    const current = getLevelForXP(totalXP);
    const next = getNextLevel(current.level);
    if (!next) return 1;
    return next.xpRequired - current.xpRequired;
  },

  getEarnedBadgeKeys() {
    return new Set(get().earnedBadges.map((b) => b.condition_key));
  },
}));
