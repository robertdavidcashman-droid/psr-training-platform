# Automated Setup Guide

I've created automated setup scripts to help you get started quickly.

## What's Been Automated

✅ Environment variables - Already configured in `.env.local`

## What Still Needs Manual Steps

Unfortunately, some steps require access to the Supabase dashboard which I can't automate directly. However, I've made it as easy as possible:

### Step 1: Run Database Migration (5 minutes)

**Option A: Single Combined Script (EASIEST)**
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the file: `scripts/setup.sql` from your project
5. Copy **ALL** the SQL code
6. Paste into the Supabase SQL Editor
7. Click **"Run"** button (or press Ctrl+Enter)
8. Wait for "Success" message

**Option B: Use Original Migration Files**
- Run `supabase/migrations/001_initial_schema.sql`
- Then run `supabase/migrations/002_new_features.sql`

### Step 2: Configure Authentication (2 minutes)

1. In Supabase dashboard, click **"Authentication"** → **"Settings"**
2. Under **"Site URL"**, enter: `http://localhost:3000`
3. Under **"Redirect URLs"**, click **"Add URL"** and add: `http://localhost:3000/**`
4. Scroll down to **"Email Auth"**
5. For development, turn OFF **"Enable email confirmations"**
6. Click **"Save"**

### Step 3: Start the App

```bash
npm run dev
```

Then open: http://localhost:3000

### Step 4: Create First User & Make Admin

1. Go to http://localhost:3000/signup
2. Fill in the signup form and create account
3. In Supabase dashboard → **"Table Editor"** → **"users"** table
4. Find your user (by email)
5. Change **"role"** from `user` to `admin`
6. Press Enter to save

**OR use SQL:**
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Quick Checklist

- [ ] Run database migration (`scripts/setup.sql`)
- [ ] Configure authentication in Supabase
- [ ] Start app: `npm run dev`
- [ ] Create user account
- [ ] Set user role to admin

## Why Can't Everything Be Automated?

Some operations require:
- Direct database admin access (migrations)
- Supabase dashboard UI (authentication settings)
- Security best practices (we don't want to store service role keys)

The steps above should only take about 10 minutes total!

## Need Help?

If you get stuck, check:
- `SETUP_STEPS.md` - Detailed step-by-step guide
- `NEXT_STEPS.md` - What to do after environment setup
- Supabase Dashboard - For database and auth configuration

Your environment is already fully configured - just run the migration and configure auth, then you're ready to go! 🚀
