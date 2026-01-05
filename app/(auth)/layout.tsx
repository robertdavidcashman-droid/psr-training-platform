import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Simple Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-navy-800 leading-tight">PSR ACADEMY</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Police Station Rep Training</div>
            </div>
          </Link>
        </div>
      </header>
      
      {children}
    </div>
  );
}
