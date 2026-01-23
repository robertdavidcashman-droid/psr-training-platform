#!/usr/bin/env node

/**
 * Check Vercel Environment Variable URL
 * Helps identify if there's a typo in the Supabase URL
 */

import { execSync } from 'child_process';

console.log('\n🔍 Checking Vercel Environment Variables...\n');

try {
  // Get environment variables (this will show encrypted values, but we can check the pattern)
  const output = execSync('npx vercel env ls --json', { encoding: 'utf-8' });
  const envs = JSON.parse(output);
  
  const supabaseUrl = envs.find(e => e.key === 'NEXT_PUBLIC_SUPABASE_URL' && e.target === 'production');
  
  if (!supabaseUrl) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL not found in Production environment');
    console.log('\n💡 Fix: Add the environment variable in Vercel Dashboard');
    process.exit(1);
  }
  
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL found in Production');
  console.log(`   Created: ${supabaseUrl.created || 'Unknown'}`);
  console.log(`   Note: Value is encrypted, but based on error logs, check for typo`);
  console.log('\n⚠️  IMPORTANT: Based on error logs, the URL appears to be:');
  console.log('   Current (WRONG): cvsawjrtgmsmadtfwfa.supabase.co');
  console.log('   Should be:       cvsawjrtgmsmadtrfwfa.supabase.co');
  console.log('   (Missing "r" in the project ID)');
  console.log('\n📋 To Fix:');
  console.log('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
  console.log('   2. Find NEXT_PUBLIC_SUPABASE_URL for Production');
  console.log('   3. Verify it is: https://cvsawjrtgmsmadtrfwfa.supabase.co');
  console.log('   4. If incorrect, update it and redeploy');
  console.log('   5. Or run: npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production');
  console.log('   6. Then: npx vercel env add NEXT_PUBLIC_SUPABASE_URL production');
  
} catch (error) {
  console.error('Error checking environment variables:', error.message);
  process.exit(1);
}
