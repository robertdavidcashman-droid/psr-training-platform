import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  attemptId: z.string().uuid(),
});

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { attemptId } = parsed.data;

  const { data: attempt, error: attemptErr } = await supabase
    .from('attempts')
    .select('id,user_id,started_at,completed_at')
    .eq('id', attemptId)
    .single();

  if (attemptErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.completed_at) {
    return NextResponse.json({ ok: true, alreadyCompleted: true }, { status: 200 });
  }

  const { data: items, error: itemsErr } = await supabase
    .from('attempt_items')
    .select('is_correct')
    .eq('attempt_id', attemptId);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  const total = items?.length ?? 0;
  const correct = (items ?? []).filter((i) => i.is_correct).length;
  const xp = correct * 10;

  const startedAt = new Date(attempt.started_at);
  const completedAt = new Date();
  const durationSeconds = Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000));

  const { error: updateErr } = await supabase
    .from('attempts')
    .update({
      completed_at: completedAt.toISOString(),
      score: correct,
      xp_earned: xp,
      duration_seconds: durationSeconds,
    })
    .eq('id', attemptId);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, total, correct, xp, durationSeconds });
}
