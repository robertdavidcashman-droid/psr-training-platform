# How to Get Your Supabase Database Password

## Step-by-Step Guide

### Option 1: View Existing Password (if you remember setting it)

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Login to your account

2. **Select Your Project**
   - Click on project: `cvsawjrtgmsmadtrfwfa`
   - Or go directly to: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa

3. **Navigate to Database Settings**
   - Click **"Settings"** in the left sidebar
   - Click **"Database"** in the settings menu

4. **Find Database Password**
   - Scroll down to **"Database password"** section
   - If you set it before, it might be shown (masked)
   - If not visible, you'll need to reset it (see Option 2)

### Option 2: Reset Database Password (Most Common)

1. **Go to Database Settings**
   - https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database

2. **Reset Password**
   - Find **"Database password"** section
   - Click **"Reset database password"** button
   - A new password will be generated

3. **Copy the Password**
   - **IMPORTANT**: Copy it immediately - it won't be shown again!
   - Save it securely (password manager recommended)

4. **Update Your Connection String**
   - Replace `[YOUR-PASSWORD]` in your connection string with the new password
   - Or run: `npm run db:setup:auto "postgresql://postgres.cvsawjrtgmsmadtrfwfa:NEW_PASSWORD@aws-1-eu-west-3.pooler.supabase.com:5432/postgres"`

## Direct Links

- **Project Dashboard**: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa
- **Database Settings**: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database
- **Connection Strings**: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database (scroll to "Connection string" section)

## Quick Visual Guide

```
Supabase Dashboard
  └─ Project: cvsawjrtgmsmadtrfwfa
      └─ Settings (left sidebar)
          └─ Database
              └─ Database password
                  └─ [Reset database password] ← Click here
```

## After Getting Password

1. Copy the password
2. Run this command (replace `YOUR_PASSWORD`):
   ```powershell
   npm run db:setup:auto "postgresql://postgres.cvsawjrtgmsmadtrfwfa:YOUR_PASSWORD@aws-1-eu-west-3.pooler.supabase.com:5432/postgres"
   ```
3. Or manually edit `.env.local` and replace `[YOUR-PASSWORD]` with your actual password

## Security Note

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Store passwords securely
- Use a password manager if possible
