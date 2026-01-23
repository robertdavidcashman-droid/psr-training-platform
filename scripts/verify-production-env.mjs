#!/usr/bin/env node

/**
 * Verify Production Environment Variables
 * Checks if NEXT_PUBLIC_SUPABASE_URL is actually set in Production
 */

import { execSync } from 'child_process';

console.log('\n🔍 Verifying Production Environment Variables...\n');

try {
  const output = execSync('npx vercel env ls', { encoding: 'utf-8' });
  const lines = output.split('\n');
  
  let foundUrl = false;
  let foundKey = false;
  
  for (const line of lines) {
    if (line.includes('NEXT_PUBLIC_SUPABASE_URL') && line.includes('Production')) {
      foundUrl = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL found in Production');
      console.log(`   ${line.trim()}`);
    }
    if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') && line.includes('Production')) {
      foundKey = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY found in Production');
    }
  }
  
  if (!foundUrl) {
    console.log('\n❌ NEXT_PUBLIC_SUPABASE_URL NOT FOUND in Production!');
    console.log('\n💡 This is the problem! The URL is missing from Production environment.');
    console.log('\n📋 To Fix:');
    console.log('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('   2. Click "Add New"');
    console.log('   3. Key: NEXT_PUBLIC_SUPABASE_URL');
    console.log('   4. Value: https://cvsawjrtgmsmadtrfwfa.supabase.co');
    console.log('   5. Environment: Production (and Preview/Development if needed)');
    console.log('   6. Save');
    console.log('   7. Redeploy: npx vercel --prod');
    process.exit(1);
  }
  
  if (!foundKey) {
    console.log('\n❌ NEXT_PUBLIC_SUPABASE_ANON_KEY NOT FOUND in Production!');
    process.exit(1);
  }
  
  console.log('\n✅ Both environment variables are set in Production');
  console.log('⚠️  However, if you\'re still seeing errors, the URL value might be incorrect.');
  console.log('   Please verify the URL value in Vercel Dashboard matches:');
  console.log('   https://cvsawjrtgmsmadtrfwfa.supabase.co');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
