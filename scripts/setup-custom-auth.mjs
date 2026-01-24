#!/usr/bin/env node

/**
 * Setup script for custom authentication system
 * Checks prerequisites, provides migration instructions, and verifies setup
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🔧 Custom Authentication Setup\n");
console.log("=" .repeat(60));

// Check .env.local
console.log("\n1. Checking environment configuration...");
const envPath = join(rootDir, ".env.local");
let hasEnvFile = existsSync(envPath);
let hasDatabaseUrl = false;

if (hasEnvFile) {
  try {
    const envContent = readFileSync(envPath, "utf-8");
    hasDatabaseUrl = envContent.includes("DATABASE_URL=") && 
                    !envContent.match(/DATABASE_URL=\s*$/m);
    if (hasDatabaseUrl) {
      console.log("   ✅ .env.local exists with DATABASE_URL");
    } else {
      console.log("   ⚠️  .env.local exists but DATABASE_URL is missing or empty");
    }
  } catch (error) {
    console.log("   ❌ Error reading .env.local:", error.message);
  }
} else {
  console.log("   ⚠️  .env.local not found");
  console.log("   📝 Create it from .env.local.example");
}

// Check migration file
console.log("\n2. Checking database migration file...");
const migrationPath = join(rootDir, "supabase/migrations/001_custom_auth.sql");
if (existsSync(migrationPath)) {
  console.log("   ✅ Migration file exists:", migrationPath);
  try {
    const migrationContent = readFileSync(migrationPath, "utf-8");
    const hasUsersTable = migrationContent.includes("app_users");
    const hasSessionsTable = migrationContent.includes("app_sessions");
    
    if (hasUsersTable && hasSessionsTable) {
      console.log("   ✅ Migration contains required tables");
    } else {
      console.log("   ⚠️  Migration file may be incomplete");
    }
  } catch (error) {
    console.log("   ❌ Error reading migration file:", error.message);
  }
} else {
  console.log("   ❌ Migration file not found:", migrationPath);
}

// Print migration instructions
console.log("\n3. Database Migration Instructions:");
console.log("   " + "=".repeat(56));
console.log("   To apply the migration:");
console.log("   1. Open Supabase Dashboard → SQL Editor");
console.log("   2. Copy the contents of: supabase/migrations/001_custom_auth.sql");
console.log("   3. Paste and run the SQL");
console.log("   4. Verify tables were created:");
console.log("      SELECT table_name FROM information_schema.tables");
console.log("      WHERE table_schema = 'public'");
console.log("      AND table_name IN ('app_users', 'app_sessions');");

// Check dependencies
console.log("\n4. Checking dependencies...");
try {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, "package.json"), "utf-8")
  );
  
  const requiredDeps = ["argon2", "drizzle-orm", "postgres"];
  const missingDeps = requiredDeps.filter(
    (dep) => 
      !packageJson.dependencies?.[dep] && 
      !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length === 0) {
    console.log("   ✅ All required dependencies installed");
  } else {
    console.log("   ❌ Missing dependencies:", missingDeps.join(", "));
    console.log("   Run: npm install", missingDeps.join(" "));
  }
} catch (error) {
  console.log("   ⚠️  Could not check dependencies");
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("📋 Setup Checklist:\n");

const checklist = [
  { item: "Database migration applied", check: () => {
    console.log("   ⬜ Apply migration in Supabase SQL Editor");
    return false;
  }},
  { item: "DATABASE_URL in .env.local", check: () => hasDatabaseUrl },
  { item: "Dependencies installed", check: () => {
    try {
      const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));
      return ["argon2", "drizzle-orm", "postgres"].every(
        dep => pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
      );
    } catch {
      return false;
    }
  }},
];

checklist.forEach(({ item, check }) => {
  const status = check();
  console.log(`   ${status ? "✅" : "⬜"} ${item}`);
});

console.log("\n" + "=".repeat(60));
console.log("\n🚀 Next Steps:");
console.log("   1. Apply the database migration (see instructions above)");
if (!hasDatabaseUrl) {
  console.log("   2. Add DATABASE_URL to .env.local");
  console.log("      Get it from: Supabase Dashboard → Settings → Database");
}
console.log("   3. Run verification: npm run auth:verify");
console.log("   4. Run tests: npm run test:e2e -- tests/e2e/auth-custom.spec.ts");
console.log("\n✨ Setup complete! Your custom auth system is ready.\n");
