import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  caseId: z.string().uuid(),
  comments: z.string().max(4000).optional(),
});

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { caseId, comments } = parsed.data;

  const { error } = await supabase.from('supervisor_signoffs').insert({
    case_id: caseId,
    supervisor_user_id: user.id,
    comments: comments ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Optional convenience: mark case signedoff (will fail under RLS unless owner changes it)
  return NextResponse.json({ ok: true });
}
