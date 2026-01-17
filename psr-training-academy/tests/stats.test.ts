import { describe, expect, it } from 'vitest';
import { computeCurrentStreak } from '@/lib/stats';

describe('stats', () => {
  it('computeCurrentStreak returns 0 with no completions', () => {
    expect(computeCurrentStreak([])).toBe(0);
  });

  it('computeCurrentStreak returns 0 if there is no completion today', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(computeCurrentStreak([yesterday])).toBe(0);
  });

  it('computeCurrentStreak counts consecutive days ending today (UTC)', () => {
    const now = new Date();
    const today = now.toISOString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(computeCurrentStreak([today, yesterday, twoDaysAgo])).toBe(3);
  });

  it('computeCurrentStreak ignores nulls and invalid dates', () => {
    const now = new Date().toISOString();
    expect(computeCurrentStreak([null, 'not-a-date', now])).toBe(1);
  });
});
