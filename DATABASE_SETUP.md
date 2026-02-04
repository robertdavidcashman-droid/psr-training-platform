# Database Connection Setup Guide

## Quick Fix for Test Failures

If your tests are failing with database connection errors, follow these steps:

### Step 1: Check Your DATABASE_URL

Run the diagnostic:
```bash
npm run db:check
```

### Step 2: Fix Password Placeholder

Your `.env.local` file has `<NEW_PASSWORD>` as a placeholder. Replace it with your actual Supabase database password.

**To get your password:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Database password** (or reset it if needed)

**Update `.env.local`:**
```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.cvsawjrtgmsmadtrfwfa.supabase.co:5432/postgres?sslmode=require
```

### Step 3: Use Session Pooler (Recommended)

If IPv6 connectivity is an issue, use the **Session Pooler** connection string instead:

1. In Supabase Dashboard → **Settings** → **Database**
2. Click **Connection string**
3. Select **Session pooler** (not Direct connection)
4. Copy the connection string
5. Update `DATABASE_URL` in `.env.local`

**Session Pooler format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Step 4: Verify Connection

```bash
npm run setup:auth
```

This will:
- ✅ Check DATABASE_URL
- ✅ Apply database migration
- ✅ Verify tables exist

### Step 5: Run Tests

Once the database is connected:
```bash
npm run e2e:auth:comprehensive
```

## Troubleshooting

### Error: `getaddrinfo ENOENT`
- **Cause**: DNS resolution failure or IPv6 connectivity issue
- **Fix**: Use Session Pooler connection string (IPv4 compatible)

### Error: `password authentication failed`
- **Cause**: Wrong password in DATABASE_URL
- **Fix**: Update password in `.env.local` with correct Supabase database password

### Error: `ENETUNREACH` or `network unreachable`
- **Cause**: IPv6 connectivity blocked by network/firewall
- **Fix**: Use Session Pooler connection string

### Error: `connection timeout`
- **Cause**: Network/firewall blocking database port
- **Fix**: Check firewall settings, try Session Pooler, or use VPN

## Current Configuration

Your current setup:
- **Project**: `cvsawjrtgmsmadtrfwfa`
- **Connection Type**: Direct (IPv6)
- **Status**: ⚠️ Password placeholder detected

## Next Steps

1. Replace `<NEW_PASSWORD>` with your actual password
2. Or switch to Session Pooler connection
3. Run `npm run setup:auth` to verify
4. Run `npm run e2e:auth:comprehensive` to test
