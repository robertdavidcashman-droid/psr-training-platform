import { requireAdmin } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { InactivityTimeout } from '@/components/auth/InactivityTimeout';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InactivityTimeout />
      <Header />
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-64px)]">
          <nav className="p-6 space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/questions" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>❓</span>
              <span>Questions</span>
            </Link>
            <Link 
              href="/admin/users" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>👥</span>
              <span>Users</span>
            </Link>
            <Link 
              href="/admin/analytics" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>📈</span>
              <span>Analytics</span>
            </Link>
            <Link 
              href="/admin/content" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>📝</span>
              <span>Content</span>
            </Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-8 py-12 w-full">{children}</main>
      </div>
      <Footer />
    </div>
  );
}


