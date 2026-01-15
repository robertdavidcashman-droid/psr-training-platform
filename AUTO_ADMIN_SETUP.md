# Automated Admin Setup

I've created two scripts to help you make yourself admin. Choose the method you prefer:

## Option 1: Automated Script (Easiest) ⚡

This script automatically updates your role using the Supabase API.

### Step 1: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
2. Scroll down to **"Project API keys"**
3. Find the **"service_role"** key (⚠️ NOT the anon key)
4. Copy it

### Step 2: Add to .env.local

Add this line to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Install dotenv (if needed)

```bash
npm install dotenv
```

### Step 4: Run the Script

```bash
node scripts/make-admin.js
```

Or with a specific email:
```bash
node scripts/make-admin.js your-email@example.com
```

### Step 5: Remove Service Role Key (Security)

⚠️ **Important:** After running the script, remove the `SUPABASE_SERVICE_ROLE_KEY` line from `.env.local` for security. The service role key has full database access and should not be stored in code.

---

## Option 2: Generate SQL (No Credentials Needed) 📋

This script just generates the SQL for you to copy-paste.

### Run the Script:

```bash
node scripts/make-admin-sql.js
```

It will output the exact SQL query you need to run in Supabase SQL Editor.

---

## Quick SQL (Manual)

Or just run this directly in Supabase SQL Editor:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'robertdavidcashman@gmail.com';
```

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new
2. Paste the SQL above
3. Click "Run"
4. Done! ✅

---

## Which Method to Use?

- **Option 1**: If you want full automation (requires service role key temporarily)
- **Option 2**: If you want the SQL generated for you (no credentials needed)
- **Quick SQL**: Fastest if you're comfortable with SQL

All methods achieve the same result!

























