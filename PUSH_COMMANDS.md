# 🚀 Push to GitHub - Commands

## Step 1: Create GitHub Repository First

Go to: **https://github.com/new**
- Name: `psr-training-platform`
- **Don't** initialize with README
- Click "Create repository"

## Step 2: Run These Commands

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
cd C:\Projects\psr-training

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Connect Vercel

1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from GitHub
4. Select: `psr-training-platform`
5. Add environment variables
6. Deploy!

---

## Quick Copy-Paste (After creating repo):

```powershell
cd C:\Projects\psr-training
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!
