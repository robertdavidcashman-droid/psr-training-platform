// Setup verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking setup...\n');

// Check .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ');
  const hasOpenAIKey = envContent.includes('OPENAI_API_KEY=sk-');
  
  console.log('✅ .env.local file exists');
  console.log(hasSupabaseUrl ? '✅ Supabase URL configured' : '❌ Supabase URL missing');
  console.log(hasSupabaseKey ? '✅ Supabase Anon Key configured' : '❌ Supabase Anon Key missing');
  console.log(hasOpenAIKey ? '✅ OpenAI API Key configured' : '⚠️  OpenAI API Key not configured (optional)');
} else {
  console.log('❌ .env.local file not found');
}

// Check migrations
const migration1 = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
const migration2 = path.join(process.cwd(), 'supabase', 'migrations', '002_new_features.sql');

console.log('\n📋 Migration files:');
console.log(fs.existsSync(migration1) ? '✅ 001_initial_schema.sql exists' : '❌ 001_initial_schema.sql missing');
console.log(fs.existsSync(migration2) ? '✅ 002_new_features.sql exists' : '❌ 002_new_features.sql missing');

console.log('\n📝 Next steps:');
console.log('1. Run migrations in Supabase SQL Editor');
console.log('2. Configure authentication in Supabase Dashboard');
console.log('3. Start app: npm run dev');
console.log('4. Create user and set as admin');

