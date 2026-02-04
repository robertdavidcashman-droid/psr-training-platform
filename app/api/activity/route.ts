import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAllActivity, getActivityStats, formatDuration, getCurrentSessionDuration } from "@/lib/activity-store";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
    
    if (adminEmails.length === 0) {
      return NextResponse.json(
        { error: "Admin access not configured. Set ADMIN_EMAILS environment variable." },
        { status: 403 }
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    if (!userEmail || !adminEmails.includes(userEmail)) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Get all activity records
    const records = getAllActivity();
    const stats = getActivityStats();
    
    // Transform for JSON serialization
    const data = records.map(record => {
      const currentSessionDuration = getCurrentSessionDuration(record.userId);
      
      return {
        userId: record.userId,
        email: record.email,
        name: record.name,
        firstName: record.firstName,
        lastName: record.lastName,
        avatarUrl: record.avatarUrl,
        firstSeenAt: record.firstSeenAt.toISOString(),
        lastSeenAt: record.lastSeenAt.toISOString(),
        lastLogoutAt: record.lastLogoutAt?.toISOString() || null,
        userAgent: record.userAgent,
        ipAddress: record.ipAddress,
        device: record.device,
        isActive: (Date.now() - record.lastSeenAt.getTime()) < 5 * 60 * 1000,
        totalSessions: record.totalSessions,
        totalTimeSpent: record.totalTimeSpent,
        totalTimeSpentFormatted: formatDuration(record.totalTimeSpent),
        currentSessionDuration,
        currentSessionDurationFormatted: currentSessionDuration ? formatDuration(currentSessionDuration) : null,
        sessions: record.sessions.slice(-10).map(s => ({
          sessionId: s.sessionId,
          startedAt: s.startedAt.toISOString(),
          endedAt: s.endedAt?.toISOString() || null,
          duration: s.duration,
          durationFormatted: s.duration ? formatDuration(s.duration) : null,
          device: s.device,
        })),
      };
    });

    return NextResponse.json({
      ok: true,
      records: data,
      count: data.length,
      activeCount: data.filter(r => r.isActive).length,
      stats: {
        ...stats,
        avgSessionDurationFormatted: formatDuration(stats.avgSessionDuration),
      },
    });
  } catch (error) {
    console.error("Activity list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
