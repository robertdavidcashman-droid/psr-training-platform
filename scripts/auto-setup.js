#!/usr/bin/env node
// Automated setup script for PSR Training Platform

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const checks = {
    supabaseUrl: envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://'),
    supabaseKey: envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ'),
    openaiKey: envContent.includes('OPENAI_API_KEY=sk-'),
  };

  console.log('\n📋 Environment Check:');
  console.log(checks.supabaseUrl ? '✅ Supabase URL configured' : '❌ Supabase URL missing');
  console.log(checks.supabaseKey ? '✅ Supabase Anon Key configured' : '❌ Supabase Anon Key missing');
  console.log(checks.openaiKey ? '✅ OpenAI API Key configured' : '⚠️  OpenAI API Key not configured (optional)');

  return checks.supabaseUrl && checks.supabaseKey;
}

function prepareMigrations() {
  const migration1 = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migration2 = path.join(process.cwd(), 'supabase', 'migrations', '002_new_features.sql');

  if (!fs.existsSync(migration1) || !fs.existsSync(migration2)) {
    console.log('❌ Migration files not found!');
    return false;
  }

  const migration1Content = fs.readFileSync(migration1, 'utf8');
  const migration2Content = fs.readFileSync(migration2, 'utf8');

  // Create easy-to-copy files
  const outputDir = path.join(process.cwd(), 'migrations-ready-to-copy');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, '001_initial_schema.sql'), migration1Content);
  fs.writeFileSync(path.join(outputDir, '002_new_features.sql'), migration2Content);

  console.log('\n✅ Migration files prepared in ./migrations-ready-to-copy/');
  console.log('   Open these files and copy-paste into Supabase SQL Editor\n');
  return true;
}

async function main() {
  console.log('🚀 PSR Training Platform - Automated Setup\n');
  console.log('This script will help automate the setup process.\n');

  // Check environment
  const envOk = await checkEnvFile();
  if (!envOk) {
    console.log('\n⚠️  Please configure .env.local first!');
    rl.close();
    return;
  }

  // Prepare migrations
  prepareMigrations();

  console.log('\n📝 Manual Steps Required (Supabase Dashboard):');
  console.log('1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa');
  console.log('2. Click "SQL Editor"');
  console.log('3. Copy migration files from ./migrations-ready-to-copy/');
  console.log('4. Paste and run each migration');
  console.log('5. Go to Authentication → Settings');
  console.log('6. Add http://localhost:3000 to Site URL');
  console.log('7. Add http://localhost:3000/** to Redirect URLs\n');

  const ready = await question('Have you completed the Supabase setup steps? (y/n): ');
  
  if (ready.toLowerCase() === 'y') {
    console.log('\n✅ Great! You can now start the app with: npm run dev');
    console.log('Then:');
    console.log('1. Go to http://localhost:3000/signup');
    console.log('2. Create your account');
    console.log('3. In Supabase → Table Editor → users table');
    console.log('4. Change your role to "admin"\n');
  } else {
    console.log('\n📋 Please complete the Supabase setup steps first.\n');
  }

  rl.close();
}

main().catch(console.error);

