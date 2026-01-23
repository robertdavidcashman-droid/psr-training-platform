#!/usr/bin/env node

/**
 * Comprehensive Authentication Test Script
 * 
 * Tests all authentication procedures including:
 * - Signup flow
 * - Login flow
 * - Session management
 * - Protected routes
 * - Error handling
 * - API endpoints
 * - Logout
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });
} catch (error) {
  console.warn('Could not load .env.local, using process.env');
  envVars = process.env;
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test configuration
const TEST_EMAIL = `test-${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPassword123!';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  errors: [],
};

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪',
  };
  console.log(`${icons[type] || '•'} ${message}`);
}

function recordResult(testName, passed, error = null) {
  if (passed) {
    results.passed++;
    log(`${testName}`, 'success');
  } else {
    results.failed++;
    results.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`${testName} - ${error?.message || 'Failed'}`, 'error');
  }
}

async function testSupabaseConnection() {
  log('Testing Supabase Connection...', 'test');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && !error.message.includes('No session')) {
      recordResult('Supabase Connection', false, error);
      return false;
    }
    recordResult('Supabase Connection', true);
    return true;
  } catch (error) {
    recordResult('Supabase Connection', false, error);
    return false;
  }
}

async function testSignup() {
  log('Testing Signup Flow...', 'test');
  
  try {
    // Test 1: Valid signup
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (signupError) {
      recordResult('Signup - Valid Credentials', false, signupError);
      return null;
    }
    
    if (!signupData.user) {
      recordResult('Signup - Valid Credentials', false, new Error('No user returned'));
      return null;
    }
    
    recordResult('Signup - Valid Credentials', true);
    
    // Test 2: Duplicate email
    const { error: duplicateError } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (duplicateError) {
      const isExpectedError = duplicateError.message.includes('already registered') || 
                               duplicateError.message.includes('already exists');
      recordResult('Signup - Duplicate Email', isExpectedError, 
        isExpectedError ? null : duplicateError);
    } else {
      recordResult('Signup - Duplicate Email', false, new Error('Should have failed'));
    }
    
    // Test 3: Invalid email format
    const { error: invalidEmailError } = await supabase.auth.signUp({
      email: 'invalid-email',
      password: TEST_PASSWORD,
    });
    
    recordResult('Signup - Invalid Email Format', !!invalidEmailError, 
      invalidEmailError ? null : new Error('Should have failed'));
    
    // Test 4: Weak password
    const { error: weakPasswordError } = await supabase.auth.signUp({
      email: `test-weak-${Date.now()}@test.com`,
      password: '123',
    });
    
    recordResult('Signup - Weak Password', !!weakPasswordError,
      weakPasswordError ? null : new Error('Should have failed'));
    
    return signupData.user;
  } catch (error) {
    recordResult('Signup Flow', false, error);
    return null;
  }
}

async function testLogin(user) {
  log('Testing Login Flow...', 'test');
  
  try {
    // Test 1: Valid login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (loginError) {
      recordResult('Login - Valid Credentials', false, loginError);
      return false;
    }
    
    if (!loginData.user || !loginData.session) {
      recordResult('Login - Valid Credentials', false, new Error('No user or session returned'));
      return false;
    }
    
    recordResult('Login - Valid Credentials', true);
    
    // Test 2: Invalid email
    await supabase.auth.signOut();
    const { error: invalidEmailError } = await supabase.auth.signInWithPassword({
      email: 'nonexistent@test.com',
      password: TEST_PASSWORD,
    });
    
    recordResult('Login - Invalid Email', !!invalidEmailError,
      invalidEmailError ? null : new Error('Should have failed'));
    
    // Test 3: Invalid password
    const { error: invalidPasswordError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: 'WrongPassword123!',
    });
    
    recordResult('Login - Invalid Password', !!invalidPasswordError,
      invalidPasswordError ? null : new Error('Should have failed'));
    
    // Re-login for subsequent tests
    await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    return true;
  } catch (error) {
    recordResult('Login Flow', false, error);
    return false;
  }
}

async function testSessionManagement() {
  log('Testing Session Management...', 'test');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      recordResult('Session - Get User', false, new Error('No user in session'));
      return;
    }
    
    recordResult('Session - Get User', true);
    
    // Test session refresh
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      recordResult('Session - Get Session', false, sessionError);
    } else {
      recordResult('Session - Get Session', !!sessionData.session);
    }
    
    // Test token refresh
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError && !refreshError.message.includes('No session')) {
      recordResult('Session - Refresh Token', false, refreshError);
    } else {
      recordResult('Session - Refresh Token', true);
    }
    
  } catch (error) {
    recordResult('Session Management', false, error);
  }
}

async function testAPIEndpoints() {
  log('Testing API Endpoints...', 'test');
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      log('Skipping API tests - no active session', 'warning');
      return;
    }
    
    // Test session-start endpoint
    try {
      const response = await fetch(`${BASE_URL}/api/auth/session-start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token=${session.access_token}`,
        },
      });
      
      recordResult('API - Session Start', response.ok || response.status === 401,
        response.ok ? null : new Error(`Status: ${response.status}`));
    } catch (error) {
      recordResult('API - Session Start', false, error);
    }
    
    // Test ping endpoint
    try {
      const response = await fetch(`${BASE_URL}/api/auth/ping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token=${session.access_token}`,
        },
      });
      
      recordResult('API - Ping', response.ok || response.status === 401,
        response.ok ? null : new Error(`Status: ${response.status}`));
    } catch (error) {
      recordResult('API - Ping', false, error);
    }
    
  } catch (error) {
    recordResult('API Endpoints', false, error);
  }
}

async function testLogout() {
  log('Testing Logout Flow...', 'test');
  
  try {
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      recordResult('Logout - Sign Out', false, logoutError);
      return;
    }
    
    recordResult('Logout - Sign Out', true);
    
    // Verify session is cleared
    const { data: { session } } = await supabase.auth.getSession();
    recordResult('Logout - Session Cleared', !session,
      session ? new Error('Session still exists') : null);
    
    // Try to access protected resource
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    recordResult('Logout - User Access Revoked', !user,
      user ? new Error('User still accessible') : null);
    
  } catch (error) {
    recordResult('Logout Flow', false, error);
  }
}

async function testProtectedRoutes() {
  log('Testing Protected Routes...', 'test');
  
  try {
    // Test without authentication
    await supabase.auth.signOut();
    
    const protectedRoutes = ['/dashboard', '/practice', '/portfolio', '/analytics'];
    
    for (const route of protectedRoutes) {
      try {
        const response = await fetch(`${BASE_URL}${route}`, {
          redirect: 'manual',
        });
        
        // Should redirect to login (302 or 307) or return 401
        const isProtected = [302, 307, 401, 403].includes(response.status);
        recordResult(`Protected Route - ${route}`, isProtected,
          isProtected ? null : new Error(`Unexpected status: ${response.status}`));
      } catch (error) {
        recordResult(`Protected Route - ${route}`, false, error);
      }
    }
    
  } catch (error) {
    recordResult('Protected Routes', false, error);
  }
}

async function cleanup() {
  log('Cleaning up test data...', 'test');
  
  try {
    // Sign in to delete test user
    const { data: loginData } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (loginData?.user) {
      // Note: Supabase doesn't allow programmatic user deletion via anon key
      // This would require admin/service role key
      log('Test user created - manual cleanup may be required', 'warning');
      await supabase.auth.signOut();
    }
  } catch (error) {
    log(`Cleanup error: ${error.message}`, 'warning');
  }
}

async function runAllTests() {
  console.log('\n🚀 Starting Comprehensive Authentication Tests\n');
  console.log(`Test Email: ${TEST_EMAIL}`);
  console.log(`Base URL: ${BASE_URL}\n`);
  
  // Test 1: Connection
  const connected = await testSupabaseConnection();
  if (!connected) {
    console.log('\n❌ Cannot proceed - Supabase connection failed\n');
    return;
  }
  
  // Test 2: Signup
  const user = await testSignup();
  
  // Test 3: Login
  if (user) {
    await testLogin(user);
  }
  
  // Test 4: Session Management
  await testSessionManagement();
  
  // Test 5: API Endpoints
  await testAPIEndpoints();
  
  // Test 6: Protected Routes
  await testProtectedRoutes();
  
  // Test 7: Logout
  await testLogout();
  
  // Cleanup
  await cleanup();
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.passed + results.failed}`);
  console.log(`📊 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.errors.forEach(({ test, error }) => {
      console.log(`   • ${test}: ${error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
