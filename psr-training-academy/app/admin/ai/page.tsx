import { AiGenerator } from '@/components/admin/ai/AiGenerator';

export default async function AdminAiPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">AI (stub)</h1>
        <p className="text-muted-foreground">
          This is a placeholder generator that does not call any external provider yet.
        </p>
      </div>
      <AiGenerator />
    </div>
  );
}
