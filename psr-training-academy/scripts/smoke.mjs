#!/usr/bin/env node

/**
 * Smoke tests - Quick integration tests against running app
 */

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

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

async function testHealthEndpoint() {
  log('Testing /api/health...', 'cyan');
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status === 'ok') {
      log('  ✓ Health endpoint OK', 'green');
      return true;
    } else {
      log(`  ⚠ Health check issues: ${data.actionable_error || 'See details in response'}`, 'yellow');
      // Still return true - endpoint is reachable, just has issues
      return true;
    }
  } catch (err) {
    if (err.message.includes('fetch') || err.name === 'TypeError') {
      log('  ✗ App not running or unreachable', 'red');
      log('  Start with: npm run dev', 'yellow');
    } else {
      log(`  ✗ Error: ${err.message}`, 'red');
    }
    return false;
  }
}

async function testDiagnosticsEndpoint() {
  log('Testing /api/diagnostics/supabase...', 'cyan');
  try {
    const response = await fetch(`${baseUrl}/api/diagnostics/supabase`, {
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status === 'ok') {
      log('  ✓ Diagnostics endpoint OK', 'green');
      return true;
    } else {
      log('  ⚠ Diagnostics found issues:', 'yellow');
      data.likelyCauses?.forEach(cause => {
        log(`    • ${cause.cause}: ${cause.fix}`, 'yellow');
      });
      // Still return true - endpoint is reachable and providing diagnostics
      return true;
    }
  } catch (err) {
    log(`  ✗ Error: ${err.message}`, 'red');
    return false;
  }
}

async function testPublicPages() {
  log('Testing public pages...', 'cyan');
  const pages = ['/', '/login', '/signup'];
  let allOk = true;
  
  for (const page of pages) {
    try {
      const response = await fetch(`${baseUrl}${page}`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        log(`  ✓ ${page} accessible`, 'green');
      } else {
        log(`  ✗ ${page} returned ${response.status}`, 'red');
        allOk = false;
      }
    } catch (err) {
      log(`  ✗ ${page} failed: ${err.message}`, 'red');
      allOk = false;
    }
  }
  
  return allOk;
}

async function main() {
  log('\n💨 Running Smoke Tests...\n', 'cyan');
  
  const results = {
    health: false,
    diagnostics: false,
    publicPages: false,
  };
  
  results.health = await testHealthEndpoint();
  results.diagnostics = await testDiagnosticsEndpoint();
  results.publicPages = await testPublicPages();
  
  log('\n' + '='.repeat(50), 'cyan');
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    log('\n✅ All smoke tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some smoke tests failed', 'red');
    process.exit(1);
  }
}

main().catch(err => {
  log(`\n✗ Smoke test error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
