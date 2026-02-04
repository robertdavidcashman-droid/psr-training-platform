import { NextRequest, NextResponse } from "next/server";
import { upsertActivity } from "@/lib/activity-store";
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

    // Get request metadata
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || 
                      request.headers.get("x-real-ip") || 
                      null;

    // Build user info from session
    const email = session.email;
    const emailName = email.split("@")[0];
    const name = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    // Upsert activity record
    const record = upsertActivity({
      userId: session.userId,
      email,
      name,
      firstName: name,
      lastName: null,
      avatarUrl: null,
      userAgent,
      ipAddress,
    });

    return NextResponse.json({
      ok: true,
      firstSeenAt: record.firstSeenAt.toISOString(),
      lastSeenAt: record.lastSeenAt.toISOString(),
      totalSessions: record.totalSessions,
    });
  } catch (error) {
    console.error("Activity ping error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
