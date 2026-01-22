import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function getClientIP(request: NextRequest): string {
  // Check x-forwarded-for header (for reverse proxies like Vercel)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP before comma
    const firstIP = forwardedFor.split(",")[0].trim();
    if (firstIP) {
      return firstIP;
    }
  }

  // Fallback to x-real-ip
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Check if user already has an active session
    const { data: existingSession } = await supabase
      .from("user_sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("active", true)
      .is("logout_at", null)
      .order("login_at", { ascending: false })
      .limit(1)
      .single();

    if (existingSession) {
      // Update existing session instead of creating a new one
      const { error: updateError } = await supabase
        .from("user_sessions")
        .update({
          ip_address: ipAddress,
          user_agent: userAgent,
          last_seen_at: new Date().toISOString(),
        })
        .eq("id", existingSession.id);

      if (updateError) {
        console.error("Error updating session:", updateError);
        return NextResponse.json(
          { error: "Failed to update session" },
          { status: 500 }
        );
      }
    } else {
      // Insert new session
      const { error: insertError } = await supabase.from("user_sessions").insert({
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        login_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        active: true,
      });

      if (insertError) {
        console.error("Error inserting session:", insertError);
        return NextResponse.json(
          { error: "Failed to log session" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
