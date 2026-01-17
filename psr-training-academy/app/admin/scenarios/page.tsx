import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScenarioCreateForm } from '@/components/admin/scenarios/ScenarioCreateForm';

export default async function AdminScenariosPage() {
  const supabase = await createClient();
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('id,title,difficulty,status,updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Scenarios</h1>
        <p className="text-muted-foreground">Create and publish scenarios for the scenario runner.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ScenarioCreateForm />

        <Card>
          <CardHeader>
            <CardTitle>All scenarios</CardTitle>
            <CardDescription>Latest first (max 200).</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Diff</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(scenarios ?? []).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{s.status}</TableCell>
                    <TableCell className="text-xs">{s.difficulty}</TableCell>
                    <TableCell className="max-w-[420px] truncate">{s.title}</TableCell>
                    <TableCell>
                      <Link href={`/admin/scenarios/${s.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(scenarios ?? []).length === 0 ? (
              <p className="text-muted-foreground mt-4 text-sm">No scenarios yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
