#!/usr/bin/env node

/**
 * Comprehensive Authentication Auto-Diagnostic Tool
 * 
 * Automatically diagnoses all potential authentication issues and provides
 * specific fix instructions for each detected problem.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
  });
} catch (error) {
  // .env.local doesn't exist, use process.env
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Diagnostic results
const results = {
  timestamp: new Date().toISOString(),
  environment: 'unknown',
  checks: {},
  issues: [],
  fixes: [],
  healthy: false,
};

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪',
    fix: '🔧',
  };
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    test: '\x1b[35m',
    fix: '\x1b[33m',
    reset: '\x1b[0m',
  };
  
  if (process.stdout.isTTY) {
    console.log(`${colors[type] || ''}${icons[type] || '•'} ${message}${colors.reset}`);
  } else {
    console.log(`${icons[type] || '•'} ${message}`);
  }
}

// Check 1: Environment Detection
function checkEnvironment() {
  log('Detecting environment...', 'test');
  
  if (process.env.VERCEL) {
    results.environment = 'vercel';
    log('Environment: Vercel (Production/Preview)', 'success');
  } else if (process.env.NODE_ENV === 'development') {
    results.environment = 'local';
    log('Environment: Local Development', 'success');
  } else {
    results.environment = 'unknown';
    log('Environment: Unknown', 'warning');
  }
  
  results.checks.environment = results.environment;
}

// Check 2: Environment Variables
function checkEnvironmentVariables() {
  log('\n1️⃣ Checking Environment Variables...', 'test');
  results.checks.envVars = {
    url: { exists: !!SUPABASE_URL, valid: false },
    key: { exists: !!SUPABASE_ANON_KEY, valid: false },
  };
  
  if (!SUPABASE_URL) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL is missing', 'error');
    results.issues.push({
      type: 'ConfigError',
      severity: 'critical',
      message: 'NEXT_PUBLIC_SUPABASE_URL environment variable is not set',
    });
    results.fixes.push({
      priority: 1,
      action: 'Set NEXT_PUBLIC_SUPABASE_URL',
      instructions: [
        'For Vercel: Go to Project Settings → Environment Variables',
        'Add NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL',
        'Get URL from: Supabase Dashboard → Settings → API → Project URL',
        'Redeploy after adding the variable',
      ],
    });
  } else {
    log('✅ NEXT_PUBLIC_SUPABASE_URL is set', 'success');
    
    // Validate URL format
    try {
      const url = new URL(SUPABASE_URL);
      if (!url.protocol.startsWith('http')) {
        log('⚠️  URL doesn\'t use http/https protocol', 'warning');
        results.issues.push({
          type: 'ConfigError',
          severity: 'high',
          message: 'Supabase URL must use http or https protocol',
        });
      } else {
        results.checks.envVars.url.valid = true;
        log(`   URL: ${SUPABASE_URL.substring(0, 50)}...`, 'info');
      }
      
      if (!url.hostname.includes('supabase')) {
        log('⚠️  URL doesn\'t appear to be a Supabase URL', 'warning');
      }
    } catch (error) {
      log('❌ Invalid URL format', 'error');
      results.issues.push({
        type: 'ConfigError',
        severity: 'critical',
        message: 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL',
      });
      results.fixes.push({
        priority: 1,
        action: 'Fix Supabase URL format',
        instructions: [
          'URL must be a valid HTTP/HTTPS URL',
          'Format: https://your-project.supabase.co',
          'Get correct URL from: Supabase Dashboard → Settings → API',
        ],
      });
    }
  }
  
  if (!SUPABASE_ANON_KEY) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', 'error');
    results.issues.push({
      type: 'ConfigError',
      severity: 'critical',
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set',
    });
    results.fixes.push({
      priority: 1,
      action: 'Set NEXT_PUBLIC_SUPABASE_ANON_KEY',
      instructions: [
        'For Vercel: Go to Project Settings → Environment Variables',
        'Add NEXT_PUBLIC_SUPABASE_ANON_KEY with your Supabase anon key',
        'Get key from: Supabase Dashboard → Settings → API → anon public',
        'Redeploy after adding the variable',
      ],
    });
  } else {
    log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set', 'success');
    
    // Validate key format (basic checks)
    if (SUPABASE_ANON_KEY.length < 50) {
      log('⚠️  Key seems too short (expected ~100+ characters)', 'warning');
      results.issues.push({
        type: 'ConfigError',
        severity: 'medium',
        message: 'Supabase anon key seems invalid (too short)',
      });
    } else {
      results.checks.envVars.key.valid = true;
    }
    
    if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
      log('⚠️  Key doesn\'t appear to be a JWT token', 'warning');
    }
  }
  
  const envValid = results.checks.envVars.url.exists && 
                   results.checks.envVars.key.exists &&
                   results.checks.envVars.url.valid &&
                   results.checks.envVars.key.valid;
  
  if (!envValid) {
    log('\n❌ Environment variables check failed', 'error');
    return false;
  }
  
  log('\n✅ Environment variables are valid', 'success');
  return true;
}

// Check 3: Network Connectivity
async function checkNetworkConnectivity() {
  log('\n2️⃣ Testing Network Connectivity...', 'test');
  
  if (!SUPABASE_URL) {
    log('⚠️  Skipping - URL not configured', 'warning');
    return false;
  }
  
  try {
    // Test basic connectivity
    const testUrl = `${SUPABASE_URL}/rest/v1/`;
    log(`   Testing: ${testUrl.substring(0, 60)}...`, 'info');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(testUrl, {
        method: 'HEAD',
        headers: {
          'apikey': SUPABASE_ANON_KEY || '',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 404) {
        log('✅ Network connectivity successful', 'success');
        results.checks.network = { connected: true, status: response.status };
        return true;
      } else {
        log(`⚠️  Unexpected status: ${response.status}`, 'warning');
        results.checks.network = { connected: false, status: response.status };
        results.issues.push({
          type: 'NetworkError',
          severity: 'high',
          message: `Supabase endpoint returned status ${response.status}`,
        });
        return false;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    const errorMsg = error.message || String(error);
    log(`❌ Network connectivity failed: ${errorMsg}`, 'error');
    results.checks.network = { connected: false, error: errorMsg };
    
    if (errorMsg.includes('timeout') || errorMsg.includes('aborted')) {
      results.issues.push({
        type: 'TimeoutError',
        severity: 'high',
        message: 'Connection to Supabase timed out',
      });
      results.fixes.push({
        priority: 2,
        action: 'Fix network timeout',
        instructions: [
          'Check your internet connection',
          'Check if Supabase is available: https://status.supabase.com',
          'Try disabling VPN or proxy if active',
          'Check firewall settings',
        ],
      });
    } else if (errorMsg.includes('DNS') || errorMsg.includes('ENOTFOUND')) {
      results.issues.push({
        type: 'NetworkError',
        severity: 'critical',
        message: 'DNS resolution failed - cannot resolve Supabase domain',
      });
      results.fixes.push({
        priority: 1,
        action: 'Fix DNS resolution',
        instructions: [
          'Verify Supabase URL is correct',
          'Check DNS settings',
          'Try accessing Supabase dashboard to verify URL',
        ],
      });
    } else {
      results.issues.push({
        type: 'NetworkError',
        severity: 'high',
        message: `Network error: ${errorMsg}`,
      });
      results.fixes.push({
        priority: 2,
        action: 'Fix network connectivity',
        instructions: [
          'Check your internet connection',
          'Verify Supabase URL is correct',
          'Check browser/network console for detailed errors',
        ],
      });
    }
    
    return false;
  }
}

// Check 4: CORS Configuration
async function checkCORS() {
  log('\n3️⃣ Checking CORS Configuration...', 'test');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('⚠️  Skipping - Missing credentials', 'warning');
    return false;
  }
  
  try {
    // Try a preflight-like request
    const authUrl = `${SUPABASE_URL}/auth/v1/health`;
    const response = await fetch(authUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
      },
    });
    
    const corsHeader = response.headers.get('Access-Control-Allow-Origin');
    
    if (corsHeader) {
      log('✅ CORS headers present', 'success');
      results.checks.cors = { configured: true };
      return true;
    } else {
      log('⚠️  CORS headers not detected (may be normal)', 'warning');
      results.checks.cors = { configured: false };
      // Don't mark as error - CORS might be configured but not visible in OPTIONS
      return true;
    }
  } catch (error) {
    // CORS check failure doesn't necessarily mean CORS is misconfigured
    log('⚠️  Could not verify CORS configuration', 'warning');
    results.checks.cors = { configured: false, note: 'Could not verify' };
    
    // If we have network connectivity but CORS check fails, it might be a CORS issue
    if (results.checks.network?.connected) {
      results.issues.push({
        type: 'CORSError',
        severity: 'high',
        message: 'Possible CORS configuration issue',
      });
      results.fixes.push({
        priority: 2,
        action: 'Configure CORS in Supabase',
        instructions: [
          'Go to Supabase Dashboard → Settings → API',
          'Add your domain to allowed origins:',
          '  - For production: https://psrtrain.com',
          '  - For Vercel: https://*.vercel.app',
          '  - For local: http://localhost:3000',
          'Wait 1-2 minutes for changes to propagate',
          'Clear browser cache and try again',
        ],
      });
    }
    
    return false;
  }
}

// Check 5: Authentication Endpoint
async function checkAuthEndpoint() {
  log('\n4️⃣ Testing Authentication Endpoint...', 'test');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('⚠️  Skipping - Missing credentials', 'warning');
    return false;
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Try to get session (lightweight operation)
    const { error } = await Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ]);
    
    // Error is OK if it's just "no session" - that means endpoint works
    if (error && !error.message.includes('session') && !error.message.includes('JWT')) {
      log(`⚠️  Auth endpoint returned error: ${error.message}`, 'warning');
      results.checks.authEndpoint = { healthy: false, error: error.message };
      
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        results.issues.push({
          type: 'CORSError',
          severity: 'high',
          message: 'CORS error detected when accessing auth endpoint',
        });
      }
      
      return false;
    }
    
    log('✅ Authentication endpoint is accessible', 'success');
    results.checks.authEndpoint = { healthy: true };
    return true;
  } catch (error) {
    const errorMsg = error.message || String(error);
    log(`❌ Auth endpoint test failed: ${errorMsg}`, 'error');
    results.checks.authEndpoint = { healthy: false, error: errorMsg };
    
    if (errorMsg.includes('Timeout')) {
      results.issues.push({
        type: 'TimeoutError',
        severity: 'high',
        message: 'Authentication endpoint timed out',
      });
    } else {
      results.issues.push({
        type: 'NetworkError',
        severity: 'high',
        message: `Auth endpoint error: ${errorMsg}`,
      });
    }
    
    return false;
  }
}

// Check 6: Test Signup (if not rate limited)
async function checkSignupEndpoint() {
  log('\n5️⃣ Testing Signup Endpoint...', 'test');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('⚠️  Skipping - Missing credentials', 'warning');
    return false;
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const testEmail = `test-diagnostic-${Date.now()}@example.com`;
    
    const { data, error } = await Promise.race([
      supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      ),
    ]);
    
    if (error) {
      if (error.message.includes('rate limit')) {
        log('⚠️  Rate limited (this is normal)', 'warning');
        results.checks.signup = { accessible: true, rateLimited: true };
        return true;
      } else if (error.message.includes('CORS') || error.message.includes('fetch')) {
        log('❌ CORS ERROR DETECTED!', 'error');
        results.checks.signup = { accessible: false, corsError: true };
        results.issues.push({
          type: 'CORSError',
          severity: 'critical',
          message: 'CORS error when attempting signup',
        });
        results.fixes.push({
          priority: 1,
          action: 'Fix CORS configuration',
          instructions: [
            'Go to Supabase Dashboard → Authentication → URL Configuration',
            'Add Site URL: https://psrtrain.com (or your domain)',
            'Add Redirect URLs:',
            '  - https://psrtrain.com/dashboard',
            '  - https://psrtrain.com/**',
            '  - https://*.vercel.app/** (for previews)',
            'Wait 1-2 minutes and try again',
          ],
        });
        return false;
      } else {
        log(`⚠️  Signup test: ${error.message}`, 'warning');
        results.checks.signup = { accessible: true, error: error.message };
        return true; // Endpoint is accessible, just has an error
      }
    } else {
      log('✅ Signup endpoint is working', 'success');
      results.checks.signup = { accessible: true, success: true };
      return true;
    }
  } catch (error) {
    const errorMsg = error.message || String(error);
    
    if (errorMsg.includes('fetch') || errorMsg.includes('CORS')) {
      log('❌ CORS ERROR DETECTED!', 'error');
      results.checks.signup = { accessible: false, corsError: true };
      results.issues.push({
        type: 'CORSError',
        severity: 'critical',
        message: 'CORS error when attempting signup',
      });
      return false;
    } else if (errorMsg.includes('Timeout')) {
      log('❌ Signup endpoint timed out', 'error');
      results.checks.signup = { accessible: false, timeout: true };
      return false;
    } else {
      log(`❌ Signup test error: ${errorMsg}`, 'error');
      results.checks.signup = { accessible: false, error: errorMsg };
      return false;
    }
  }
}

// Generate summary and recommendations
function generateSummary() {
  log('\n' + '='.repeat(60), 'info');
  log('📊 Diagnostic Summary', 'test');
  log('='.repeat(60), 'info');
  
  const criticalIssues = results.issues.filter(i => i.severity === 'critical');
  const highIssues = results.issues.filter(i => i.severity === 'high');
  const mediumIssues = results.issues.filter(i => i.severity === 'medium');
  
  if (criticalIssues.length > 0) {
    log(`\n❌ Critical Issues: ${criticalIssues.length}`, 'error');
    criticalIssues.forEach(issue => {
      log(`   • ${issue.message}`, 'error');
    });
  }
  
  if (highIssues.length > 0) {
    log(`\n⚠️  High Priority Issues: ${highIssues.length}`, 'warning');
    highIssues.forEach(issue => {
      log(`   • ${issue.message}`, 'warning');
    });
  }
  
  if (mediumIssues.length > 0) {
    log(`\n⚠️  Medium Priority Issues: ${mediumIssues.length}`, 'warning');
    mediumIssues.forEach(issue => {
      log(`   • ${issue.message}`, 'warning');
    });
  }
  
  if (results.issues.length === 0) {
    log('\n✅ No issues detected!', 'success');
    results.healthy = true;
  } else {
    results.healthy = false;
  }
  
  // Sort fixes by priority
  const sortedFixes = results.fixes.sort((a, b) => a.priority - b.priority);
  
  if (sortedFixes.length > 0) {
    log('\n🔧 Recommended Fixes:', 'fix');
    sortedFixes.forEach((fix, index) => {
      log(`\n${index + 1}. ${fix.action}`, 'fix');
      fix.instructions.forEach(instruction => {
        log(`   • ${instruction}`, 'info');
      });
    });
  }
  
  log('\n' + '='.repeat(60), 'info');
}

// Save results to JSON
function saveResults() {
  const outputPath = join(__dirname, '..', 'auth-diagnostic-results.json');
  try {
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    log(`\n💾 Results saved to: auth-diagnostic-results.json`, 'info');
  } catch (error) {
    log(`\n⚠️  Could not save results: ${error.message}`, 'warning');
  }
}

// Main diagnostic flow
async function runDiagnostics() {
  console.log('\n🔍 Authentication Auto-Diagnostic Tool\n');
  console.log('='.repeat(60));
  
  checkEnvironment();
  
  const envValid = checkEnvironmentVariables();
  if (!envValid) {
    generateSummary();
    saveResults();
    process.exit(1);
  }
  
  await checkNetworkConnectivity();
  await checkCORS();
  await checkAuthEndpoint();
  await checkSignupEndpoint();
  
  generateSummary();
  saveResults();
  
  // Exit with appropriate code
  process.exit(results.healthy ? 0 : 1);
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('Fatal error:', error);
  results.issues.push({
    type: 'UnknownError',
    severity: 'critical',
    message: `Fatal diagnostic error: ${error.message}`,
  });
  generateSummary();
  saveResults();
  process.exit(1);
});
