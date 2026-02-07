import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware - Authentication disabled
 * All routes are publicly accessible
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hide/disable admin routes while login is off
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Hide/disable admin API routes as well
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // No authentication required - allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
