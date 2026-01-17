import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  attemptId: z.string().uuid(),
  notes: z.string().max(4000).optional(),
});

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { attemptId, notes } = parsed.data;

  const { data: attempt, error: aErr } = await supabase
    .from('scenario_attempts')
    .select('id,user_id,completed_at')
    .eq('id', attemptId)
    .single();
  if (aErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.completed_at) return NextResponse.json({ ok: true, alreadyCompleted: true }, { status: 200 });

  // Scoring is optional and can be added later once decision steps include answer keys.
  const completedAt = new Date().toISOString();
  const { error: updErr } = await supabase
    .from('scenario_attempts')
    .update({ completed_at: completedAt, notes: notes ?? null })
    .eq('id', attemptId);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
