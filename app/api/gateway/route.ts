import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.GATEWAY_COOKIE_NAME || "app_gateway";
const COOKIE_DAYS = Number(process.env.GATEWAY_COOKIE_DAYS || "30");
const COOKIE_MAX_AGE = Number.isFinite(COOKIE_DAYS) && COOKIE_DAYS > 0 ? COOKIE_DAYS * 24 * 60 * 60 : 30 * 24 * 60 * 60;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function POST(request: NextRequest) {
  void request;
  const expected = process.env.APP_GATEWAY_CODE;

  const body = (await request.json().catch(() => null)) as null | { code?: unknown };
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  // Zero-setup mode: if no APP_GATEWAY_CODE is configured, allow unlock without a code.
  // This keeps the "gateway flow" without requiring any environment setup.
  if (expected) {
    if (!code || code !== expected) {
      return NextResponse.json({ ok: false, error: "Invalid access code." }, { status: 401 });
    }
  }

  const response = NextResponse.json({ ok: true, mode: expected ? "code" : "open" });
  response.cookies.set(COOKIE_NAME, "1", {
    ...cookieOptions(),
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  void request;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  return response;
}

