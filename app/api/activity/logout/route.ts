import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { recordLogout } from "@/lib/activity-store";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Record the logout time
    const record = recordLogout(userId);

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
