# 🚀 Quick GitHub Setup Guide

## The Problem
OneDrive folders can cause issues with git. Here's the easiest solution:

## ✅ Easiest Method: Copy to Local Folder

### Step 1: Copy Project
```powershell
# Create local project folder
New-Item -ItemType Directory -Path "C:\Projects\psr-training" -Force

# Copy everything
Copy-Item -Path "C:\Users\rober\OneDrive\Desktop\pstrain rebuild\*" -Destination "C:\Projects\psr-training" -Recurse -Force

# Go to new location
cd C:\Projects\psr-training
```

### Step 2: Initialize Git
```powershell
git init
git add .
git commit -m "Initial commit"
```

### Step 3: Create GitHub Repo
1. Go to: https://github.com/new
2. Repository name: `psr-training-platform`
3. **Don't** check "Initialize with README"
4. Click **"Create repository"**

### Step 4: Push to GitHub
```powershell
# Replace YOUR_USERNAME
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git
git branch -M main
git push -u origin main
```

### Step 5: Connect Vercel
1. Go to: https://vercel.com/dashboard
2. **Add New...** → **Project**
3. **Import Git Repository**
4. Select: `psr-training-platform`
5. **Add Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
6. **Deploy!**

## 🎉 Done!

Now every `git push` will auto-deploy to Vercel!

---

## Alternative: Use GitHub Desktop

1. Download: https://desktop.github.com/
2. Install and sign in
3. **File** → **Add Local Repository**
4. Select your project folder
5. **Publish repository** (creates GitHub repo automatically)
6. Connect to Vercel (Step 5 above)
find the