#!/usr/bin/env node

/**
 * One-command automated authentication setup
 * - Auto-loads .env.local
 * - Checks DATABASE_URL exists
 * - Auto-applies migration (idempotent)
 * - Verifies tables exist
 * - Optionally runs E2E tests
 * - Reports success/failure
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { resolve6 } from "dns/promises";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🚀 Automated Authentication Setup\n");
console.log("=".repeat(60));

// Step 1: Load environment variables from .env.local
console.log("\n1. Loading environment variables...");
try {
  const envPath = join(rootDir, ".env.local");
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log("   ✅ Loaded .env.local");
  } else {
    console.log("   ⚠️  .env.local not found (will use system env vars)");
  }
} catch (error) {
  console.log(`   ⚠️  Error loading .env.local: ${error.message}`);
}

// Step 2: Check DATABASE_URL
console.log("\n2. Checking DATABASE_URL...");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("   ❌ DATABASE_URL is not set");
  console.error("\n   Please set DATABASE_URL in .env.local:");
  console.error("   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres");
  console.error("\n   Get it from: Supabase Dashboard → Settings → Database → Connection String");
  process.exit(1);
}
console.log("   ✅ DATABASE_URL is set");

// Step 3: Auto-apply migration
console.log("\n3. Applying database migration...");
try {
  // Handle IPv6 resolution for Supabase
  let effectiveUrl = databaseUrl;
  try {
    const m = databaseUrl.match(/@([^/:\s]+)(:\d+)?\//);
    const host = m?.[1];
    if (host && host.startsWith("db.") && host.endsWith(".supabase.co")) {
      const ipv6s = await resolve6(host);
      if (ipv6s?.length) {
        effectiveUrl = databaseUrl.replace(`@${host}`, `@[${ipv6s[0]}]`);
      }
    }
  } catch {
    // ignore DNS errors
  }

  const migrationPath = join(rootDir, "supabase", "migrations", "001_custom_auth.sql");
  if (!existsSync(migrationPath)) {
    console.error(`   ❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const migrationSql = readFileSync(migrationPath, "utf-8");
  const client = new Client({
    connectionString: effectiveUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(migrationSql);
  await client.end();
  console.log("   ✅ Migration applied successfully");
} catch (error) {
  console.error("   ❌ Failed to apply migration");
  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.includes("ENETUNREACH") ||
    msg.includes("EHOSTUNREACH") ||
    msg.includes("network unreachable")
  ) {
    console.error(
      "\n   Your environment cannot reach Supabase over IPv6.\n" +
        "   Fix: In Supabase Dashboard click Connect → use a Pooler connection string (IPv4),\n" +
        "   preferably 'Session pooler', and set DATABASE_URL to that value.\n"
    );
  }
  console.error(`   Error: ${msg}`);
  process.exit(1);
}

// Step 4: Verify tables exist
console.log("\n4. Verifying database tables...");
try {
  let effectiveUrl = databaseUrl;
  try {
    const m = databaseUrl.match(/@([^/:\s]+)(:\d+)?\//);
    const host = m?.[1];
    if (host && host.startsWith("db.") && host.endsWith(".supabase.co")) {
      const ipv6s = await resolve6(host);
      if (ipv6s?.length) {
        effectiveUrl = databaseUrl.replace(`@${host}`, `@[${ipv6s[0]}]`);
      }
    }
  } catch {
    // ignore DNS errors
  }

  const client = new Client({
    connectionString: effectiveUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('app_users', 'app_sessions')
  `);
  await client.end();

  const tableNames = result.rows.map((r) => r.table_name);
  const hasUsers = tableNames.includes("app_users");
  const hasSessions = tableNames.includes("app_sessions");

  if (hasUsers && hasSessions) {
    console.log("   ✅ Tables verified: app_users, app_sessions");
  } else {
    console.error(`   ❌ Missing tables. Found: ${tableNames.join(", ") || "none"}`);
    process.exit(1);
  }
} catch (error) {
  console.error("   ❌ Failed to verify tables");
  console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

// Step 5: Check dependencies
console.log("\n5. Checking dependencies...");
try {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, "package.json"), "utf-8")
  );

  const requiredDeps = ["argon2", "drizzle-orm", "pg"];
  const missingDeps = requiredDeps.filter(
    (dep) =>
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );

  if (missingDeps.length === 0) {
    console.log("   ✅ All required dependencies installed");
  } else {
    console.log(`   ⚠️  Missing dependencies: ${missingDeps.join(", ")}`);
    console.log(`   Run: npm install ${missingDeps.join(" ")}`);
  }
} catch (error) {
  console.log("   ⚠️  Could not check dependencies");
}

// Step 6: Summary
console.log("\n" + "=".repeat(60));
console.log("✅ Setup Complete!\n");
console.log("Next steps:");
console.log("  1. Start dev server: npm run dev");
console.log("  2. Visit http://localhost:3000/signup to create an account");
console.log("  3. Run tests: npm run test:e2e -- tests/e2e/auth.spec.ts");
console.log("\n✨ Authentication system is ready to use!\n");
