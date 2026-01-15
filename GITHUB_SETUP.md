# 🚀 GitHub Integration Setup

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `psr-training-platform` (or your preferred name)
3. Description: "PSR Training Platform - Professional Police Station Representative Training"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Or if you prefer SSH:**
```powershell
git remote add origin git@github.com:YOUR_USERNAME/psr-training-platform.git
git branch -M main
git push -u origin main
```

## Step 3: Connect Vercel to GitHub

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account
5. Find and select: **psr-training-platform**
6. Click **"Import"**

## Step 4: Configure Vercel Project

Vercel will auto-detect Next.js. Configure:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

## Step 5: Add Environment Variables

Before deploying, add these in Vercel:

1. In the project setup, scroll to **"Environment Variables"**
2. Add each variable:

```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**To get your Supabase keys:**
- Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
- Copy **Project URL** and **anon public** key

## Step 6: Deploy

Click **"Deploy"** and wait for the build to complete!

## Step 7: Update Supabase Redirect URLs

After deployment, update Supabase:

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

## ✅ Automatic Deployments Enabled!

Now, every time you push to GitHub:
- Vercel will automatically build and deploy
- You'll get a preview URL for each commit
- Production deploys on main branch

## Future Updates

To update your app:

```powershell
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy! 🚀
