import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ScenariosPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('id,title,brief,difficulty')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Scenarios</h1>
        <p className="text-muted-foreground">
          CIT-style scenario practice with step-by-step decisions and notes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(scenarios ?? []).map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>Difficulty: {s.difficulty} / 5</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {s.brief ? <p className="text-muted-foreground text-sm">{s.brief}</p> : null}
              <Link href={`/scenarios/${s.id}/start`}>
                <Button>Start</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {(scenarios ?? []).length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No published scenarios yet. Add/publish scenarios in admin (Phase 6).
        </p>
      ) : null}
    </div>
  );
}
