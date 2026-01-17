import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { updateReview } from '@/lib/spaced-repetition';

const schema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedOptionIds: z.array(z.number()).default([]),
  timeSpentSeconds: z.number().int().min(0).optional(),
});

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { attemptId, questionId, selectedOptionIds, timeSpentSeconds } = parsed.data;

  // Ensure the attempt belongs to the current user
  const { data: attempt, error: attemptErr } = await supabase
    .from('attempts')
    .select('id,user_id,quiz_id,completed_at')
    .eq('id', attemptId)
    .single();

  if (attemptErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.completed_at) return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });

  // Ensure the question is part of the quiz.
  if (attempt.quiz_id) {
    const { data: qi } = await supabase
      .from('quiz_items')
      .select('question_id')
      .eq('quiz_id', attempt.quiz_id)
      .eq('question_id', questionId)
      .maybeSingle();
    if (!qi) return NextResponse.json({ error: 'Question not in quiz' }, { status: 400 });
  }

  // Prevent duplicates if user retries.
  const { data: existing } = await supabase
    .from('attempt_items')
    .select('id')
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: 'Already answered' }, { status: 409 });

  const { data: options, error: optErr } = await supabase
    .from('question_options')
    .select('id,is_correct')
    .eq('question_id', questionId);

  if (optErr) return NextResponse.json({ error: optErr.message }, { status: 500 });

  const correctIds = (options ?? []).filter((o) => o.is_correct).map((o) => o.id);
  const isCorrect = sameSet(selectedOptionIds, correctIds);

  const { error: insertErr } = await supabase.from('attempt_items').insert({
    attempt_id: attemptId,
    question_id: questionId,
    selected_option_ids: selectedOptionIds,
    is_correct: isCorrect,
    time_spent_seconds: timeSpentSeconds ?? null,
  });
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  // Update review queue
  const now = new Date();
  const { data: rq } = await supabase
    .from('review_queue')
    .select('interval_days,ease_factor')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .maybeSingle();

  const intervalDays = rq?.interval_days ?? 1;
  const easeFactor = rq?.ease_factor ?? 2.5;
  const update = updateReview({ intervalDays, easeFactor }, isCorrect ? 1 : 0);
  const nextDue = new Date(now.getTime() + update.nextIntervalDays * 24 * 60 * 60 * 1000);

  await supabase.from('review_queue').upsert({
    user_id: user.id,
    question_id: questionId,
    next_due_at: nextDue.toISOString(),
    interval_days: update.nextIntervalDays,
    ease_factor: update.nextEaseFactor,
    last_result: isCorrect ? 'correct' : 'incorrect',
  });

  return NextResponse.json({ isCorrect });
}
