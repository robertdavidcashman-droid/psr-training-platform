import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ScenarioStartPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  await requireAuth();
  const { scenarioId } = await params;

  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = host ? `${proto}://${host}` : '';

  const res = await fetch(`${origin}/api/scenarios/start`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ scenarioId }),
    cache: 'no-store',
  }).catch(() => null);

  if (!res || !res.ok) {
    redirect('/scenarios?error=start_failed');
  }

  const data = (await res.json()) as { attemptId: string };
  redirect(`/scenarios/${scenarioId}?attemptId=${data.attemptId}`);
}
