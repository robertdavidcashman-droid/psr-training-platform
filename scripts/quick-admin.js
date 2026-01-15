/**
 * Quick script to generate SQL for making yourself admin
 * Usage: node scripts/quick-admin.js [email]
 */

const email = process.argv[2] || 'robertdavidcashman@gmail.com';

const sql = `UPDATE public.users 
SET role = 'admin' 
WHERE email = '${email}';`;

console.log('\n' + '='.repeat(70));
console.log('📋 Copy this SQL and run it in Supabase SQL Editor:');
console.log('='.repeat(70));
console.log('\n' + sql);
console.log('\n' + '='.repeat(70));
console.log('\n🔗 Quick link:');
console.log('https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new');
console.log('\n📝 Steps:');
console.log('1. Click the link above (or copy-paste SQL into SQL Editor)');
console.log('2. Click "Run"');
console.log('3. Refresh your browser - you\'re now an admin! ✅\n');

























