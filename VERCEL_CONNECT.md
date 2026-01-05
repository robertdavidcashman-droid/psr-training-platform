# ✅ Connect Vercel to GitHub - Final Step!

Your code is now on GitHub! 🎉

## Connect Vercel (2 minutes)

### Step 1: Import Repository
1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select: **psr-training-platform**
5. Click **"Import"**

### Step 2: Configure Project
Vercel will auto-detect Next.js. Settings should be:
- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅

### Step 3: Add Environment Variables
**Before clicking Deploy**, scroll to **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Get Supabase keys from:**
https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api

### Step 4: Deploy!
Click **"Deploy"** and wait ~2 minutes!

### Step 5: Update Supabase Redirect URLs
After deployment, get your Vercel URL and:

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Add Redirect URL: `https://your-app.vercel.app/**`
3. Set Site URL: `https://your-app.vercel.app`
4. Click **Save**

## 🎉 Done!

Your app will auto-deploy on every `git push`!

---

## Quick Links
- **GitHub Repo:** https://github.com/robertdavidcashman-droid/psr-training-platform
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Settings:** https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
