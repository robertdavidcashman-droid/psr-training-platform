import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // End the session first
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Find the most recent active session first
      const { data: activeSession } = await supabase
        .from("user_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("active", true)
        .is("logout_at", null)
        .order("login_at", { ascending: false })
        .limit(1)
        .single();

      if (activeSession) {
        // Update the specific session
        await supabase
          .from("user_sessions")
          .update({
            logout_at: new Date().toISOString(),
            active: false,
          })
          .eq("id", activeSession.id);
      }
    }

    // Sign out from Supabase
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
