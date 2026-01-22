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
      // If user is already logged out, that's okay
      return NextResponse.json({ success: true });
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
        logout_at: new Date().toISOString(),
        active: false,
      })
      .eq("id", activeSession.id);

    if (updateError) {
      console.error("Error updating session:", updateError);
      // Don't fail the logout if session update fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session end error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
