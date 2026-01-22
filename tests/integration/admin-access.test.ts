import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const skipTests = !supabaseUrl || !supabaseAnonKey || !supabaseServiceKey;

describe.skipIf(skipTests)("Admin Access Control Tests", () => {
  let adminUserId: string;
  let adminEmail: string;
  let regularUserId: string;
  let regularEmail: string;
  let serviceClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseServiceKey) return;
    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create admin user
    adminEmail = `admin-${Date.now()}@example.com`;
    const { data: adminData } = await serviceClient.auth.admin.createUser({
      email: adminEmail,
      password: "admin-password-123",
      email_confirm: true,
    });
    adminUserId = adminData.user?.id || "";
    if (!adminUserId) throw new Error("Failed to create admin user");

    // Add to admin_users table
    await (serviceClient.from("admin_users") as any).insert({
      user_id: adminUserId,
      email: adminEmail,
    });

    // Create regular user
    regularEmail = `regular-${Date.now()}@example.com`;
    const { data: regularData } = await serviceClient.auth.admin.createUser({
      email: regularEmail,
      password: "regular-password-123",
      email_confirm: true,
    });
    regularUserId = regularData.user?.id || "";
    if (!regularUserId) throw new Error("Failed to create regular user");
  });

  afterAll(async () => {
    // Cleanup
    if (adminUserId) {
      await serviceClient.auth.admin.deleteUser(adminUserId);
    }
    if (regularUserId) {
      await serviceClient.auth.admin.deleteUser(regularUserId);
    }
  });

  it("should allow admin to view admin_users table", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const adminClient = createClient(supabaseUrl, supabaseAnonKey);

    await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: "admin-password-123",
    });

    const { data, error } = await adminClient.from("admin_users").select("*");

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.length).toBeGreaterThan(0);
    expect(data?.some((a) => a.user_id === adminUserId)).toBe(true);
  });

  it("should prevent non-admin from viewing admin_users table", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const regularClient = createClient(supabaseUrl, supabaseAnonKey);

    await regularClient.auth.signInWithPassword({
      email: regularEmail,
      password: "regular-password-123",
    });

    const { data, error } = await regularClient.from("admin_users").select("*");

    // RLS should filter out all rows for non-admins
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });

  it("should allow admin to view all user sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const adminClient = createClient(supabaseUrl, supabaseAnonKey);

    await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: "admin-password-123",
    });

    // Create sessions for both users
    await (serviceClient.from("user_sessions") as any).insert([
      {
        user_id: adminUserId,
        login_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        active: true,
      },
      {
        user_id: regularUserId,
        login_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        active: true,
      },
    ]);

    const { data: sessions, error } = await adminClient
      .from("user_sessions")
      .select("*");

    expect(error).toBeNull();
    expect(sessions).toBeDefined();
    // Admin should see sessions from both users
    expect(sessions?.length).toBeGreaterThanOrEqual(2);
  });

  it("should prevent regular user from viewing other users' sessions", async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const regularClient = createClient(supabaseUrl, supabaseAnonKey);

    await regularClient.auth.signInWithPassword({
      email: regularEmail,
      password: "regular-password-123",
    });

    const { data: sessions, error } = await regularClient
      .from("user_sessions")
      .select("*");

    expect(error).toBeNull();
    expect(sessions).toBeDefined();
    // Regular user should only see their own sessions
    expect(sessions?.every((s) => s.user_id === regularUserId)).toBe(true);
  });
});
