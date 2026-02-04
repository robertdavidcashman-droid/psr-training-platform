import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "app_session";

// Protected routes that require authentication
const protectedPatterns = [
  /^\/dashboard/,
  /^\/practice/,
  /^\/mock-exam/,
  /^\/syllabus/,
  /^\/analytics/,
  /^\/coverage/,
  /^\/incidents/,
  /^\/portfolio/,
  /^\/resources/,
  /^\/admin/,
];

// Public routes that should not redirect to login
const publicPatterns = [
  /^\/$/,
  /^\/login/,
  /^\/signup/,
  /^\/reset-password/,
  /^\/api\//,
  /^\/gateway/,
  /^\/legal/,
  /^\/_next/,
  /^\/favicon/,
];

function isProtectedRoute(pathname: string): boolean {
  return protectedPatterns.some((pattern) => pattern.test(pathname));
}

function isPublicRoute(pathname: string): boolean {
  return publicPatterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie on protected routes
  if (isProtectedRoute(pathname)) {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

    if (!sessionToken) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists - let the request proceed
    // Full session validation happens in API routes/server components
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
