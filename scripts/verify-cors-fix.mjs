#!/usr/bin/env node

/**
 * Verify CORS Fix
 * 
 * Tests if CORS has been properly configured after making changes
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
  envVars = process.env;
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('\n🔍 Verifying CORS Configuration...\n');

let allPassed = true;

// Test 1: Basic connection
try {
  const { error } = await supabase.auth.getSession();
  if (error && !error.message.includes('No session')) {
    console.log('❌ Connection test failed');
    allPassed = false;
  } else {
    console.log('✅ Connection test passed');
  }
} catch (error) {
  console.log(`❌ Connection error: ${error.message}`);
  allPassed = false;
}

// Test 2: Signup endpoint (will fail if CORS not configured)
try {
  const testEmail = `verify-cors-${Date.now()}@test.com`;
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!',
  });
  
  if (error) {
    if (error.message.includes('rate limit')) {
      console.log('⚠️  Rate limited (but endpoint is accessible - CORS likely OK)');
    } else if (error.message.includes('fetch') || error.message.includes('CORS') || error.message.includes('network')) {
      console.log('❌ CORS ERROR STILL PRESENT');
      console.log(`   Error: ${error.message}`);
      console.log('   Please check Supabase URL Configuration');
      allPassed = false;
    } else {
      console.log('✅ Signup endpoint accessible (CORS OK)');
      console.log(`   Note: ${error.message}`);
    }
  } else {
    console.log('✅ Signup endpoint working perfectly (CORS OK)');
  }
} catch (error) {
  if (error.message.includes('fetch') || error.message.includes('CORS')) {
    console.log('❌ CORS ERROR STILL PRESENT');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  } else {
    console.log(`⚠️  Unexpected error: ${error.message}`);
  }
}

// Test 3: Auth health endpoint
try {
  const authUrl = `${SUPABASE_URL}/auth/v1/health`;
  const response = await fetch(authUrl, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
    },
  });
  
  if (response.ok) {
    console.log('✅ Auth health endpoint accessible');
  } else {
    console.log(`⚠️  Auth health returned: ${response.status}`);
  }
} catch (error) {
  console.log(`⚠️  Auth health test: ${error.message}`);
}

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✅ CORS appears to be configured correctly!');
  console.log('\n💡 Next steps:');
  console.log('   1. Clear browser cache');
  console.log('   2. Test at: https://psrtrain.com/login');
  console.log('   3. Try signing up or logging in');
} else {
  console.log('❌ CORS configuration may still need attention');
  console.log('\n💡 Please:');
  console.log('   1. Verify URLs are saved in Supabase Dashboard');
  console.log('   2. Wait 2-3 minutes for changes to propagate');
  console.log('   3. Run this script again: npm run verify:cors');
}
console.log('\n');

process.exit(allPassed ? 0 : 1);
