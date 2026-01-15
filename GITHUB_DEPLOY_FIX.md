# 🔧 GitHub Setup - OneDrive Fix

## Problem
OneDrive can cause issues with git and Vercel CLI. Here are solutions:

## Solution 1: Copy Project to Local Folder (Recommended)

### Step 1: Copy Project
```powershell
# Create a local folder (not in OneDrive)
New-Item -ItemType Directory -Path "C:\Projects\psr-training" -Force

# Copy all files
Copy-Item -Path "C:\Users\rober\OneDrive\Desktop\pstrain rebuild\*" -Destination "C:\Projects\psr-training" -Recurse -Force

# Navigate to new location
cd C:\Projects\psr-training
```

### Step 2: Initialize Git
```powershell
git init
git add .
git commit -m "Initial commit: PSR Training Platform"
```

### Step 3: Create GitHub Repository
1. Go to: https://github.com/new
2. Name: `psr-training-platform`
3. **Don't** initialize with README
4. Click "Create repository"

### Step 4: Push to GitHub
```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git
git branch -M main
git push -u origin main
```

### Step 5: Connect to Vercel
1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from GitHub
4. Select: `psr-training-platform`
5. Add environment variables
6. Deploy!

---

## Solution 2: Use GitHub Desktop (Easier)

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and sign in**
3. **File → Add Local Repository**
4. **Browse to:** `C:\Users\rober\OneDrive\Desktop\pstrain rebuild`
5. **Publish repository** (creates GitHub repo automatically)
6. **Connect to Vercel** (as in Solution 1, Step 5)

---

## Solution 3: Use Vercel Dashboard Directly

Since your project is already linked to Vercel:

1. **Go to:** https://vercel.com/dashboard
2. **Find project:** pstrain-rebuild
3. **Settings → Git**
4. **Connect GitHub** (if not already connected)
5. **Push code manually** or use GitHub Desktop

---

## Environment Variables to Add in Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

## Update Supabase After Deployment

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Add Redirect URL: `https://your-app.vercel.app/**`
3. Set Site URL: `https://your-app.vercel.app`
4. Save

---

## Recommended: Use Solution 1

Copying to a local folder (not OneDrive) will solve all file system issues and make git/Vercel work smoothly.
