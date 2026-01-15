/**
 * Automated Setup Script for PSR Training Platform
 * This script attempts to automate the setup process where possible
 */

const https = require('https');
const readline = require('readline');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.log('Please make sure .env.local file exists with your credentials');
  process.exit(1);
}

console.log('🚀 PSR Training Platform - Automated Setup\n');
console.log('This script will guide you through the remaining setup steps.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('✅ Environment variables configured');
  console.log(`   Supabase URL: ${SUPABASE_URL}\n`);

  console.log('📋 Manual Steps Required:\n');
  console.log('1. Database Migration:');
  console.log('   - Open Supabase Dashboard: https://supabase.com/dashboard');
  console.log('   - Go to SQL Editor');
  console.log('   - Open: scripts/setup.sql');
  console.log('   - Copy ALL content and paste into SQL Editor');
  console.log('   - Click "Run"\n');

  const runMigration = await question('Have you run the database migration? (y/n): ');
  
  if (runMigration.toLowerCase() !== 'y') {
    console.log('\n⚠️  Please run the migration first, then run this script again.');
    rl.close();
    return;
  }

  console.log('\n2. Authentication Configuration:');
  console.log('   - Go to Authentication → Settings');
  console.log('   - Site URL: http://localhost:3000');
  console.log('   - Redirect URLs: http://localhost:3000/**\n');

  const configAuth = await question('Have you configured authentication? (y/n): ');
  
  if (configAuth.toLowerCase() !== 'y') {
    console.log('\n⚠️  Please configure authentication first.');
    rl.close();
    return;
  }

  console.log('\n✅ Setup Complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Go to: http://localhost:3000/signup');
  console.log('3. Create your account');
  console.log('4. In Supabase Table Editor → users table, change your role to "admin"');
  console.log('\n🎉 Your app is ready to use!');

  rl.close();
}

main().catch(console.error);

























