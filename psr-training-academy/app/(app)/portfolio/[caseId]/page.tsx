import { requireAuth } from '@/lib/auth';
import { PortfolioCaseEditor } from '@/components/portfolio/PortfolioCaseEditor';

export default async function PortfolioCasePage({ params }: { params: Promise<{ caseId: string }> }) {
  await requireAuth();
  const { caseId } = await params;
  return <PortfolioCaseEditor caseId={caseId} />;
}
