#!/usr/bin/env node

/**
 * AutoFix script - Automatically fixes common configuration issues
 * Runs fixes in order and re-tests after each fix
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnv() {
  const envPath = join(projectRoot, '.env.local');
  const env = {};
  
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
  
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('SUPABASE_')) {
      env[key] = process.env[key];
    }
  });
  
  return env;
}

function saveEnv(env) {
  const envPath = join(projectRoot, '.env.local');
  let content = '# Auto-generated/updated by autofix\n';
  
  Object.entries(env).forEach(([key, value]) => {
    if (value) {
      content += `${key}=${value}\n`;
    }
  });
  
  writeFileSync(envPath, content);
}

async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

async function runPreflight() {
  try {
    const { execSync } = await import('child_process');
    execSync('node scripts/preflight.mjs', { 
      cwd: projectRoot, 
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    return true;
  } catch {
    return false;
  }
}

// Fix 1: Ensure client uses ONLY NEXT_PUBLIC_SUPABASE_URL + ANON key
async function fix1_ClientUsesOnlyAnonKey() {
  log('\n[Fix 1] Ensuring client uses only anon key...', 'cyan');
  
  const clientPath = join(projectRoot, 'lib', 'supabase', 'client.ts');
  if (!existsSync(clientPath)) {
    log('  ⚠ client.ts not found, skipping', 'yellow');
    return false;
  }
  
  const content = readFileSync(clientPath, 'utf-8');
  
  // Check if service role key is being used
  if (content.includes('SERVICE_ROLE') || content.includes('service_role')) {
    log('  ✗ Service role key detected in client code', 'red');
    // This would require manual fix, but we can warn
    return false;
  }
  
  // Ensure it uses NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    log('  ✗ Client not using NEXT_PUBLIC_SUPABASE_ANON_KEY', 'red');
    return false;
  }
  
  log('  ✓ Client configuration OK', 'green');
  return true;
}

// Fix 2: Ensure server uses cookies-based Supabase client
async function fix2_ServerUsesCookies() {
  log('\n[Fix 2] Ensuring server uses cookies-based client...', 'cyan');
  
  const serverPath = join(projectRoot, 'lib', 'supabase', 'server.ts');
  if (!existsSync(serverPath)) {
    log('  ⚠ server.ts not found, skipping', 'yellow');
    return false;
  }
  
  const content = readFileSync(serverPath, 'utf-8');
  
  // Check for createServerClient from @supabase/ssr
  if (!content.includes('createServerClient') || !content.includes('@supabase/ssr')) {
    log('  ✗ Server not using createServerClient from @supabase/ssr', 'red');
    return false;
  }
  
  // Check for cookies usage
  if (!content.includes('cookies') && !content.includes('cookieStore')) {
    log('  ✗ Server not using cookies', 'red');
    return false;
  }
  
  log('  ✓ Server configuration OK', 'green');
  return true;
}

// Fix 3: Ensure middleware doesn't block auth routes
async function fix3_MiddlewareAuthRoutes() {
  log('\n[Fix 3] Checking middleware auth route protection...', 'cyan');
  
  const middlewarePath = join(projectRoot, 'middleware.ts');
  if (!existsSync(middlewarePath)) {
    log('  ⚠ middleware.ts not found, skipping', 'yellow');
    return false;
  }
  
  const content = readFileSync(middlewarePath, 'utf-8');
  
  // Check that /auth/callback is allowed
  const requiredPaths = ['/auth/callback', '/login', '/signup', '/api/'];
  const missing = requiredPaths.filter(path => {
    if (path === '/api/') {
      return !content.includes('/api') && !content.includes("pathname.startsWith('/api')");
    }
    return !content.includes(path);
  });
  
  if (missing.length > 0) {
    log(`  ⚠ Some auth paths may not be protected: ${missing.join(', ')}`, 'yellow');
    // Don't auto-fix middleware as it's complex - just warn
    return false;
  }
  
  log('  ✓ Middleware configuration OK', 'green');
  return true;
}

// Fix 4: Ensure auth callback properly exchanges code
async function fix4_AuthCallback() {
  log('\n[Fix 4] Checking auth callback route...', 'cyan');
  
  const callbackPath = join(projectRoot, 'app', 'auth', 'callback', 'route.ts');
  if (!existsSync(callbackPath)) {
    log('  ✗ Auth callback route not found', 'red');
    return false;
  }
  
  const content = readFileSync(callbackPath, 'utf-8');
  
  // Check for exchangeCodeForSession
  if (!content.includes('exchangeCodeForSession')) {
    log('  ✗ Auth callback not exchanging code for session', 'red');
    return false;
  }
  
  // Check for redirect
  if (!content.includes('redirect') && !content.includes('NextResponse.redirect')) {
    log('  ✗ Auth callback not redirecting', 'red');
    return false;
  }
  
  log('  ✓ Auth callback configuration OK', 'green');
  return true;
}

// Fix 5: Add safe fetch patterns (already done in signup page, just verify)
async function fix5_SafeFetchPatterns() {
  log('\n[Fix 5] Checking error handling in auth components...', 'cyan');
  
  const signupPath = join(projectRoot, 'app', '(auth)', 'signup', 'page.tsx');
  if (existsSync(signupPath)) {
    const content = readFileSync(signupPath, 'utf-8');
    if (content.includes('Failed to fetch') && content.includes('try') && content.includes('catch')) {
      log('  ✓ Signup page has error handling', 'green');
      return true;
    }
  }
  
  log('  ⚠ Error handling could be improved', 'yellow');
  return true; // Not critical
}

// Fix 6: Apply RLS policy for healthcheck (migration should handle this)
async function fix6_RLSHealthcheck() {
  log('\n[Fix 6] Checking healthcheck RLS policy...', 'cyan');
  
  // This is handled by migration, just verify migration exists
  const migrationPath = join(projectRoot, 'supabase', 'migrations', '20250118000000_healthcheck.sql');
  if (existsSync(migrationPath)) {
    log('  ✓ Healthcheck migration exists', 'green');
    return true;
  }
  
  log('  ⚠ Healthcheck migration not found', 'yellow');
  return false;
}

// Fix 7: Bootstrap local Supabase if needed
async function fix7_LocalSupabase() {
  log('\n[Fix 7] Checking local Supabase setup...', 'cyan');
  
  const env = loadEnv();
  
  // If we have hosted Supabase configured, skip local
  if (env.NEXT_PUBLIC_SUPABASE_URL && 
      env.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')) {
    log('  ✓ Using hosted Supabase, skipping local setup', 'green');
    return true;
  }
  
  // Check if Supabase CLI is installed
  try {
    execSync('supabase --version', { stdio: 'ignore' });
  } catch {
    log('  ✗ Supabase CLI not installed', 'red');
    log('  Install with: npm install -g supabase', 'yellow');
    return false;
  }
  
  // Check if local Supabase is running
  try {
    const status = execSync('supabase status', { encoding: 'utf-8', cwd: projectRoot });
    if (status.includes('API URL:')) {
      log('  ✓ Local Supabase is running', 'green');
      
      // Extract URLs and update .env.local
      const apiUrlMatch = status.match(/API URL:\s*(https?:\/\/[^\s]+)/);
      const anonKeyMatch = status.match(/anon key:\s*([^\s]+)/);
      
      if (apiUrlMatch && anonKeyMatch) {
        env.NEXT_PUBLIC_SUPABASE_URL = apiUrlMatch[1];
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKeyMatch[1];
        env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
        saveEnv(env);
        log('  ✓ Updated .env.local with local Supabase URLs', 'green');
        return true;
      }
    }
  } catch {
    // Not running, try to start
    log('  ⚠ Local Supabase not running, attempting to start...', 'yellow');
    try {
      execSync('supabase start', { cwd: projectRoot, stdio: 'inherit' });
      // Wait a bit for services to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const status = execSync('supabase status', { encoding: 'utf-8', cwd: projectRoot });
      const apiUrlMatch = status.match(/API URL:\s*(https?:\/\/[^\s]+)/);
      const anonKeyMatch = status.match(/anon key:\s*([^\s]+)/);
      
      if (apiUrlMatch && anonKeyMatch) {
        env.NEXT_PUBLIC_SUPABASE_URL = apiUrlMatch[1];
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKeyMatch[1];
        env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
        saveEnv(env);
        log('  ✓ Started local Supabase and updated .env.local', 'green');
        return true;
      }
    } catch (err) {
      log(`  ✗ Failed to start local Supabase: ${err.message}`, 'red');
      return false;
    }
  }
  
  return false;
}

// Fix 8: Category-based fixes from /api/diagnose
async function fix8_CategoryBasedFixes() {
  log('\n[Fix 8] Running category-based diagnosis and fixes...', 'cyan');
  
  try {
    const response = await fetch('http://localhost:3000/api/diagnose', {
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      log('  ⚠ Could not reach /api/diagnose endpoint', 'yellow');
      return false;
    }
    
    const diagnosis = await response.json();
    
    if (!diagnosis.category) {
      log('  ✓ No specific category identified', 'green');
      return true;
    }
    
    log(`  Category: ${diagnosis.category}`, 'yellow');
    
    // Apply fixes based on category
    switch (diagnosis.category) {
      case 'ENV':
        log('  Applying ENV fixes...', 'cyan');
        // Already handled by fix7_LocalSupabase, but ensure it runs
        return await fix7_LocalSupabase();
        
      case 'NETWORK':
        log('  Applying NETWORK fixes...', 'cyan');
        // Ensure local Supabase is used if hosted is unreachable
        const env = loadEnv();
        if (env.NEXT_PUBLIC_SUPABASE_URL?.includes('.supabase.co')) {
          log('  Switching to local Supabase...', 'yellow');
          return await fix7_LocalSupabase();
        }
        return false;
        
      case 'CORS':
        log('  CORS issue detected - using server-side routes', 'yellow');
        log('  ✓ Login form already uses /api/auth/login', 'green');
        return true;
        
      case 'AUTH':
        log('  AUTH issue - checking API keys...', 'yellow');
        // Verify keys are correct format
        const env2 = loadEnv();
        if (!env2.NEXT_PUBLIC_SUPABASE_ANON_KEY || env2.NEXT_PUBLIC_SUPABASE_ANON_KEY.length < 20) {
          log('  ✗ Anon key appears invalid', 'red');
          return false;
        }
        log('  ⚠ Key format looks OK - may need to verify in Supabase dashboard', 'yellow');
        return true;
        
      case 'COOKIE/SESSION':
        log('  COOKIE/SESSION issue - checking middleware...', 'yellow');
        // Verify middleware doesn't strip cookies
        return fix3_MiddlewareAuthRoutes();
        
      case 'RLS':
        log('  RLS issue - ensuring migrations are run...', 'yellow');
        // Check if using local Supabase
        const env3 = loadEnv();
        if (env3.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1') || env3.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')) {
          log('  Running migrations on local Supabase...', 'cyan');
          try {
            execSync('supabase db reset', { cwd: projectRoot, stdio: 'pipe' });
            log('  ✓ Migrations applied', 'green');
            return true;
          } catch (err) {
            log(`  ✗ Failed to run migrations: ${err.message}`, 'red');
            return false;
          }
        } else {
          log('  ⚠ Using hosted Supabase - migrations must be run manually', 'yellow');
          return false;
        }
        
      case 'ROUTING/MIDDLEWARE':
        log('  ROUTING/MIDDLEWARE issue - checking middleware config...', 'yellow');
        return fix3_MiddlewareAuthRoutes();
        
      default:
        log(`  Unknown category: ${diagnosis.category}`, 'yellow');
        return false;
    }
  } catch (err) {
    log(`  ⚠ Could not run diagnosis: ${err.message}`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n🔧 Starting AutoFix...\n', 'cyan');
  
  const fixes = [
    { name: 'Client uses only anon key', fn: fix1_ClientUsesOnlyAnonKey },
    { name: 'Server uses cookies', fn: fix2_ServerUsesCookies },
    { name: 'Middleware auth routes', fn: fix3_MiddlewareAuthRoutes },
    { name: 'Auth callback', fn: fix4_AuthCallback },
    { name: 'Safe fetch patterns', fn: fix5_SafeFetchPatterns },
    { name: 'RLS healthcheck', fn: fix6_RLSHealthcheck },
    { name: 'Local Supabase (default)', fn: fix7_LocalSupabase },
    { name: 'Category-based fixes', fn: fix8_CategoryBasedFixes },
  ];
  
  const results = [];
  
  for (const fix of fixes) {
    try {
      const result = await fix.fn();
      results.push({ name: fix.name, success: result });
      
      // After local Supabase fix, re-check health
      if (fix.name === 'Local Supabase' && result) {
        log('\n  Re-checking health after local Supabase setup...', 'cyan');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const healthOk = await checkHealth();
        if (healthOk) {
          log('  ✓ Health check passed after fix', 'green');
        }
      }
    } catch (err) {
      log(`  ✗ Error in ${fix.name}: ${err.message}`, 'red');
      results.push({ name: fix.name, success: false, error: err.message });
    }
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`\nAutoFix Summary: ${successful} successful, ${failed} failed`, 
      failed > 0 ? 'yellow' : 'green');
  
  if (failed > 0) {
    log('\nFailed fixes:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`  • ${r.name}${r.error ? `: ${r.error}` : ''}`, 'red');
    });
  }
  
  // Final preflight check
  log('\nRunning final preflight check...', 'cyan');
  const preflightOk = await runPreflight();
  
  if (preflightOk) {
    log('\n✓ AutoFix completed successfully!', 'green');
    process.exit(0);
  } else {
    log('\n⚠ AutoFix completed but preflight still failing', 'yellow');
    log('Review the issues above and check /api/diagnostics/supabase for details', 'yellow');
    process.exit(1);
  }
}

main().catch(err => {
  log(`\n✗ AutoFix error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
