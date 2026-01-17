import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const patchSchema = z.object({
  title: z.string().min(2).max(140).optional(),
  caseType: z.string().max(80).nullable().optional(),
  status: z.enum(['draft', 'ready', 'shared', 'signedoff']).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const user = await requireAuth();
  const supabase = await createClient();
  const { caseId } = await params;

  const { data: c, error: cErr } = await supabase
    .from('portfolio_cases')
    .select('id,user_id,title,case_type,created_at,updated_at,status')
    .eq('id', caseId)
    .single();
  if (cErr || !c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  const [entriesRes, reflectionsRes, signoffsRes] = await Promise.all([
    supabase.from('portfolio_entries').select('section_key,content,updated_at').eq('case_id', caseId),
    supabase.from('portfolio_reflections').select('prompt_key,response,updated_at').eq('case_id', caseId),
    supabase
      .from('supervisor_signoffs')
      .select('id,supervisor_user_id,signed_at,comments')
      .eq('case_id', caseId),
  ]);

  if (entriesRes.error) return NextResponse.json({ error: entriesRes.error.message }, { status: 500 });
  if (reflectionsRes.error)
    return NextResponse.json({ error: reflectionsRes.error.message }, { status: 500 });
  if (signoffsRes.error) return NextResponse.json({ error: signoffsRes.error.message }, { status: 500 });

  const canEdit = c.user_id === user.id;

  return NextResponse.json({
    case: c,
    canEdit,
    entries: entriesRes.data ?? [],
    reflections: reflectionsRes.data ?? [],
    signoffs: signoffsRes.data ?? [],
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  await requireAuth();
  const supabase = await createClient();
  const { caseId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof parsed.data.title === 'string') patch.title = parsed.data.title;
  if (parsed.data.caseType !== undefined) patch.case_type = parsed.data.caseType;
  if (parsed.data.status) patch.status = parsed.data.status;

  const { error } = await supabase.from('portfolio_cases').update(patch).eq('id', caseId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
