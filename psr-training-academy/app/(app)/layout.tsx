import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { Providers } from '@/components/providers';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learn' },
  { href: '/practice', label: 'Practice' },
  { href: '/review', label: 'Review' },
  { href: '/scenarios', label: 'Scenarios' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/profile', label: 'Profile' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <Providers>
      <div className="bg-background min-h-screen">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/dashboard" className="font-semibold">
              PSR Training Academy
            </Link>
            <form action="/logout" method="post">
              <Button variant="outline" size="sm">
                Log out
              </Button>
            </form>
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
    </Providers>
  );
}
