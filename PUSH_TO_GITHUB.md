# 🚀 Push to GitHub - Final Steps

Your project is ready! Now push to GitHub:

## Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `psr-training-platform`
3. Description: "PSR Training Platform - Professional Police Station Representative Training"
4. Choose: **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, run these commands:

```powershell
cd C:\Projects\psr-training

# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git

git branch -M main

git push -u origin main
```

## Step 3: Connect Vercel to GitHub

1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account
5. Find and select: **psr-training-platform**
6. Click **"Import"**

## Step 4: Add Environment Variables in Vercel

Before deploying, add these:

1. In project setup, scroll to **"Environment Variables"**
2. Add each:

```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Get Supabase keys from:**
https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api

## Step 5: Deploy!

Click **"Deploy"** and wait for build to complete!

## Step 6: Update Supabase Redirect URLs

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Add Redirect URL: `https://your-app.vercel.app/**`
3. Set Site URL: `https://your-app.vercel.app`
4. Save

## ✅ Done!

Now every `git push` will auto-deploy to Vercel! 🎉
