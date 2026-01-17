import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  scenarioId: z.string().uuid(),
  attemptId: z.string().uuid(),
});

export async function GET(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const url = new URL(request.url);
  const parsed = schema.safeParse({
    scenarioId: url.searchParams.get('scenarioId'),
    attemptId: url.searchParams.get('attemptId'),
  });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });

  const { scenarioId, attemptId } = parsed.data;

  const { data: attempt, error: aErr } = await supabase
    .from('scenario_attempts')
    .select('id,user_id,scenario_id,started_at,completed_at,score,notes,responses')
    .eq('id', attemptId)
    .single();
  if (aErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.scenario_id !== scenarioId)
    return NextResponse.json({ error: 'Attempt/scenario mismatch' }, { status: 400 });

  const { data: scenario, error: sErr } = await supabase
    .from('scenarios')
    .select('id,title,brief,difficulty,status')
    .eq('id', scenarioId)
    .single();
  if (sErr || !scenario) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  if (scenario.status !== 'published')
    return NextResponse.json({ error: 'Scenario not available' }, { status: 400 });

  const { data: steps, error: stepsErr } = await supabase
    .from('scenario_steps')
    .select('id,step_order,content,step_type,payload')
    .eq('scenario_id', scenarioId)
    .order('step_order', { ascending: true });
  if (stepsErr) return NextResponse.json({ error: stepsErr.message }, { status: 500 });

  return NextResponse.json({
    scenario,
    attempt: {
      id: attempt.id,
      startedAt: attempt.started_at,
      completedAt: attempt.completed_at,
      score: attempt.score,
      notes: attempt.notes,
      responses: attempt.responses ?? [],
    },
    steps: steps ?? [],
  });
}
