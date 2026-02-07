import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware - Shared access-code gate
 *
 * Everything is gated behind an HttpOnly cookie set by /api/gateway.
 * This is not user authentication; it’s a shared “door code”.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const expectedRaw = process.env.TRAINING_ACCESS_CODE || process.env.APP_GATEWAY_CODE;
  const expected = typeof expectedRaw === "string" ? expectedRaw.trim() : "";
  const cookieName = process.env.GATEWAY_COOKIE_NAME || "psr_gate";
  const hasGateCookie = request.cookies.get(cookieName)?.value === "1";

  // Allowlist: gateway + Next internals + assets + robots
  if (
    pathname === "/gateway" ||
    pathname === "/api/gateway" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Hide/disable admin routes while login is off
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Hide/disable admin API routes as well
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Require the gate cookie for all non-allowlisted routes.
  // If TRAINING_ACCESS_CODE is missing, the app will remain locked until configured.
  if (!hasGateCookie) {
    // For API calls, redirect is unhelpful; return 401 JSON.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: expected ? "Access code required." : "Server misconfigured: TRAINING_ACCESS_CODE is not set." },
        { status: 401 }
      );
    }

    const url = request.nextUrl.clone();
    const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = "/gateway";
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
