import Link from 'next/link';
import { requireSupervisorOrAdmin } from '@/lib/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';

export default async function PortfolioSharedPage() {
  await requireSupervisorOrAdmin();

  // Use API route so the list is guaranteed to be filtered by RLS consistently.
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = host ? `${proto}://${host}` : '';

  const res = await fetch(`${origin}/api/portfolio/shared`, { cache: 'no-store' }).catch(() => null);

  const data = (await res?.json().catch(() => null)) as {
    cases: Array<{ id: string; title: string; case_type: string | null; updated_at: string; status: string }>;
  } | null;

  const cases = data?.cases ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Shared with me</h1>
        <p className="text-muted-foreground">
          Cases shared by supervisees (subject to supervisor links + RLS).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cases.map((c) => (
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

      {cases.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No shared cases are visible. This requires supervisor links to be set up (admin tooling comes
          later).
        </p>
      ) : null}

      <Link className="text-sm underline underline-offset-4" href="/portfolio">
        Back to my portfolio
      </Link>
    </div>
  );
}
