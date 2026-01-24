import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware for route protection
 *
 * This app uses a lightweight "gateway" cookie (no user accounts).
 * Note: This is NOT strong security; it’s a simple access gate.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieName = process.env.GATEWAY_COOKIE_NAME || "app_gateway";
  const hasGateway = !!request.cookies.get(cookieName)?.value;

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/practice",
    "/mock-exam",
    "/syllabus",
    "/analytics",
    "/coverage",
    "/incidents",
    "/portfolio",
    "/resources",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = pathname.startsWith("/admin");

  // Redirect old auth pages to the gateway
  if (pathname === "/login" || pathname === "/signup" || pathname === "/reset-password") {
    const redirectUrl = new URL("/gateway", request.url);
    const next = request.nextUrl.searchParams.get("next");
    if (next) redirectUrl.searchParams.set("next", next);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect gated users away from gateway page
  if (hasGateway && pathname === "/gateway") {
    const next = request.nextUrl.searchParams.get("next") || "/dashboard";
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Protect routes that require the gateway cookie
  if ((isProtectedRoute || isAdminRoute) && !hasGateway) {
    const redirectUrl = new URL("/gateway", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
