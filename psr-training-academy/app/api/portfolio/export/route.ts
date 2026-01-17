import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  caseId: z.string().uuid(),
});

function mdEscape(s: string) {
  return s.replace(/\r\n/g, '\n');
}

export async function GET(request: Request) {
  await requireAuth();
  const supabase = await createClient();

  const url = new URL(request.url);
  const parsed = schema.safeParse({ caseId: url.searchParams.get('caseId') });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  const { caseId } = parsed.data;

  const { data: c, error: cErr } = await supabase
    .from('portfolio_cases')
    .select('id,title,case_type,created_at,updated_at,status')
    .eq('id', caseId)
    .single();
  if (cErr || !c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  const [entriesRes, reflectionsRes, signoffsRes] = await Promise.all([
    supabase.from('portfolio_entries').select('section_key,content,updated_at').eq('case_id', caseId),
    supabase.from('portfolio_reflections').select('prompt_key,response,updated_at').eq('case_id', caseId),
    supabase
      .from('supervisor_signoffs')
      .select('signed_at,comments,supervisor_user_id')
      .eq('case_id', caseId),
  ]);
  if (entriesRes.error) return NextResponse.json({ error: entriesRes.error.message }, { status: 500 });
  if (reflectionsRes.error)
    return NextResponse.json({ error: reflectionsRes.error.message }, { status: 500 });
  if (signoffsRes.error) return NextResponse.json({ error: signoffsRes.error.message }, { status: 500 });

  const lines: string[] = [];
  lines.push(`# ${mdEscape(c.title)}`);
  lines.push('');
  lines.push(`- Status: **${c.status}**`);
  if (c.case_type) lines.push(`- Type: **${mdEscape(c.case_type)}**`);
  lines.push(`- Updated: ${c.updated_at}`);
  lines.push('');

  lines.push('## Entries');
  for (const e of entriesRes.data ?? []) {
    lines.push('');
    lines.push(`### ${mdEscape(e.section_key)}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(e.content ?? null, null, 2));
    lines.push('```');
  }

  lines.push('');
  lines.push('## Reflections');
  for (const r of reflectionsRes.data ?? []) {
    lines.push('');
    lines.push(`### ${mdEscape(r.prompt_key)}`);
    lines.push('');
    lines.push(mdEscape(r.response ?? ''));
  }

  if ((signoffsRes.data ?? []).length) {
    lines.push('');
    lines.push('## Supervisor sign-offs');
    for (const s of signoffsRes.data ?? []) {
      lines.push('');
      lines.push(`- Signed at: ${s.signed_at} (supervisor: ${s.supervisor_user_id})`);
      if (s.comments) lines.push(`  - Comments: ${mdEscape(s.comments)}`);
    }
  }

  const body = lines.join('\n');
  const filename = `portfolio-${c.id}.md`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
    },
  });
}
