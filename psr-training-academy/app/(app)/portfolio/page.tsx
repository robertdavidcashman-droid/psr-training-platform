import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getCurrentProfile } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PortfolioPage() {
  const user = await requireAuth();
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const { data: cases } = await supabase
    .from('portfolio_cases')
    .select('id,title,case_type,updated_at,status')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const isSupervisor = profile?.role === 'supervisor' || profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Guided case templates and export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isSupervisor ? (
            <Link href="/portfolio/shared">
              <Button variant="outline">Shared with me</Button>
            </Link>
          ) : null}
          <Link href="/portfolio/new">
            <Button>New case</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(cases ?? []).map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>
                {c.case_type ? `${c.case_type} · ` : ''}
                {c.status} · Updated {new Date(c.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/portfolio/${c.id}`}>
                <Button variant="outline">Open</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {(cases ?? []).length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No cases yet. Create one to start building your evidence.
        </p>
      ) : null}
    </div>
  );
}
