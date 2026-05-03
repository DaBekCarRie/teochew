export interface WordEntry {
  id: string;
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
  mandarin_char?: string;
  mandarin_pinyin?: string;
  category?: string;
  verified: boolean;
  teochew_audio?: string | null;
}

export interface UsageExample {
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
}

export interface WordDetail extends WordEntry {
  notes?: string; // e.g. tone notes, cultural context
  usage_examples: UsageExample[];
}

// --- Flashcard types ---

export interface FlashcardItem {
  word: WordEntry;
  status: 'unseen' | 'known' | 'unknown';
}

export interface FlashcardResult {
  wordId: string;
  status: 'known' | 'unknown';
  timeSpent: number; // milliseconds
}

// --- Quiz types ---

export type QuestionType = 'teochew_to_thai' | 'thai_to_teochew';

export interface QuizChoice {
  wordId: string;
  label: string; // thai_meaning or teochew_char
  sublabel?: string; // teochew_pengim (thai_to_teochew only)
  isCorrect: boolean;
}

export interface QuizQuestion {
  word: WordEntry;
  choices: QuizChoice[];
  questionType: QuestionType;
}

export interface QuizAnswer {
  wordId: string;
  selectedChoiceId: string;
  correctChoiceId: string;
  isCorrect: boolean;
  timeSpent: number; // ms
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number; // 0-100
  answers: QuizAnswer[];
  totalTimeSpent: number; // ms
}

// --- Lesson types ---

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  sort_order: number;
  word_ids: string[];
}

export type LessonState = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  flashcardDone: boolean;
  quizBestScore: number | null; // 0-100, null = never attempted
  completedAt: string | null; // ISO 8601
}

// --- Progress types ---

export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface WordProgress {
  wordId: string;
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  masteryLevel: MasteryLevel;
  lastSeenAt: string; // ISO 8601
}

export interface StudySession {
  id: string;
  lessonId: string | null;
  activityType: 'flashcard' | 'quiz';
  startedAt: string; // ISO 8601
  endedAt: string | null;
  durationMs: number;
  wordsStudied: number;
  score: number | null; // quiz score, null for flashcard
}

export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';

// --- Streak types ---

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // YYYY-MM-DD in device timezone
  streakFrozen: boolean;
  freezeCount: number;
  lastFreezeUsedDate: string | null; // YYYY-MM-DD — for 1/week limit (BR-4)
  updatedAt: string; // ISO 8601
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // "HH:mm"
  days: number[]; // 0=Sun … 6=Sat
}

// --- Bookmark types ---

export interface BookmarkItem {
  id: string; // word_id
  teochew_char: string;
  teochew_pengim: string;
  thai_meaning: string;
  english_meaning: string;
  category?: string;
  bookmarked_at: string; // ISO 8601
}
