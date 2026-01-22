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

    // Get user_ids from request body
    const body = await request.json();
    const { user_ids } = body;

    if (!Array.isArray(user_ids)) {
      return NextResponse.json(
        { error: "user_ids must be an array" },
        { status: 400 }
      );
    }

    // Note: This requires service role or admin API access
    // For now, return empty map - emails would need to be fetched via Supabase admin API
    // or stored in user_sessions table on login
    const emailMap: Record<string, string> = {};

    // If you have service role access, you could do:
    // const { data: users } = await supabase.auth.admin.listUsers();
    // users.users.forEach(u => {
    //   if (user_ids.includes(u.id)) {
    //     emailMap[u.id] = u.email;
    //   }
    // });

    return NextResponse.json({ emails: emailMap });
  } catch (error) {
    console.error("User emails error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
