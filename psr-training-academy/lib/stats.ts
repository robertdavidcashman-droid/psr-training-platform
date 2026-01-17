export function toDayKey(d: Date) {
  // UTC day key to avoid timezone edge cases in server environments.
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Current streak: number of consecutive UTC days ending today where there is at least one completion.
 * Input can be any date-like values; duplicates are ignored.
 */
export function computeCurrentStreak(completedAt: Array<string | Date | null | undefined>) {
  const days = new Set<string>();
  for (const v of completedAt) {
    if (!v) continue;
    const d = typeof v === 'string' ? new Date(v) : v;
    if (Number.isNaN(d.getTime())) continue;
    days.add(toDayKey(d));
  }

  const todayKey = toDayKey(new Date());
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = toDayKey(cursor);
    if (!days.has(key)) break;
    streak += 1;
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    // Safety stop for pathological inputs.
    if (streak > 3650) break;
  }

  // If today has no completion, streak is 0.
  if (!days.has(todayKey)) return 0;
  return streak;
}
