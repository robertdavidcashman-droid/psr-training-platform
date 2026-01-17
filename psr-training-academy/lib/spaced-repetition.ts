export type ReviewGrade = 0 | 1; // 1 = correct, 0 = incorrect (simple variant)

export interface ReviewState {
  intervalDays: number;
  easeFactor: number;
}

export interface ReviewUpdate {
  nextIntervalDays: number;
  nextEaseFactor: number;
}

/**
 * Simplified SM-2 inspired update.
 * - Correct: increase interval, gently increase ease
 * - Incorrect: reset interval, decrease ease
 */
export function updateReview(state: ReviewState, grade: ReviewGrade): ReviewUpdate {
  const easeMin = 1.3;
  const easeMax = 3.0;

  if (grade === 0) {
    return {
      nextIntervalDays: 1,
      nextEaseFactor: Math.max(easeMin, state.easeFactor - 0.2),
    };
  }

  const nextEaseFactor = Math.min(easeMax, state.easeFactor + 0.05);
  const nextIntervalDays = state.intervalDays <= 1 ? 2 : Math.round(state.intervalDays * nextEaseFactor);

  return { nextIntervalDays, nextEaseFactor };
}
