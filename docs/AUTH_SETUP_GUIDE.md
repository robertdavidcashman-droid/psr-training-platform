# Authentication System Setup Guide

This guide will help you set up the Supabase authentication system automatically.

## Quick Setup (Automated)

### Step 1: Run Setup Check
```bash
npm run setup:auth
```

This will:
- ✅ Check if environment variables are configured
- ✅ Verify SQL setup files exist
- ✅ Generate a combined SQL script (`docs/auth_setup_combined.sql`)

### Step 2: Set Up Database in Supabase

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Navigate to: SQL Editor

2. **Run the Combined SQL Script**
   - Open `docs/auth_setup_combined.sql` in your project
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run" to execute

3. **Add Your Admin User**
   - Go to: Authentication > Users
   - Find your user account and copy the UUID
   - Run this SQL in the SQL Editor:
   ```sql
   INSERT INTO admin_users (user_id, email)
   VALUES ('your-user-uuid-here', 'your-email@example.com');
   ```

### Step 3: Set Environment Variables in Vercel

#### Option A: Using the Setup Script (Recommended)
If you have `.env.local` with your Supabase credentials:

```bash
npm run setup:vercel-env --use-local
```

This will automatically set the environment variables in Vercel for all environments.

#### Option B: Manual Setup via Vercel CLI
```bash
# Set Supabase URL
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
npx vercel env add NEXT_PUBLIC_SUPABASE_URL development

# Set Supabase Anon Key
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

#### Option C: Via Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: Settings > Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon public key

### Step 4: Redeploy

After setting environment variables, redeploy:

```bash
npx vercel --prod
```

## Verification

### Test the Login System

1. **Test Login Flow**
   - Navigate to `/login`
   - Enter your credentials
   - Should redirect to `/dashboard`

2. **Test Session Ping**
   - Stay on a protected page for 60+ seconds
   - Check Supabase: `user_sessions` table
   - `last_seen_at` should update

3. **Test Admin Dashboard**
   - Navigate to `/admin/sessions`
   - Should see all user sessions
   - Test "Force Logout" button

4. **Test Logout**
   - Click logout button
   - Should redirect to home page
   - Session should be marked inactive in database

## Troubleshooting

### Environment Variables Not Working

If environment variables aren't being picked up:

1. **Check Vercel Dashboard**
   - Ensure variables are set for the correct environment (production/preview/development)
   - Variables must be set for the environment you're deploying to

2. **Redeploy After Setting Variables**
   - Environment variables are only available after redeployment
   - Run: `npx vercel --prod`

### Database Setup Issues

If SQL scripts fail:

1. **Check Supabase Permissions**
   - Ensure you're using the SQL Editor (not the Table Editor)
   - You need admin/service role permissions

2. **Check for Existing Tables**
   - If tables already exist, the scripts use `CREATE TABLE IF NOT EXISTS`
   - This is safe to run multiple times

3. **Verify RLS Policies**
   - After running the RLS script, check: Settings > Database > Row Level Security
   - Both `user_sessions` and `admin_users` should have RLS enabled

### Admin Access Issues

If you can't access `/admin/sessions`:

1. **Verify Admin User**
   ```sql
   SELECT * FROM admin_users WHERE user_id = 'your-user-id';
   ```

2. **Check User ID**
   - Go to: Authentication > Users
   - Copy the exact UUID (not the email)
   - Use this UUID in the `admin_users` table

## Files Created

- `docs/auth_setup_combined.sql` - Combined SQL script (auto-generated)
- `scripts/setup-auth.mjs` - Setup verification script
- `scripts/setup-vercel-env.mjs` - Vercel environment variable setup script

## Next Steps

After setup is complete:

1. ✅ Test login/logout flow
2. ✅ Verify session tracking works
3. ✅ Test admin dashboard access
4. ✅ Monitor session ping updates
5. ✅ Test force logout functionality

## Support

If you encounter issues:

1. Check the setup script output: `npm run setup:auth`
2. Verify environment variables are set correctly
3. Check Supabase logs for database errors
4. Check Vercel deployment logs for runtime errors
