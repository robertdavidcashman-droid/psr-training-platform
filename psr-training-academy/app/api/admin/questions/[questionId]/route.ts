import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const patchSchema = z.object({
  type: z.enum(['mcq', 'sba', 'truefalse', 'short', 'scenario']).optional(),
  prompt: z.string().min(5).max(8000).optional(),
  explanation: z.string().max(20000).nullable().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  await requireAdmin();
  const supabase = await createClient();
  const { questionId } = await params;

  const { data: q, error: qErr } = await supabase
    .from('questions')
    .select('id,type,prompt,explanation,difficulty,status,created_at,updated_at')
    .eq('id', questionId)
    .single();
  if (qErr || !q) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: options } = await supabase
    .from('question_options')
    .select('id,label,text,is_correct')
    .eq('question_id', questionId)
    .order('id', { ascending: true });

  const { data: tags } = await supabase
    .from('question_tags')
    .select('topic_id,competency_id')
    .eq('question_id', questionId);

  return NextResponse.json({ question: q, options: options ?? [], tags: tags ?? [] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { questionId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(parsed.data) as Array<keyof typeof parsed.data>) {
    const val = parsed.data[key];
    if (val !== undefined) patch[key] = val;
  }

  const { error } = await supabase.from('questions').update(patch).eq('id', questionId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update',
    entity: 'questions',
    entityId: questionId,
    metadata: patch,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { questionId } = await params;

  const { error } = await supabase.from('questions').delete().eq('id', questionId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, { action: 'delete', entity: 'questions', entityId: questionId });
  return NextResponse.json({ ok: true });
}
