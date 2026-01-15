/**
 * Script to make a user admin
 * Usage: node scripts/make-admin.js your-email@example.com
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const email = process.argv[2] || 'robertdavidcashman@gmail.com';

// For admin operations, we need the service role key
// Get it from: Supabase Dashboard → Settings → API → service_role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.log('\n📝 To get your service role key:');
  console.log('1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api');
  console.log('2. Copy the "service_role" key (NOT the anon key)');
  console.log('3. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('4. Run this script again\n');
  console.log('⚠️  WARNING: Service role key has full database access. Only use temporarily!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeAdmin() {
  console.log(`\n🔧 Making ${email} an admin...\n`);

  try {
    // Update the user role
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', email)
      .select();

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }

    if (data && data.length > 0) {
      console.log('✅ Success! User is now an admin:');
      console.log(`   Email: ${data[0].email}`);
      console.log(`   Role: ${data[0].role}`);
      console.log(`   ID: ${data[0].id}\n`);
      console.log('🎉 You can now access admin features in the app!');
    } else {
      console.log(`⚠️  No user found with email: ${email}`);
      console.log('   Make sure you\'ve signed up first at http://localhost:3000/signup\n');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

makeAdmin();

























