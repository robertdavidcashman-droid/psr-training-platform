import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminData || adminError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get session_id from request body
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    // Force logout the session
    const { error: updateError } = await supabase
      .from("user_sessions")
      .update({
        logout_at: new Date().toISOString(),
        active: false,
      })
      .eq("id", session_id);

    if (updateError) {
      console.error("Error forcing logout:", updateError);
      return NextResponse.json(
        { error: "Failed to force logout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Force logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
