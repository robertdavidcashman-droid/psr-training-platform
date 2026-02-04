import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { upsertActivity } from "@/lib/activity-store";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Get request metadata
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || 
                      request.headers.get("x-real-ip") || 
                      null;

    // Build user info
    const email = user.primaryEmailAddress?.emailAddress || "";
    const firstName = user.firstName || null;
    const lastName = user.lastName || null;
    const name = [firstName, lastName].filter(Boolean).join(" ") || email;
    const avatarUrl = user.imageUrl || null;

    // Upsert activity record
    const record = upsertActivity({
      userId,
      email,
      name,
      firstName,
      lastName,
      avatarUrl,
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
