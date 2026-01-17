import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAdmin } from '@/lib/auth';

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">Content management and audit trails (coming in Phase 6).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>Draft + publish</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Placeholder.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scenarios</CardTitle>
            <CardDescription>CIT practice</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Placeholder.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Syllabus</CardTitle>
            <CardDescription>Topics + competencies</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Placeholder.</CardContent>
        </Card>
      </div>
    </div>
  );
}
