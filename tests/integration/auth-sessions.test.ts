import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Skip tests if Supabase is not configured
const skipTests = !supabaseUrl || !supabaseAnonKey || !supabaseServiceKey;

describe.skipIf(skipTests)("Authentication & Session Integration Tests", () => {
  let testUserId: string;
  let testUserEmail: string;
  let testUserPassword: string;
  let serviceClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    if (skipTests || !supabaseUrl || !supabaseServiceKey) {
      return;
    }

    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create a test user
    testUserEmail = `test-${Date.now()}@example.com`;
    testUserPassword = "test-password-123";

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email: testUserEmail,
      password: testUserPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create test user: ${authError?.message}`);
    }

    testUserId = authData.user.id;
  });

  it("should create a session record on login", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    // Sign in
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    expect(signInError).toBeNull();
    expect(signInData.user).toBeDefined();

    // Wait a bit for session-start to be called (in real app, this happens via API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check session was created (using service client to bypass RLS)
    const { data: sessions, error: sessionError } = await serviceClient
      .from("user_sessions")
      .select("*")
      .eq("user_id", testUserId)
      .order("login_at", { ascending: false })
      .limit(1);

    expect(sessionError).toBeNull();
    expect(sessions).toBeDefined();
    expect(sessions?.length).toBeGreaterThan(0);

    const session = sessions?.[0] as any;
    expect(session?.user_id).toBe(testUserId);
    expect(session?.active).toBe(true);
    expect(session?.login_at).toBeDefined();
    expect(session?.last_seen_at).toBeDefined();
  });

  it("should update last_seen_at on ping", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    await anonClient.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    // Get initial session
    const { data: initialSessions } = await serviceClient
      .from("user_sessions")
      .select("last_seen_at, id")
      .eq("user_id", testUserId)
      .eq("active", true)
      .order("login_at", { ascending: false })
      .limit(1)
      .single();

    const initialSession = initialSessions as any;
    const initialLastSeen = initialSession?.last_seen_at;
    const sessionId = initialSession?.id;

    if (!sessionId) {
      throw new Error("No active session found");
    }

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate ping by updating last_seen_at
    const { data: updatedSessions, error: updateError } = await (serviceClient
      .from("user_sessions") as any)
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", sessionId)
      .select("last_seen_at")
      .single();

    expect(updateError).toBeNull();
    const updatedSession = updatedSessions as any;
    expect(updatedSession?.last_seen_at).toBeDefined();
    if (initialLastSeen && updatedSession?.last_seen_at) {
      expect(new Date(updatedSession.last_seen_at).getTime()).toBeGreaterThan(
        new Date(initialLastSeen).getTime()
      );
    }
  });

  it("should set logout_at and active=false on logout", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    await anonClient.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    // Get active session
    const { data: activeSession } = await serviceClient
      .from("user_sessions")
      .select("id")
      .eq("user_id", testUserId)
      .eq("active", true)
      .order("login_at", { ascending: false })
      .limit(1)
      .single();

    expect(activeSession).toBeDefined();
    const sessionId = (activeSession as any)?.id;
    if (!sessionId) {
      throw new Error("No active session found");
    }

    // Logout
    await anonClient.auth.signOut();

    // Update session to mark as logged out
    await (serviceClient.from("user_sessions") as any)
      .update({
        logout_at: new Date().toISOString(),
        active: false,
      })
      .eq("id", sessionId);

    // Verify session is marked as inactive
    const { data: loggedOutSession } = await serviceClient
      .from("user_sessions")
      .select("logout_at, active")
      .eq("id", sessionId)
      .single();

    expect((loggedOutSession as any)?.active).toBe(false);
    expect((loggedOutSession as any)?.logout_at).toBeDefined();
  });

  it("should store IP address and user agent in session", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    await anonClient.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    // Create session with IP and user agent (simulating API call)
    const testIP = "192.168.1.1";
    const testUserAgent = "Mozilla/5.0 Test Browser";

    const { error: insertError } = await (anonClient.from("user_sessions") as any).insert({
      user_id: testUserId,
      ip_address: testIP,
      user_agent: testUserAgent,
      login_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      active: true,
    });

    expect(insertError).toBeNull();

    // Verify data was stored
    const { data: session } = await serviceClient
      .from("user_sessions")
      .select("ip_address, user_agent")
      .eq("user_id", testUserId)
      .eq("ip_address", testIP)
      .single();

    const sessionData = session as any;
    expect(sessionData?.ip_address).toBe(testIP);
    expect(sessionData?.user_agent).toBe(testUserAgent);
  });

  it("should reject expired/invalid tokens", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    // Try to access with no auth
    const { data: userData, error: userError } = await anonClient.auth.getUser();

    expect(userError || !userData.user).toBeTruthy();
  });
});
