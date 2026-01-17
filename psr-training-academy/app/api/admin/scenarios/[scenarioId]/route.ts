import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const patchSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  brief: z.string().max(5000).nullable().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ scenarioId: string }> }) {
  await requireAdmin();
  const supabase = await createClient();
  const { scenarioId } = await params;

  const { data: s, error: sErr } = await supabase
    .from('scenarios')
    .select('id,title,brief,difficulty,status,created_at,updated_at')
    .eq('id', scenarioId)
    .single();
  if (sErr || !s) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: steps } = await supabase
    .from('scenario_steps')
    .select('id,step_order,content,step_type,payload')
    .eq('scenario_id', scenarioId)
    .order('step_order', { ascending: true });

  return NextResponse.json({ scenario: s, steps: steps ?? [] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ scenarioId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { scenarioId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(parsed.data) as Array<keyof typeof parsed.data>) {
    const val = parsed.data[key];
    if (val !== undefined) patch[key] = val;
  }

  const { error } = await supabase.from('scenarios').update(patch).eq('id', scenarioId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update',
    entity: 'scenarios',
    entityId: scenarioId,
    metadata: patch,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ scenarioId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { scenarioId } = await params;

  const { error } = await supabase.from('scenarios').delete().eq('id', scenarioId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, { action: 'delete', entity: 'scenarios', entityId: scenarioId });
  return NextResponse.json({ ok: true });
}
