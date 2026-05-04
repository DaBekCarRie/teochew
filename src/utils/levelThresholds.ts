export interface LevelDef {
  level: number;
  xpRequired: number; // total XP from zero to reach this level
  nameTh: string;
  nameTeochew: string;
  emoji: string;
}

export const LEVELS: LevelDef[] = [
  { level: 1, xpRequired: 0, nameTh: 'เริ่มต้น', nameTeochew: '開始', emoji: '🌱' },
  { level: 2, xpRequired: 100, nameTh: 'มือใหม่', nameTeochew: '新手', emoji: '🌿' },
  { level: 3, xpRequired: 300, nameTh: 'กำลังเรียน', nameTeochew: '學生', emoji: '📚' },
  { level: 4, xpRequired: 600, nameTh: 'เข้าใจแล้ว', nameTeochew: '明白', emoji: '💡' },
  { level: 5, xpRequired: 1000, nameTh: 'คล่องขึ้น', nameTeochew: '進步', emoji: '⭐' },
  { level: 6, xpRequired: 1500, nameTh: 'เก่งมาก', nameTeochew: '厲害', emoji: '🔥' },
  { level: 7, xpRequired: 2500, nameTh: 'ผู้เชี่ยวชาญ', nameTeochew: '專家', emoji: '💎' },
  { level: 8, xpRequired: 4000, nameTh: 'ปรมาจารย์', nameTeochew: '師傅', emoji: '👑' },
];

const MAX_LEVEL = LEVELS[LEVELS.length - 1]!.level;

/** Return the current LevelDef for a given total XP (clamps at max level). */
export function getLevelForXP(totalXP: number): LevelDef {
  let current = LEVELS[0]!;
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

/** Return next LevelDef, or null if at max level. */
export function getNextLevel(level: number): LevelDef | null {
  if (level >= MAX_LEVEL) return null;
  return LEVELS.find((l) => l.level === level + 1) ?? null;
}

/** XP accumulated above the current level threshold (resets at each level-up). */
export function getXPWithinLevel(totalXP: number): number {
  const current = getLevelForXP(totalXP);
  return totalXP - current.xpRequired;
}

/** XP gap from current level threshold to next level threshold. */
export function getXPToNextLevel(totalXP: number): number {
  const current = getLevelForXP(totalXP);
  const next = getNextLevel(current.level);
  if (!next) return 1; // at max level — avoid division by zero in progress bar
  return next.xpRequired - current.xpRequired;
}

/** 0.0–1.0 fill fraction for the XP progress bar. */
export function getLevelProgress(totalXP: number): number {
  const within = getXPWithinLevel(totalXP);
  const span = getXPToNextLevel(totalXP);
  return Math.min(within / span, 1);
}
