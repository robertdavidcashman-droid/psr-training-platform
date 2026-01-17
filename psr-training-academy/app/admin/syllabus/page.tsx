import { SyllabusManager } from '@/components/admin/syllabus/SyllabusManager';

export default async function AdminSyllabusPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Syllabus</h1>
        <p className="text-muted-foreground">Manage syllabus topics and competencies.</p>
      </div>
      <SyllabusManager />
    </div>
  );
}
