# 🚀 Simple Deployment Steps

Your project is already linked to Vercel! Here's how to deploy:

## Quick Deploy (Run in PowerShell)

```powershell
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
vercel --prod
```

## If That Doesn't Work

The Vercel CLI might have issues with OneDrive folders. Try:

### Option 1: Deploy via Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Find your project: **pstrain-rebuild**
3. Click **"Deploy"** or **"Redeploy"**

### Option 2: Use GitHub Integration
1. Push your code to GitHub
2. Vercel will auto-deploy from GitHub

### Option 3: Move Project Temporarily
```powershell
# Copy to a local folder (not OneDrive)
xcopy "C:\Users\rober\OneDrive\Desktop\pstrain rebuild" "C:\temp\pstrain" /E /I
cd C:\temp\pstrain
vercel --prod
```

## After Deployment

1. **Add Environment Variables in Vercel:**
   - Go to: https://vercel.com/dashboard → pstrain-rebuild → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_SITE_URL`

2. **Update Supabase Redirect URLs:**
   - Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
   - Add your Vercel URL: `https://your-app.vercel.app/**`

## Your Project Info
- **Vercel Account:** robertdavidcashman-8505
- **Project Name:** pstrain-rebuild
- **Supabase Project:** cvsawjrtgmsmadtfwfa
