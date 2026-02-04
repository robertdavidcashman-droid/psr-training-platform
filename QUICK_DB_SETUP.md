# Quick Database Setup (Non-Interactive)

## Method 1: PowerShell Environment Variable (Easiest)

```powershell
# Get your connection string from Supabase Dashboard, then:
$env:SUPABASE_DATABASE_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
npm run db:setup:auto
```

## Method 2: Command Line Argument

```powershell
npm run db:setup:auto "postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
```

## Method 3: Direct Edit (Manual)

1. Open `.env.local`
2. Find the line: `DATABASE_URL=postgresql://postgres:<NEW_PASSWORD>@...`
3. Replace `<NEW_PASSWORD>` with your actual password
4. Or replace the entire line with your Session Pooler connection string

## Get Your Connection String

1. Go to: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database
2. Click **"Connection string"**
3. Select **"Session pooler"** (recommended)
4. Copy the entire connection string

## Verify Setup

```bash
npm run db:check
npm run setup:auth
```

## Example Session Pooler Format

```
postgresql://postgres.cvsawjrtgmsmadtrfwfa:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Example Direct Connection Format

```
postgresql://postgres:YOUR_PASSWORD@db.cvsawjrtgmsmadtrfwfa.supabase.co:5432/postgres?sslmode=require
```
