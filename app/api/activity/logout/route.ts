import { NextRequest, NextResponse } from "next/server";
import { recordLogout } from "@/lib/activity-store";
import { validateSession, getSessionToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Record the logout time
    const record = recordLogout(session.userId);

    return NextResponse.json({
      ok: true,
      logoutAt: record?.lastLogoutAt?.toISOString() || null,
    });
  } catch (error) {
    console.error("Activity logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
