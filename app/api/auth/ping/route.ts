import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the most recent active session first
    const { data: activeSession, error: selectError } = await supabase
      .from("user_sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("active", true)
      .is("logout_at", null)
      .order("login_at", { ascending: false })
      .limit(1)
      .single();

    if (selectError || !activeSession) {
      // No active session found, that's okay
      return NextResponse.json({ success: true });
    }

    // Update the specific session
    const { error: updateError } = await supabase
      .from("user_sessions")
      .update({
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", activeSession.id);

    if (updateError) {
      console.error("Error updating last_seen_at:", updateError);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ping error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
