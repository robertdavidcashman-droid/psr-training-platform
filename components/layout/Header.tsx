'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SearchDialog } from '@/components/search/SearchDialog';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const sessionIdRef = useRef<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/login-track', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionId) {
          sessionIdRef.current = data.sessionId;
          // Store in localStorage for InactivityTimeout to access
          if (typeof window !== 'undefined') {
            localStorage.setItem('psr_session_id', data.sessionId);
          }
        }
      })
      .catch(console.error);

    // Check if user is admin
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === 'admin') {
              setIsAdmin(true);
            }
          })
          .catch(() => {
            // User might not exist in users table yet, ignore
          });
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [supabase]);

  const handleLogout = async () => {
    const sessionId = sessionIdRef.current || 
      (typeof window !== 'undefined' ? localStorage.getItem('psr_session_id') : null);
    
    if (sessionId) {
      try {
        await fetch('/api/auth/logout-track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch (error) {
        console.warn('Error tracking logout:', error);
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('psr_session_id');
    }
    
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/practice', label: 'Practice' },
    { href: '/questions', label: 'Questions' },
    { href: '/scenarios', label: 'Scenarios' },
    { href: '/modules', label: 'Modules' },
    { href: '/flashcards', label: 'Flashcards' },
    { href: '/mock-exam', label: 'Mock Exam' },
    { href: '/pace', label: 'PACE' },
    { href: '/study-plan', label: 'Study Plan' },
    { href: '/bookmarks', label: 'Bookmarks' },
    { href: '/certificates', label: 'Certificates' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header 
      className="sticky top-0 z-50 bg-white"
      style={{ 
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3"
            style={{ textDecoration: 'none' }}
          >
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              PSR
            </div>
            <span 
              className="font-bold text-lg hidden sm:block"
              style={{ 
                color: '#1a1a2e',
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              PSR Train
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                style={{ 
                  color: isActive(link.href) ? '#1e3a5f' : '#6b7280',
                  backgroundColor: isActive(link.href) ? '#f0f4ff' : 'transparent',
                }}
                onMouseOver={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.color = '#1a1a2e';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                style={{ 
                  color: isActive('/admin') ? '#1e3a5f' : '#6b7280',
                  backgroundColor: isActive('/admin') ? '#f0f4ff' : 'transparent',
                }}
                onMouseOver={(e) => {
                  if (!isActive('/admin')) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.color = '#1a1a2e';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive('/admin')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                Admin
              </Link>
            )}

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: '#6b7280' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.color = '#1a1a2e';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
              title="Search (Ctrl+K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Menu / Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
              style={{ 
                backgroundColor: '#1e3a5f',
                color: '#ffffff'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2d4a6f'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a5f'}
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-150"
              style={{ color: '#6b7280' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden py-4 border-t"
            style={{ borderColor: '#e5e7eb' }}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150"
                  style={{ 
                    color: isActive(link.href) ? '#1e3a5f' : '#6b7280',
                    backgroundColor: isActive(link.href) ? '#f0f4ff' : 'transparent',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
