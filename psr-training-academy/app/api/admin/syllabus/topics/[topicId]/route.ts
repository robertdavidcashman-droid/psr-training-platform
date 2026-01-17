import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const patchSchema = z.object({
  code: z.string().min(3).max(50).optional(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { topicId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (parsed.data.code !== undefined) patch.code = parsed.data.code;
  if (parsed.data.title !== undefined) patch.title = parsed.data.title;
  if (parsed.data.description !== undefined) patch.description = parsed.data.description;
  if (parsed.data.parentId !== undefined) patch.parent_id = parsed.data.parentId;

  const { error } = await supabase.from('syllabus_topics').update(patch).eq('id', topicId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update',
    entity: 'syllabus_topics',
    entityId: topicId,
    metadata: patch,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { topicId } = await params;

  const { error } = await supabase.from('syllabus_topics').delete().eq('id', topicId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, { action: 'delete', entity: 'syllabus_topics', entityId: topicId });
  return NextResponse.json({ ok: true });
}
