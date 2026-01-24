# Custom Auth Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Apply Database Migration

```bash
# View the migration SQL
npm run auth:migration

# Then:
# 1. Copy the SQL output
# 2. Go to Supabase Dashboard → SQL Editor
# 3. Paste and run the SQL
```

**OR** manually:
1. Open `supabase/migrations/001_custom_auth.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Run it

### Step 2: Configure Environment

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your DATABASE_URL
# Get it from: Supabase Dashboard → Settings → Database → Connection String
```

**Required Environment Variable:**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Verify Setup

```bash
# Check setup status
npm run auth:setup

# Run verification
npm run auth:verify
```

### Step 4: Test It!

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm run test:e2e -- tests/e2e/auth.spec.ts
```

**OR** test manually:
1. Visit `http://localhost:3000/signup`
2. Create an account
3. You should be redirected to `/dashboard`
4. Logout and login again
5. Verify session persists after refresh

## 📋 Commands Reference

| Command | Description |
|---------|------------|
| `npm run auth:setup` | Check setup status and show checklist |
| `npm run auth:migration` | Display migration SQL for copy-paste |
| `npm run auth:verify` | Verify environment and migration |
| `npm run auth:verify:test` | Verify + run E2E tests |

## 🔍 Troubleshooting

### "DATABASE_URL is not set"
- Make sure `.env.local` exists and contains `DATABASE_URL`
- Get the connection string from Supabase Dashboard → Settings → Database

### "Port 3000 already in use"
- Stop any running dev server: `Ctrl+C` in the terminal running `npm run dev`
- Or use a different port: `PORT=3001 npm run dev`

### "Migration failed"
- Check you're using the correct Supabase project
- Verify you have permission to create tables
- Check Supabase SQL Editor for error messages

### "Tests failing"
- Ensure migration is applied (check Supabase Dashboard)
- Verify `DATABASE_URL` is correct
- Check that tables exist: `app_users` and `app_sessions`

## ✅ Verification Checklist

- [ ] Migration applied (tables `app_users` and `app_sessions` exist)
- [ ] `DATABASE_URL` set in `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors
- [ ] Can signup a new account
- [ ] Can login with credentials
- [ ] Session persists after refresh
- [ ] Logout works correctly

## 🎯 What Changed?

**Removed:**
- Supabase Auth (`supabase.auth.*`)
- OAuth providers
- Magic links
- Auth callback routes

**Added:**
- Custom database-backed sessions
- Argon2 password hashing
- SHA-256 session token hashing
- Direct Postgres connection (Drizzle ORM)

**New API Routes:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Authenticate
- `POST /api/auth/logout` - End session
- `GET /api/auth/me` - Get current user

## 📚 Documentation

- Full implementation details: `CUSTOM_AUTH_IMPLEMENTATION.md`
- Migration file: `supabase/migrations/001_custom_auth.sql`
- Environment template: `.env.local.example`

## 🆘 Need Help?

1. Run `npm run auth:setup` to check your setup
2. Check `CUSTOM_AUTH_IMPLEMENTATION.md` for detailed docs
3. Verify migration was applied in Supabase Dashboard
4. Check browser console and server logs for errors
