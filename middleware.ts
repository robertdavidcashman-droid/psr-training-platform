import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware is now empty - authentication removed
  // Kept for potential future middleware needs
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


























