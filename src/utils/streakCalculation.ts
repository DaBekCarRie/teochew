import * as Localization from 'expo-localization';
import type { UserStreak } from '../types/dictionary';

const MILESTONES = [7, 14, 30, 50, 100, 365] as const;

/** Returns today's date as YYYY-MM-DD in the device's local timezone. */
export function getTodayDate(): string {
  const tz = Localization.getCalendars()[0]?.timeZone ?? 'UTC';
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

/**
 * Returns the difference in calendar days: a - b (signed).
 * Both a and b must be YYYY-MM-DD strings.
 */
export function diffInDays(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const dateA = new Date(`${a}T00:00:00`);
  const dateB = new Date(`${b}T00:00:00`);
  return Math.round((dateA.getTime() - dateB.getTime()) / msPerDay);
}

/**
 * Given the current streak state and today's date, returns the updated streak.
 * Pure function — no side effects.
 */
export function checkAndUpdateStreak(streak: UserStreak, today: string): UserStreak {
  const { lastActivityDate } = streak;

  if (!lastActivityDate) {
    // First ever study session
    return {
      ...streak,
      currentStreak: 1,
      longestStreak: Math.max(1, streak.longestStreak),
      lastActivityDate: today,
      streakFrozen: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const diff = diffInDays(today, lastActivityDate);

  if (diff === 0) {
    // Already studied today — no change
    return streak;
  } else if (diff === 1) {
    // Consecutive day
    const newStreak = streak.currentStreak + 1;
    return {
      ...streak,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityDate: today,
      streakFrozen: false,
      updatedAt: new Date().toISOString(),
    };
  } else if (diff === 2 && streak.streakFrozen) {
    // Missed exactly 1 day but freeze was active — treat as consecutive
    const newStreak = streak.currentStreak + 1;
    return {
      ...streak,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityDate: today,
      streakFrozen: false,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Missed 2+ days (or 1 day without freeze) — reset
    return {
      ...streak,
      currentStreak: 1,
      lastActivityDate: today,
      streakFrozen: false,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Returns the milestone value if `streak` exactly hits one, otherwise null.
 */
export function getMilestone(streak: number): number | null {
  return MILESTONES.includes(streak as (typeof MILESTONES)[number]) ? streak : null;
}
