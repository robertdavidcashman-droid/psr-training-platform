#!/usr/bin/env node

/**
 * Test database connection with current DATABASE_URL
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const envPath = join(rootDir, ".env.local");
if (!existsSync(envPath)) {
  console.error("❌ .env.local not found");
  process.exit(1);
}

const envContent = readFileSync(envPath, "utf-8");
const match = envContent.match(/^DATABASE_URL=(.*)$/m);
if (!match) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const databaseUrl = match[1].trim().replace(/^["']|["']$/g, "");

console.log("🔍 Testing database connection...\n");
console.log("Connection string:", databaseUrl.replace(/:[^:@]+@/, ":***@"));

try {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  await client.connect();
  const result = await client.query("SELECT version()");
  console.log("\n✅ Connection successful!");
  console.log("PostgreSQL version:", result.rows[0].version.split(",")[0]);
  await client.end();
  process.exit(0);
} catch (error) {
  console.error("\n❌ Connection failed!");
  const msg = error instanceof Error ? error.message : String(error);
  
  if (msg.includes("password authentication failed")) {
    console.error("\n💡 Password authentication failed. Possible causes:");
    console.error("   1. Wrong password");
    console.error("   2. Wrong port (Session Pooler uses 6543, Direct uses 5432)");
    console.error("   3. Wrong connection string format");
    console.error("\n   Check your connection string in Supabase Dashboard:");
    console.error("   https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database");
  } else if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")) {
    console.error("\n💡 DNS resolution failed. Check your hostname.");
  } else if (msg.includes("timeout")) {
    console.error("\n💡 Connection timeout. Check your network/firewall.");
  }
  
  console.error("\nError:", msg);
  process.exit(1);
}
