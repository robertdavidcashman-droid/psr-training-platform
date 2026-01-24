#!/usr/bin/env node

/**
 * Helper script to display migration SQL for easy copy-paste
 * Also provides instructions for applying it
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const migrationPath = join(rootDir, "supabase/migrations/001_custom_auth.sql");

console.log("📋 Custom Auth Migration SQL\n");
console.log("=" .repeat(60));
console.log("\nTo apply this migration:\n");
console.log("1. Go to: https://supabase.com/dashboard");
console.log("2. Select your project");
console.log("3. Navigate to: SQL Editor");
console.log("4. Click 'New Query'");
console.log("5. Copy the SQL below and paste it");
console.log("6. Click 'Run' (or press Ctrl+Enter)\n");
console.log("=" .repeat(60));
console.log("\n");

try {
  const migrationSQL = readFileSync(migrationPath, "utf-8");
  console.log(migrationSQL);
  console.log("\n" + "=" .repeat(60));
  console.log("\n✅ Migration SQL ready to copy!\n");
  console.log("After running, verify with:");
  console.log("  SELECT table_name FROM information_schema.tables");
  console.log("  WHERE table_schema = 'public'");
  console.log("  AND table_name IN ('app_users', 'app_sessions');\n");
} catch (error) {
  console.error("❌ Error reading migration file:", error.message);
  process.exit(1);
}
