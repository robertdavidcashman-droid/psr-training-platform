import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Topic = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  parent_id: string | null;
};

function buildTree(topics: Topic[]) {
  const byParent = new Map<string | null, Topic[]>();
  for (const t of topics) {
    const list = byParent.get(t.parent_id) ?? [];
    list.push(t);
    byParent.set(t.parent_id, list);
  }
  for (const [, list] of byParent) list.sort((a, b) => a.code.localeCompare(b.code));

  function render(parentId: string | null, depth: number): React.ReactNode {
    const children = byParent.get(parentId) ?? [];
    if (children.length === 0) return null;
    return (
      <ul className={depth === 0 ? 'space-y-2' : 'space-y-1'}>
        {children.map((t) => (
          <li key={t.id} className={depth === 0 ? '' : 'ml-4'}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">
                  {t.title} <span className="text-muted-foreground text-xs">({t.code})</span>
                </div>
                {t.description ? <div className="text-muted-foreground text-sm">{t.description}</div> : null}
              </div>
              <Link
                className="text-sm underline underline-offset-4"
                href={`/practice?topic=${encodeURIComponent(t.code)}`}
              >
                Practice
              </Link>
            </div>
            {render(t.id, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  return render(null, 0);
}

export default async function LearnPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: topics } = await supabase
    .from('syllabus_topics')
    .select('id,code,title,description,parent_id');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Learn</h1>
        <p className="text-muted-foreground">Browse the syllabus topics and practice by area.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Syllabus</CardTitle>
          <CardDescription>Starter tree (admins can refine mappings later).</CardDescription>
        </CardHeader>
        <CardContent>{buildTree((topics ?? []) as Topic[])}</CardContent>
      </Card>
    </div>
  );
}
