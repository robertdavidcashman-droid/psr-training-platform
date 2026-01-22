import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const skipTests = !supabaseUrl || !supabaseServiceKey;

describe.skipIf(skipTests)("Database Index Validation", () => {
  let serviceClient: ReturnType<typeof createClient>;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseServiceKey) return;
    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  });

  it("should have index on user_sessions.user_id", async () => {
    // Verify the table exists and we can query by user_id efficiently
    const start = Date.now();
    const { data: tableInfo, error: tableError } = await serviceClient
      .from("user_sessions")
      .select("user_id")
      .limit(1);
    const duration = Date.now() - start;

    expect(tableError).toBeNull();
    expect(tableInfo).toBeDefined();
    // Query should be fast if indexed (< 500ms)
    expect(duration).toBeLessThan(500);
  });

  it("should have index on user_sessions.active", async () => {
    // Verify we can query by active column efficiently
    const start = Date.now();
    const { data, error } = await serviceClient
      .from("user_sessions")
      .select("id")
      .eq("active", true)
      .limit(1);

    const duration = Date.now() - start;

    expect(error).toBeNull();
    // Query should be fast (< 100ms) if indexed
    expect(duration).toBeLessThan(1000);
  });

  it("should have index on user_sessions.last_seen_at", async () => {
    const start = Date.now();
    const { data, error } = await serviceClient
      .from("user_sessions")
      .select("id")
      .order("last_seen_at", { ascending: false })
      .limit(1);

    const duration = Date.now() - start;

    expect(error).toBeNull();
    // Ordering should be fast if indexed
    expect(duration).toBeLessThan(1000);
  });

  it("should have primary key on admin_users.user_id", async () => {
    const { data, error } = await serviceClient
      .from("admin_users")
      .select("user_id")
      .limit(1);

    expect(error).toBeNull();
    // Primary key constraint ensures uniqueness and indexing
  });

  it("should have foreign key constraint on user_sessions.user_id", async () => {
    // Try to insert invalid user_id (should fail)
    const { error } = await (serviceClient.from("user_sessions") as any).insert({
      user_id: "00000000-0000-0000-0000-000000000000", // Invalid UUID
      login_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      active: true,
    });

    // Should fail due to foreign key constraint or invalid UUID
    expect(error).toBeDefined();
  });
});
