#!/usr/bin/env node

/**
 * Authentication System Setup Script
 * 
 * This script helps automate the setup of the Supabase authentication system.
 * Run this after deploying to verify everything is configured correctly.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔐 Authentication System Setup Check\n');

// Check environment variables
console.log('📋 Checking Environment Variables...\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let allEnvVarsPresent = true;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${envVar}: MISSING`);
    allEnvVarsPresent = false;
  }
}

console.log('');

// Check SQL files exist
console.log('📄 Checking SQL Setup Files...\n');

const sqlFiles = [
  'docs/auth_schema.sql',
  'docs/auth_rls.sql'
];

let allFilesExist = true;

for (const file of sqlFiles) {
  try {
    const content = readFileSync(join(projectRoot, file), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() && !l.trim().startsWith('--')).length;
    console.log(`  ✅ ${file}: ${lines} lines`);
  } catch (error) {
    console.log(`  ❌ ${file}: NOT FOUND`);
    allFilesExist = false;
  }
}

console.log('');

// Generate combined SQL script
console.log('📝 Generating Combined SQL Script...\n');

try {
  const schema = readFileSync(join(projectRoot, 'docs/auth_schema.sql'), 'utf-8');
  const rls = readFileSync(join(projectRoot, 'docs/auth_rls.sql'), 'utf-8');
  
  const combined = `-- Combined Authentication Setup Script
-- Generated automatically - run this in your Supabase SQL Editor
-- This combines auth_schema.sql and auth_rls.sql

${schema}

${rls}

-- After running this script, you need to manually add your admin user:
-- INSERT INTO admin_users (user_id, email)
-- VALUES ('your-user-id-from-auth-users', 'your-email@example.com');
-- 
-- To find your user_id:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Find your user and copy the UUID
-- 3. Run the INSERT statement above with that UUID
`;

  const outputPath = join(projectRoot, 'docs/auth_setup_combined.sql');
  writeFileSync(outputPath, combined, 'utf-8');
  console.log(`  ✅ Created: docs/auth_setup_combined.sql`);
  console.log(`     You can copy this entire file into Supabase SQL Editor\n`);
} catch (error) {
  console.log(`  ❌ Failed to generate combined script: ${error.message}\n`);
}

// Summary
console.log('📊 Setup Summary:\n');

if (allEnvVarsPresent && allFilesExist) {
  console.log('  ✅ All checks passed!');
  console.log('\n📋 Next Steps:');
  console.log('  1. Run the SQL script in Supabase SQL Editor:');
  console.log('     - Open Supabase Dashboard > SQL Editor');
  console.log('     - Copy contents of docs/auth_setup_combined.sql');
  console.log('     - Paste and execute');
  console.log('  2. Add your admin user:');
  console.log('     - Go to Authentication > Users');
  console.log('     - Copy your user UUID');
  console.log('     - Run: INSERT INTO admin_users (user_id, email) VALUES (\'your-uuid\', \'your-email@example.com\');');
  console.log('  3. Verify environment variables in Vercel:');
  console.log('     - Go to Vercel Dashboard > Your Project > Settings > Environment Variables');
  console.log('     - Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
} else {
  console.log('  ⚠️  Some checks failed. Please fix the issues above.');
  if (!allEnvVarsPresent) {
    console.log('\n  To set environment variables in Vercel:');
    console.log('  npx vercel env add NEXT_PUBLIC_SUPABASE_URL');
    console.log('  npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

console.log('');
