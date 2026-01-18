'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/modules', label: 'Modules' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/critical-incidents', label: 'Critical Incidents' },
  { href: '/legal/advice', label: 'Legal Advice' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">PSR</div>
          <span className="font-bold text-xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
            PSR Train
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/modules">
          <Button variant="navy" size="sm">
            Explore Modules
          </Button>
        </Link>
      </div>
    </header>
  );
}
