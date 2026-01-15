import Link from 'next/link';

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
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              PSR
            </div>
            <span 
              className="font-bold text-lg"
              style={{ 
                color: '#1a1a2e',
                fontFamily: 'Georgia, serif'
              }}
            >
              PSR Train
            </span>
          </Link>
        </div>
      </header>
      
      {children}
    </div>
  );
}
