#!/usr/bin/env node

/**
 * Authentication Issue Diagnostic Script
 * 
 * Diagnoses authentication/CORS issues and provides automated fixes where possible
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

console.log('\n🔍 Authentication Issue Diagnostic Tool\n');
console.log('='.repeat(60));

// Test 1: Environment Variables
console.log('\n1️⃣ Checking Environment Variables...');
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Missing environment variables!');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('\n💡 Fix: Set these in Vercel → Settings → Environment Variables');
  process.exit(1);
} else {
  console.log('✅ Environment variables are set');
  console.log(`   URL: ${SUPABASE_URL.substring(0, 40)}...`);
  console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
}

// Test 2: Supabase Connection
console.log('\n2️⃣ Testing Supabase Connection...');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

try {
  const { data, error } = await supabase.auth.getSession();
  if (error && !error.message.includes('No session')) {
    console.log(`❌ Connection error: ${error.message}`);
  } else {
    console.log('✅ Supabase connection successful');
  }
} catch (error) {
  console.log(`❌ Connection failed: ${error.message}`);
  process.exit(1);
}

// Test 3: Test Auth Endpoint
console.log('\n3️⃣ Testing Auth Endpoint...');
try {
  const authUrl = `${SUPABASE_URL}/auth/v1/health`;
  const response = await fetch(authUrl, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
    },
  });
  
  if (response.ok) {
    console.log('✅ Auth endpoint is accessible');
  } else {
    console.log(`⚠️  Auth endpoint returned: ${response.status}`);
  }
} catch (error) {
  console.log(`❌ Auth endpoint test failed: ${error.message}`);
}

// Test 4: CORS Check
console.log('\n4️⃣ Checking CORS Configuration...');
console.log('⚠️  CORS must be configured in Supabase Dashboard');
console.log('\n📋 Required Configuration:');
console.log('   1. Go to: https://supabase.com/dashboard');
console.log(`   2. Select project: ${SUPABASE_URL.split('//')[1].split('.')[0]}`);
console.log('   3. Navigate to: Authentication → URL Configuration');
console.log('   4. Add Site URL: https://psrtrain.com');
console.log('   5. Add Redirect URLs:');
console.log('      - https://psrtrain.com/dashboard');
console.log('      - https://psrtrain.com/**');
console.log('      - https://*.vercel.app/**');

// Test 5: Test Signup (if not rate limited)
console.log('\n5️⃣ Testing Signup Endpoint...');
try {
  const testEmail = `test-cors-${Date.now()}@test.com`;
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!',
  });
  
  if (error) {
    if (error.message.includes('rate limit')) {
      console.log('⚠️  Rate limited (this is normal)');
    } else if (error.message.includes('CORS') || error.message.includes('fetch')) {
      console.log('❌ CORS ERROR DETECTED!');
      console.log('   This confirms the CORS configuration issue.');
      console.log('   Follow the steps in section 4 above.');
    } else {
      console.log(`⚠️  Signup test: ${error.message}`);
    }
  } else {
    console.log('✅ Signup endpoint is working');
  }
} catch (error) {
  if (error.message.includes('fetch') || error.message.includes('CORS')) {
    console.log('❌ CORS ERROR DETECTED!');
    console.log('   This confirms the CORS configuration issue.');
  } else {
    console.log(`⚠️  Signup test error: ${error.message}`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Diagnostic Summary');
console.log('='.repeat(60));
console.log('\n✅ Next Steps:');
console.log('   1. Configure CORS in Supabase Dashboard (see section 4)');
console.log('   2. Wait 1-2 minutes for changes to propagate');
console.log('   3. Clear browser cache');
console.log('   4. Test again at https://psrtrain.com/login');
console.log('\n💡 If issues persist, check:');
console.log('   - Browser console (F12) for specific error messages');
console.log('   - Vercel environment variables are set for Production');
console.log('   - Supabase project is not paused');
console.log('\n');
