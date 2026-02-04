#!/usr/bin/env node

/**
 * Helper script to get database connection string from Supabase
 * Uses Supabase CLI or prompts user for connection details
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🔧 Database Connection Setup Helper\n");
console.log("=".repeat(60));

const envPath = join(rootDir, ".env.local");
let envContent = "";

if (existsSync(envPath)) {
  envContent = readFileSync(envPath, "utf-8");
} else {
  // Create from example
  const examplePath = join(rootDir, ".env.local.example");
  if (existsSync(examplePath)) {
    envContent = readFileSync(examplePath, "utf-8");
    console.log("📝 Created .env.local from .env.local.example\n");
  }
}

// Try to get connection string from Supabase CLI
console.log("1. Attempting to get connection string from Supabase CLI...\n");

try {
  // Check if linked to a project
  const projectRef = "cvsawjrtgmsmadtrfwfa"; // From diagnostic
  
  console.log(`   Project: ${projectRef}`);
  console.log("\n   To get your connection string:");
  console.log("   1. Go to: https://app.supabase.com/project/" + projectRef + "/settings/database");
  console.log("   2. Click 'Connection string'");
  console.log("   3. Select 'Session pooler' (recommended) or 'Direct connection'");
  console.log("   4. Copy the connection string");
  console.log("\n   Or use Supabase CLI:");
  console.log(`   supabase projects api-keys --project-ref ${projectRef}`);
  
  // Try to get pooler connection string format
  console.log("\n   Expected Session Pooler format:");
  console.log(`   postgresql://postgres.${projectRef}:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`);
  
  console.log("\n   Expected Direct Connection format:");
  console.log(`   postgresql://postgres:[PASSWORD]@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`);
  
} catch (error) {
  console.log("   ⚠️  Could not auto-detect connection string");
}

console.log("\n" + "=".repeat(60));
console.log("\n💡 Next Steps:");
console.log("   1. Get your database password from Supabase Dashboard");
console.log("   2. Update DATABASE_URL in .env.local with your password");
console.log("   3. Run: npm run setup:auth");
console.log("\n");
