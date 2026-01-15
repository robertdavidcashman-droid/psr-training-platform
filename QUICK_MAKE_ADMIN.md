# Quick Admin Setup - Automated

## Easiest Method: Run SQL Script

Just run this command:

```powershell
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
node scripts/quick-admin.js
```

It will show you the exact SQL with your email already filled in!

## Or Copy This SQL Directly:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'robertdavidcashman@gmail.com';
```

Then:
1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new
2. Paste the SQL above
3. Click "Run"
4. Refresh browser ✅

---

## Fully Automated Option (Requires Service Role Key)

If you want it 100% automated without any manual steps:

1. **Get your Service Role Key:**
   - Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
   - Copy the **"service_role"** key (⚠️ NOT the anon key)

2. **Add to .env.local temporarily:**
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Install dotenv (if needed):**
   ```powershell
   npm install dotenv
   ```

4. **Run the automated script:**
   ```powershell
   node scripts/make-admin.js
   ```

5. **Remove the service role key from .env.local** (for security)

---

## Recommendation

The SQL method (first option) is:
- ✅ Faster
- ✅ More secure (no sensitive keys)
- ✅ Just copy-paste and click Run

The automated script is only worth it if you'll be doing this multiple times.

























