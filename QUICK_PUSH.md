# Quick Push to GitHub

## First: Create Repository

Go to: **https://github.com/new**
- Name: `psr-training-platform`
- Don't initialize with README
- Create repository

## Then: Push (Replace YOUR_USERNAME)

```powershell
cd C:\Projects\psr-training

# Option 1: Use script with parameters
powershell -ExecutionPolicy Bypass -File push-github.ps1 -Username YOUR_USERNAME -RepoName psr-training-platform

# Option 2: Manual commands
git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git
git branch -M main
git push -u origin main
```

## After Push: Connect Vercel

1. https://vercel.com/dashboard
2. Add New → Project
3. Import from GitHub
4. Select: `psr-training-platform`
5. Add environment variables
6. Deploy!
