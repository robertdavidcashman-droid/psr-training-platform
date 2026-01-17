import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/questions', label: 'Questions' },
  { href: '/admin/scenarios', label: 'Scenarios' },
  { href: '/admin/syllabus', label: 'Syllabus' },
  { href: '/admin/ai', label: 'AI (stub)' },
  { href: '/admin/audit', label: 'Audit' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <Link className="text-muted-foreground text-sm underline underline-offset-4" href="/dashboard">
            Back to app
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-6rem)]">
          <nav className="bg-card flex flex-col gap-1 rounded-lg border p-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
