#!/usr/bin/env node

/**
 * Verification script for custom authentication system
 * Checks environment variables, database connection, and runs tests
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

let errors = [];
let warnings = [];

console.log("🔍 Verifying Custom Authentication System...\n");

// Check environment variables
console.log("1. Checking environment variables...");
const requiredEnvVars = ["DATABASE_URL"];
const optionalEnvVars = {
  AUTH_COOKIE_NAME: "app_session",
  AUTH_SESSION_DAYS: "14",
  NODE_ENV: "development",
};

try {
  // Try to load .env.local
  const envPath = join(rootDir, ".env.local");
  let envContent = "";
  try {
    envContent = readFileSync(envPath, "utf-8");
  } catch (e) {
    warnings.push(".env.local file not found - you may need to create it");
  }

  // Check required vars
  for (const varName of requiredEnvVars) {
    const regex = new RegExp(`^${varName}=`, "m");
    const hasInFile = !!envContent.match(regex);
    const hasInEnv = !!process.env[varName];
    if (!hasInFile && !hasInEnv) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Check optional vars (warn if missing)
  for (const [varName, defaultValue] of Object.entries(optionalEnvVars)) {
    const regex = new RegExp(`^${varName}=`, "m");
    if (!envContent.match(regex) && !process.env[varName]) {
      warnings.push(
        `Optional environment variable ${varName} not set (default: ${defaultValue})`
      );
    }
  }
} catch (error) {
  errors.push(`Error checking environment variables: ${error.message}`);
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("   ✅ All environment variables configured\n");
} else {
  if (warnings.length > 0) {
    warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
  }
  if (errors.length > 0) {
    errors.forEach((e) => console.log(`   ❌ ${e}`));
  }
  console.log();
}

// Check database migration
console.log("2. Checking database migration...");
const migrationPath = join(rootDir, "supabase/migrations/001_custom_auth.sql");
try {
  const migrationContent = readFileSync(migrationPath, "utf-8");
  if (migrationContent.includes("app_users") && migrationContent.includes("app_sessions")) {
    console.log("   ✅ Migration file exists and contains required tables\n");
  } else {
    errors.push("Migration file is missing required tables");
  }
} catch (error) {
  errors.push(`Migration file not found: ${migrationPath}`);
  console.log();
}

// Print migration instructions
console.log("3. Database Migration Instructions:");
console.log("   To apply the migration, run this SQL in your Supabase SQL Editor:");
console.log("   (Or use Supabase CLI: supabase db push)");
console.log(`   File: ${migrationPath}\n`);

// If DATABASE_URL is present, auto-apply migration (idempotent).
if (process.env.DATABASE_URL) {
  console.log("3b. Applying migration automatically (DATABASE_URL detected)...\n");
  try {
    execSync("node scripts/auth-migrate.mjs", { stdio: "inherit", cwd: rootDir });
    console.log();
  } catch (error) {
    errors.push("Failed to apply migration automatically");
    console.log();
  }
}

// Check if Playwright is installed
console.log("4. Checking test dependencies...");
try {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, "package.json"), "utf-8")
  );
  const hasPlaywright =
    packageJson.dependencies?.["@playwright/test"] ||
    packageJson.devDependencies?.["@playwright/test"];

  if (hasPlaywright) {
    console.log("   ✅ Playwright is installed\n");
  } else {
    warnings.push("Playwright not found - E2E tests may not run");
    console.log();
  }
} catch (error) {
  warnings.push("Could not check test dependencies");
  console.log();
}

// Run E2E tests (required)
if (errors.length === 0) {
  console.log("5. Running E2E tests...");
  try {
    console.log("   Running: npm run test:e2e -- tests/e2e/auth.spec.ts\n");
    // Use a dedicated E2E port to avoid clashing with dev servers on 3000.
    execSync("npm run test:e2e -- tests/e2e/auth.spec.ts", {
      stdio: "inherit",
      cwd: rootDir,
      env: {
        ...process.env,
        E2E_PORT: process.env.E2E_PORT || "3100",
      },
    });
    console.log("\n   ✅ E2E tests passed\n");
  } catch (error) {
    errors.push("E2E tests failed - see output above");
    console.log();
  }
} else {
  console.log("5. Skipping E2E tests (missing required env vars)\n");
}

// Summary
console.log("=" .repeat(50));
if (errors.length === 0) {
  console.log("✅ Verification PASSED");
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`   - ${w}`));
  }
  process.exit(0);
} else {
  console.log("❌ Verification FAILED");
  console.log(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.log(`   - ${e}`));
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`   - ${w}`));
  }
  process.exit(1);
}
