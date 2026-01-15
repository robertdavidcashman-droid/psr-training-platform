'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SearchDialog } from '@/components/search/SearchDialog';
import { Home, Brain, BookOpen, ClipboardCheck, Scale, GraduationCap, Bookmark, MoreHorizontal } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const sessionIdRef = useRef<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/login-track', { method: 'POST' })
      .then((res) => {
        if (!res.ok) return null; // Don't process if unauthorized
        return res.json();
      })
      .then((data) => {
        if (data?.sessionId) {
          sessionIdRef.current = data.sessionId;
          // Store in localStorage for InactivityTimeout to access
          if (typeof window !== 'undefined') {
            localStorage.setItem('psr_session_id', data.sessionId);
          }
        }
      })
      .catch(() => {}); // Silently fail - don't log console errors

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMoreMenuOpen(false);
    if (moreMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [moreMenuOpen]);

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
        // Don't block logout if tracking fails
      }
    }
    
    // Clear session ID from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('psr_session_id');
    }
    
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Main nav links (simplified)
  const mainNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/practice', label: 'Practice', icon: Brain },
    { href: '/modules', label: 'Modules', icon: BookOpen },
    { href: '/mock-exam', label: 'Mock Exam', icon: ClipboardCheck },
    { href: '/pace', label: 'PACE', icon: Scale },
  ];

  // Secondary nav links (in More menu)
  const moreNavLinks = [
    { href: '/flashcards', label: 'Flashcards' },
    { href: '/scenarios', label: 'Scenarios' },
    { href: '/questions', label: 'Question Bank' },
    { href: '/study-plan', label: 'Study Plan' },
    { href: '/bookmarks', label: 'Bookmarks' },
    { href: '/certificates', label: 'Certificates' },
  ];

  // All links for mobile
  const allNavLinks = [...mainNavLinks, ...moreNavLinks.map(l => ({ ...l, icon: Bookmark }))];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
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
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreMenuOpen(!moreMenuOpen);
                }}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                style={{ 
                  color: moreNavLinks.some(l => isActive(l.href)) ? '#1e3a5f' : '#6b7280',
                  backgroundColor: moreNavLinks.some(l => isActive(l.href)) ? '#f0f4ff' : 'transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#1a1a2e';
                }}
                onMouseOut={(e) => {
                  if (!moreNavLinks.some(l => isActive(l.href))) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
                More
              </button>
              
              {moreMenuOpen && (
                <div 
                  className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {moreNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ 
                        color: isActive(link.href) ? '#1e3a5f' : '#6b7280',
                        backgroundColor: isActive(link.href) ? '#f0f4ff' : 'transparent',
                      }}
                      onClick={() => setMoreMenuOpen(false)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.color = '#1a1a2e';
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
                </div>
              )}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
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
              {/* Main links */}
              {mainNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-3"
                    style={{ 
                      color: isActive(link.href) ? '#1e3a5f' : '#6b7280',
                      backgroundColor: isActive(link.href) ? '#f0f4ff' : 'transparent',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="my-2 border-t" style={{ borderColor: '#e5e7eb' }} />
              
              {/* More links */}
              {moreNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-3"
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
