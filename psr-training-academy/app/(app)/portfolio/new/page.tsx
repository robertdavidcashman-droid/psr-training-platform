import { requireAuth } from '@/lib/auth';
import { NewCaseForm } from '@/components/portfolio/NewCaseForm';

export default async function NewPortfolioCasePage() {
  await requireAuth();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground">Create a new case record.</p>
      </div>
      <NewCaseForm />
    </div>
  );
}
