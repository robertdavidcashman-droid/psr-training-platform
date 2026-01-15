# Final Setup Steps - Almost Done! 🎉

## ✅ Completed
- Database migration ✓
- Environment variables ✓

## Next Steps (5 minutes)

### Step 1: Configure Authentication (2 minutes)

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration

2. Under **"Site URL"**, enter:
   ```
   http://localhost:3000
   ```

3. Under **"Redirect URLs"**, click **"Add URL"** and add:
   ```
   http://localhost:3000/**
   ```

4. Scroll down to **"Email Auth"** section
   - For development, turn **OFF** "Enable email confirmations"

5. Click **"Save"** at the bottom

---

### Step 2: Start the App (if not running)

Open a terminal and run:
```bash
npm run dev
```

Wait for: "✓ Ready on http://localhost:3000"

---

### Step 3: Create Your Account (1 minute)

1. Open browser: http://localhost:3000

2. Click **"Sign Up"** or go to: http://localhost:3000/signup

3. Fill in:
   - **Full Name**: Your name
   - **Email**: your-email@example.com
   - **Password**: (at least 6 characters)

4. Click **"Sign Up"**

5. You should be automatically logged in and see the dashboard

---

### Step 4: Make Yourself Admin (2 minutes)

**Option A: Using Table Editor (Easiest)**

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/editor

2. Click on **"users"** table (in the left sidebar)

3. Find your user row (look for your email)

4. Click on the **"role"** field for your user

5. Change from `user` to `admin`

6. Press **Enter** or click outside the cell

**Option B: Using SQL (Faster)**

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new

2. Paste this SQL (replace with your actual email):
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Click **"Run"**

---

### Step 5: Verify Everything Works! 🎉

1. **Refresh your browser** (you should now see admin features)

2. **Test the features:**
   - Dashboard should show your stats
   - Admin menu should appear in navigation
   - Dark mode toggle should work (☀️/🌙 icon)
   - Search should work (Ctrl+K)
   - Practice mode should be accessible

3. **Try Admin Features:**
   - Go to **Admin → Questions** - Should see question management
   - Go to **Admin → Users** - Should see user list
   - Go to **Admin → Analytics** - Should see analytics dashboard

---

## 🎉 Congratulations!

Your PSR Training Platform is now fully set up and running!

### Quick Links:
- **App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa

### Next Steps (Optional):
- Add sample questions via Admin → Questions
- Create learning modules via Admin → Content
- Import PACE Code sections
- Invite users to sign up

### Need Help?
- Check browser console (F12) for any errors
- Check terminal where `npm run dev` is running for server errors
- See `README.md` for feature documentation

Enjoy your new training platform! 🚀

























