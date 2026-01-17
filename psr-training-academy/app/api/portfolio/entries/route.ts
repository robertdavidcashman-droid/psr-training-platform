import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  caseId: z.string().uuid(),
  sectionKey: z.string().min(1).max(80),
  content: z.unknown().optional(),
});

export async function PUT(request: Request) {
  await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { caseId, sectionKey, content } = parsed.data;

  const { error } = await supabase.from('portfolio_entries').upsert({
    case_id: caseId,
    section_key: sectionKey,
    content: content ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
