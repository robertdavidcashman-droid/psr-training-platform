import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { computeCurrentStreak } from '@/lib/stats';

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const nowIso = new Date().toISOString();
  const [{ count: dueCount }, { data: attempts }] = await Promise.all([
    supabase
      .from('review_queue')
      .select('question_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('next_due_at', nowIso),
    supabase
      .from('attempts')
      .select('xp_earned,completed_at')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(120),
  ]);

  const totalXp = (attempts ?? []).reduce((sum, a) => sum + (a.xp_earned ?? 0), 0);
  const streak = computeCurrentStreak((attempts ?? []).map((a) => a.completed_at));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Your training overview lives here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Streak</CardTitle>
            <CardDescription>Days in a row</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{streak}</div>
            <p className="text-muted-foreground text-sm">
              Complete at least one quiz per day to keep it going.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>XP</CardTitle>
            <CardDescription>Total learning points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalXp}</div>
            <p className="text-muted-foreground text-sm">Earn XP by answering correctly.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
            <CardDescription>Due now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{dueCount ?? 0}</div>
            <p className="text-muted-foreground text-sm">Head to Review to clear your queue.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
