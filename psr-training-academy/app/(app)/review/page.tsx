import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ReviewPage({
  searchParams,
}: {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const user = await requireAuth();
  const supabase = await createClient();
  const sp = await Promise.resolve(searchParams);

  const nowIso = new Date().toISOString();
  const { count } = await supabase
    .from('review_queue')
    .select('question_id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_due_at', nowIso);

  const dueCount = count ?? 0;
  const showError = sp?.error === 'nothing_due' || sp?.error === 'generate_failed';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Review</h1>
        <p className="text-muted-foreground">Spaced repetition queue based on what you’ve answered.</p>
        {showError ? (
          <p className="text-destructive text-sm">Nothing is due yet. Do a practice session first.</p>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Due now</CardTitle>
          <CardDescription>Questions scheduled for review.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="text-3xl font-semibold">{dueCount}</div>
          <Link href="/review/start">
            <Button disabled={dueCount === 0}>Start review</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
