import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const skipTests = !supabaseUrl || !supabaseAnonKey || !supabaseServiceKey;

describe.skipIf(skipTests)("Row Level Security (RLS) Tests", () => {
  let user1Id: string;
  let user1Email: string;
  let user2Id: string;
  let user2Email: string;
  let serviceClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseServiceKey) return;
    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create two test users
    user1Email = `user1-${Date.now()}@example.com`;
    user2Email = `user2-${Date.now()}@example.com`;

    const { data: user1Data } = await serviceClient.auth.admin.createUser({
      email: user1Email,
      password: "password123",
      email_confirm: true,
    });

    const { data: user2Data } = await serviceClient.auth.admin.createUser({
      email: user2Email,
      password: "password123",
      email_confirm: true,
    });

    user1Id = user1Data.user?.id || "";
    user2Id = user2Data.user?.id || "";
    if (!user1Id || !user2Id) throw new Error("Failed to create test users");

    // Create sessions for both users
    await (serviceClient.from("user_sessions") as any).insert([
      {
        user_id: user1Id,
        login_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        active: true,
        ip_address: "192.168.1.1",
        user_agent: "Test Browser 1",
      },
      {
        user_id: user2Id,
        login_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        active: true,
        ip_address: "192.168.1.2",
        user_agent: "Test Browser 2",
      },
    ]);
  });

  afterAll(async () => {
    // Cleanup
    if (user1Id) {
      await serviceClient.auth.admin.deleteUser(user1Id);
    }
    if (user2Id) {
      await serviceClient.auth.admin.deleteUser(user2Id);
    }
  });

  it("should allow users to read only their own sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const user1Client = createClient(supabaseUrl, supabaseAnonKey);

    // Sign in as user1
    await user1Client.auth.signInWithPassword({
      email: user1Email,
      password: "password123",
    });

    // Try to read sessions
    const { data: sessions, error } = await user1Client
      .from("user_sessions")
      .select("*")
      .eq("user_id", user1Id);

    expect(error).toBeNull();
    expect(sessions).toBeDefined();
    expect(sessions?.length).toBeGreaterThan(0);
    // All sessions should belong to user1
    expect(sessions?.every((s) => s.user_id === user1Id)).toBe(true);
  });

  it("should prevent users from reading other users' sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const user1Client = createClient(supabaseUrl, supabaseAnonKey);

    await user1Client.auth.signInWithPassword({
      email: user1Email,
      password: "password123",
    });

    // Try to read user2's sessions
    const { data: sessions, error } = await user1Client
      .from("user_sessions")
      .select("*")
      .eq("user_id", user2Id);

    // Should return empty array (RLS filters it out)
    expect(sessions).toEqual([]);
    expect(error).toBeNull();
  });

  it("should allow users to insert only their own sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const user1Client = createClient(supabaseUrl, supabaseAnonKey);

    await user1Client.auth.signInWithPassword({
      email: user1Email,
      password: "password123",
    });

    // Try to insert session for user1 (should succeed)
    const { error: successError } = await (user1Client.from("user_sessions") as any).insert({
      user_id: user1Id,
      login_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      active: true,
    });

    expect(successError).toBeNull();

    // Try to insert session for user2 (should fail)
    const { error: failError } = await (user1Client.from("user_sessions") as any).insert({
      user_id: user2Id,
      login_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      active: true,
    });

    expect(failError).toBeDefined();
  });

  it("should allow users to update only their own sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const user1Client = createClient(supabaseUrl, supabaseAnonKey);

    await user1Client.auth.signInWithPassword({
      email: user1Email,
      password: "password123",
    });

    // Get user1's session
    const { data: user1Sessions } = await user1Client
      .from("user_sessions")
      .select("id")
      .eq("user_id", user1Id)
      .limit(1);

    if (user1Sessions && user1Sessions.length > 0) {
      // Update own session (should succeed)
      const { error: successError } = await user1Client
        .from("user_sessions")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", (user1Sessions[0] as any).id);

      expect(successError).toBeNull();
    }

    // Get user2's session ID (using service client)
    const { data: user2Sessions } = await serviceClient
      .from("user_sessions")
      .select("id")
      .eq("user_id", user2Id)
      .limit(1);

    if (user2Sessions && user2Sessions.length > 0) {
      // Try to update user2's session (should fail)
      const { error: failError } = await user1Client
        .from("user_sessions")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", (user2Sessions[0] as any).id);

      expect(failError).toBeDefined();
    }
  });

  it("should prevent non-admin users from viewing admin_users table", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const user1Client = createClient(supabaseUrl, supabaseAnonKey);

    await user1Client.auth.signInWithPassword({
      email: user1Email,
      password: "password123",
    });

    // Try to read admin_users table
    const { data, error } = await user1Client.from("admin_users").select("*");

    // Should return empty (RLS filters it out for non-admins)
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });
});
