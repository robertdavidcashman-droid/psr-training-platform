import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSessionToken, clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const token = getSessionToken(request);

    if (token) {
      // Delete session from database
      await deleteSession(token);
    }

    // Create response
    const response = NextResponse.json({ ok: true });

    // Clear session cookie
    clearSessionCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookie even if DB deletion fails
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  }
}
