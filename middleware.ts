import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const client = createClient(request);

  // If Supabase is not configured, allow all requests
  if (!client) {
    return NextResponse.next();
  }

  const { supabase, response } = client;

  // Refresh session if expired - this is critical for session persistence
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth/callback");

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

  // Redirect logged-in users away from auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect routes that require authentication
  if ((isProtectedRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin route protection
  if (isAdminRoute && user) {
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminData) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
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
