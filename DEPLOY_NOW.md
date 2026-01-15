# 🚀 Deploy Your App Now

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy
```powershell
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Choose your account
- Link to existing project? → **No** (first time) or **Yes** (if you have one)
- Project name? → Press Enter (or enter custom name)
- Directory? → Press Enter (uses `./`)
- Override settings? → **No**

### Step 4: Add Environment Variables

After the first deploy, go to:
**https://vercel.com/dashboard** → Your Project → Settings → Environment Variables

Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**To get your Supabase keys:**
1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 5: Update Supabase Redirect URLs

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Under **Redirect URLs**, add:
   ```
   https://your-app-name.vercel.app/**
   ```
3. Under **Site URL**, set:
   ```
   https://your-app-name.vercel.app
   ```
4. Click **Save**

### Step 6: Deploy to Production

```powershell
vercel --prod
```

### Step 7: Test Your App

Visit your Vercel URL (shown after deployment) and test:
- ✅ Login/Signup
- ✅ Questions page
- ✅ Practice mode
- ✅ All features

---

## Alternative: Deploy via GitHub

If you prefer GitHub integration:

1. **Push to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Deploy to production"
   git remote add origin https://github.com/yourusername/psr-training.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

---

## Troubleshooting

**Build fails?**
- Check all environment variables are set
- Make sure Supabase project is active (not paused)

**Authentication not working?**
- Verify redirect URLs in Supabase match your Vercel URL
- Check environment variables are correct

**Need help?**
- Check deployment logs in Vercel dashboard
- See `DEPLOYMENT_GUIDE.md` for detailed instructions
