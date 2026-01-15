/**
 * Alternative: Script that generates SQL for you to run
 * Usage: node scripts/make-admin-sql.js
 */

const email = process.argv[2] || 'robertdavidcashman@gmail.com';

console.log('\n📋 SQL Query to make yourself admin:\n');
console.log('─'.repeat(60));
console.log(`UPDATE public.users`);
console.log(`SET role = 'admin'`);
console.log(`WHERE email = '${email}';`);
console.log('─'.repeat(60));
console.log('\n📝 Steps to run:');
console.log('1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new');
console.log('2. Copy the SQL above');
console.log('3. Paste and click "Run"');
console.log('4. Refresh your browser\n');

























