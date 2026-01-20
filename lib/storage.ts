"use client";

// Local storage keys
const STORAGE_KEYS = {
  PROGRESS: "psr_progress",
  STREAK: "psr_streak",
  XP: "psr_xp",
  LAST_ACTIVITY: "psr_last_activity",
  PORTFOLIO_DRAFTS: "psr_portfolio_drafts",
  PRACTICE_HISTORY: "psr_practice_history",
} as const;

export interface TopicProgress {
  topicId: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastPracticed: string;
  mastery: number;
}

export interface UserProgress {
  topics: Record<string, TopicProgress>;
  totalXp: number;
  currentStreak: number;
  lastActivityDate: string;
  level: number;
}

export interface PortfolioDraft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sections: Record<string, string>;
}

export interface PracticeSession {
  id: string;
  date: string;
  mode: "quick" | "standard" | "long" | "mock";
  questionsAnswered: number;
  correctAnswers: number;
  topics: string[];
  duration: number;
}

// Safe localStorage access
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("Failed to save to localStorage");
  }
}

// Progress functions
export function getProgress(): UserProgress {
  return getStorage<UserProgress>(STORAGE_KEYS.PROGRESS, {
    topics: {},
    totalXp: 0,
    currentStreak: 0,
    lastActivityDate: "",
    level: 1,
  });
}

export function saveProgress(progress: UserProgress): void {
  setStorage(STORAGE_KEYS.PROGRESS, progress);
}

export function updateTopicProgress(
  topicId: string,
  correct: boolean
): UserProgress {
  const progress = getProgress();
  const today = new Date().toISOString().split("T")[0];

  if (!progress.topics[topicId]) {
    progress.topics[topicId] = {
      topicId,
      questionsAnswered: 0,
      correctAnswers: 0,
      lastPracticed: today,
      mastery: 0,
    };
  }

  const topic = progress.topics[topicId];
  topic.questionsAnswered++;
  if (correct) topic.correctAnswers++;
  topic.lastPracticed = today;
  topic.mastery = Math.round((topic.correctAnswers / topic.questionsAnswered) * 100);

  // Update XP
  progress.totalXp += correct ? 10 : 2;

  // Update streak
  if (progress.lastActivityDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (progress.lastActivityDate === yesterdayStr) {
      progress.currentStreak++;
    } else if (progress.lastActivityDate !== today) {
      progress.currentStreak = 1;
    }
    progress.lastActivityDate = today;
  }

  // Update level (every 500 XP)
  progress.level = Math.floor(progress.totalXp / 500) + 1;

  saveProgress(progress);
  return progress;
}

// Portfolio functions
export function getPortfolioDrafts(): PortfolioDraft[] {
  return getStorage<PortfolioDraft[]>(STORAGE_KEYS.PORTFOLIO_DRAFTS, []);
}

export function savePortfolioDraft(draft: PortfolioDraft): void {
  const drafts = getPortfolioDrafts();
  const existingIndex = drafts.findIndex((d) => d.id === draft.id);
  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }
  setStorage(STORAGE_KEYS.PORTFOLIO_DRAFTS, drafts);
}

export function deletePortfolioDraft(id: string): void {
  const drafts = getPortfolioDrafts().filter((d) => d.id !== id);
  setStorage(STORAGE_KEYS.PORTFOLIO_DRAFTS, drafts);
}

// Practice history functions
export function getPracticeHistory(): PracticeSession[] {
  return getStorage<PracticeSession[]>(STORAGE_KEYS.PRACTICE_HISTORY, []);
}

export function savePracticeSession(session: PracticeSession): void {
  const history = getPracticeHistory();
  history.unshift(session);
  // Keep only last 50 sessions
  setStorage(STORAGE_KEYS.PRACTICE_HISTORY, history.slice(0, 50));
}

// Calculate overall mastery
export function calculateOverallMastery(): number {
  const progress = getProgress();
  const topics = Object.values(progress.topics);
  if (topics.length === 0) return 0;
  const total = topics.reduce((sum, t) => sum + t.mastery, 0);
  return Math.round(total / topics.length);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
