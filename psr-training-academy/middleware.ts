import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = new Set([
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
  '/reset-password',
  '/auth/callback',
]);

function isPublicPath(pathname: string) {
  // NEVER intercept API routes
  if (pathname.startsWith('/api/')) return true;
  
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Allow reset-password flows (e.g. /reset-password/update)
  if (pathname.startsWith('/reset-password')) return true;
  // Allow auth callback (and any subpaths we may add later)
  if (pathname.startsWith('/auth/callback')) return true;
  // Allow next internals/static
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/favicon')) return true;
  // Allow other obvious static assets
  if (pathname.startsWith('/robots.txt')) return true;
  if (pathname.startsWith('/sitemap.xml')) return true;
  return false;
}

function isProtectedPath(pathname: string) {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/learn' ||
    pathname.startsWith('/learn/') ||
    pathname === '/practice' ||
    pathname.startsWith('/practice/') ||
    pathname === '/quiz' ||
    pathname.startsWith('/quiz/') ||
    pathname === '/review' ||
    pathname.startsWith('/review/') ||
    pathname === '/scenarios' ||
    pathname.startsWith('/scenarios/') ||
    pathname === '/portfolio' ||
    pathname.startsWith('/portfolio/') ||
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { user, response } = await getUserFromRequest(request);

  // If logged in, avoid showing auth pages.
  if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/reset-password')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (isPublicPath(pathname)) return response;

  if (isProtectedPath(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve destination for after login (avoid loops by only setting it from protected pages).
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
