import { ScenarioEditor } from '@/components/admin/scenarios/ScenarioEditor';

export default async function AdminScenarioEditPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  return <ScenarioEditor scenarioId={scenarioId} />;
}
