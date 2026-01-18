#!/usr/bin/env node

/**
 * Autofix script - automatically fix common issues
 * 1. Run diagnosis
 * 2. Apply fixes based on category
 * 3. Re-run preflight
 */

import { execSync, spawnSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const fixesApplied = [];

function canRun(cmd) {
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getDockerCmd() {
  if (canRun('docker version')) return 'docker';
  const dockerExe = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe';
  if (existsSync(dockerExe)) return `"${dockerExe}"`;
  return null;
}

// Check if Supabase CLI is installed
function hasSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Get Supabase status and extract credentials
function getSupabaseStatus() {
  const result = spawnSync('supabase status --output json', {
    cwd: projectRoot,
    shell: true,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const stdout = String(result.stdout || '');
  const jsonStart = stdout.indexOf('{');
  const jsonEnd = stdout.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null;

  try {
    return JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
  } catch {
    return null;
  }
}

// Start Supabase local
function startSupabase() {
  try {
    console.log('🚀 Starting Supabase...');
    execSync('supabase start', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    fixesApplied.push('Started Supabase local');
    return true;
  } catch (error) {
    console.error('Failed to start Supabase:', error.message);
    return false;
  }
}

// Write .env.local with Supabase credentials
function writeEnvLocal(status) {
  const envPath = join(projectRoot, '.env.local');
  const apiUrl = status?.API_URL || 'http://localhost:54321';
  const anonKey = status?.ANON_KEY || '';

  const envContent = `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

  writeFileSync(envPath, envContent);
  fixesApplied.push('Created/updated .env.local with local Supabase credentials');
}

// Reset database (apply migrations)
function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    execSync('supabase db reset --yes', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    fixesApplied.push('Reset database and applied migrations');
    return true;
  } catch (error) {
    console.error('Failed to reset database:', error.message);
    return false;
  }
}

// Fix ENV issues
function fixEnv(category, diagnosis) {
  if (category !== 'ENV') return false;

  if (!hasSupabaseCLI()) {
    console.log('❌ BLOCKED: Supabase CLI not installed');
    console.log('   Install with: npm install -g supabase');
    return false;
  }

  // Start Supabase if not running
  let status = getSupabaseStatus();
  if (!status || !status.API_URL) {
    if (!startSupabase()) {
      return false;
    }
    status = getSupabaseStatus();
  }

  // Write .env.local
  if (status) {
    writeEnvLocal(status);
    return true;
  }

  return false;
}

// Fix RLS issues (run migrations)
function fixRLS(category, diagnosis) {
  if (category !== 'RLS') return false;

  if (!hasSupabaseCLI()) {
    console.log('❌ BLOCKED: Supabase CLI not installed');
    return false;
  }

  // Reset database to apply migrations
  return resetDatabase();
}

// Fix NETWORK issues (ensure correct URL)
function fixNetwork(category, diagnosis) {
  if (category !== 'NETWORK') return false;

  // Ensure Supabase is running
  let status = getSupabaseStatus();
  if (!status || !status.API_URL) {
    if (!hasSupabaseCLI()) {
      return false;
    }
    if (!startSupabase()) {
      return false;
    }
    status = getSupabaseStatus();
  }

  // Ensure .env.local has correct URL
  if (status) {
    writeEnvLocal(status);
    return true;
  }

  return false;
}

// Main autofix loop
async function main() {
  console.log('🔧 Running autofix...\n');

  // Hard BLOCKED dependency for local Supabase
  const dockerCmd = getDockerCmd();
  if (!dockerCmd) {
    console.log('❌ BLOCKED: Docker CLI not found (docker.exe not on PATH)');
    console.log('   Add to PATH: C:\\Program Files\\Docker\\Docker\\resources\\bin');
    process.exit(1);
  }
  if (!canRun(`${dockerCmd} version`)) {
    console.log('❌ BLOCKED: Docker Desktop installed but engine not running');
    console.log('   Start Docker Desktop and wait for Engine running');
    process.exit(1);
  }

  // Get diagnosis
  let diagnosis = null;
  try {
    const response = await fetch('http://localhost:3000/api/diagnose');
    if (response.ok) {
      diagnosis = await response.json();
    }
  } catch {
    // Diagnosis endpoint may not be available - continue with basic fixes
    console.log('⚠️  Could not fetch diagnosis (dev server may not be running)');
  }

  const category = diagnosis?.category || 'ENV';

  console.log(`📋 Category: ${category}\n`);

  // Apply fixes based on category
  let fixed = false;

  if (category === 'ENV') {
    fixed = fixEnv(category, diagnosis);
  } else if (category === 'RLS') {
    fixed = fixRLS(category, diagnosis);
  } else if (category === 'NETWORK') {
    fixed = fixNetwork(category, diagnosis);
  } else {
    console.log(`ℹ️  No autofix available for category: ${category}`);
  }

  // Summary
  console.log('\n📊 Autofix Summary:');
  if (fixesApplied.length > 0) {
    console.log('✅ Fixes applied:');
    fixesApplied.forEach(f => console.log(`  - ${f}`));
  } else {
    console.log('ℹ️  No fixes applied');
  }

  if (fixed) {
    console.log('\n🔄 Re-running preflight...\n');
    try {
      execSync('npm run preflight', {
        cwd: projectRoot,
        stdio: 'inherit',
      });
    } catch {
      // Preflight may still fail - that's okay, user can run doctor
    }
  }

  process.exit(fixed ? 0 : 1);
}

main().catch(error => {
  console.error('Autofix error:', error);
  process.exit(1);
});
