import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { ScenarioRunner } from '@/components/scenarios/ScenarioRunner';

export default async function ScenarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ scenarioId: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  await requireAuth();
  const { scenarioId } = await params;
  const sp = await Promise.resolve(searchParams);
  const attemptId = typeof sp?.attemptId === 'string' ? sp.attemptId : undefined;
  if (!attemptId) redirect(`/scenarios/${scenarioId}/start`);

  return <ScenarioRunner scenarioId={scenarioId} attemptId={attemptId} />;
}
