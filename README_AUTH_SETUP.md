# 🚀 Quick Authentication Setup

Run this command to check your setup status:

```bash
npm run setup:auth
```

## Automated Setup Steps

### 1. Database Setup (Supabase)

The setup script generates `docs/auth_setup_combined.sql`. 

**To set up:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `docs/auth_setup_combined.sql`
3. Paste and run
4. Add your admin user:
   ```sql
   INSERT INTO admin_users (user_id, email)
   VALUES ('your-uuid-from-auth-users', 'your-email@example.com');
   ```

### 2. Environment Variables (Vercel)

**If you have `.env.local`:**
```bash
npm run setup:vercel-env --use-local
```

**Or set manually:**
```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

### 3. Redeploy

```bash
npx vercel --prod
```

## Full Documentation

See `docs/AUTH_SETUP_GUIDE.md` for detailed instructions.
