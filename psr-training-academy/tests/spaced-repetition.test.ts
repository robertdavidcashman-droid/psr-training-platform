import { describe, expect, it } from 'vitest';
import { updateReview } from '@/lib/spaced-repetition';

describe('spaced repetition', () => {
  it('incorrect resets interval to 1 and decreases ease factor', () => {
    const u = updateReview({ intervalDays: 10, easeFactor: 2.5 }, 0);
    expect(u.nextIntervalDays).toBe(1);
    expect(u.nextEaseFactor).toBeLessThan(2.5);
  });

  it('correct increases interval and gently increases ease factor', () => {
    const u = updateReview({ intervalDays: 2, easeFactor: 2.5 }, 1);
    expect(u.nextEaseFactor).toBeGreaterThan(2.5);
    expect(u.nextIntervalDays).toBeGreaterThanOrEqual(2);
  });
});
