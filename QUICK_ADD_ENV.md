# 🚀 Quick: Add Environment Variables to Vercel

## Option 1: Use the API Script (Automatic)

1. **Get your Vercel token:**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Copy the token

2. **Run the script:**
   ```powershell
   cd C:\Projects\psr-training
   powershell -ExecutionPolicy Bypass -File add-vercel-env-api.ps1
   ```

3. **Paste your Vercel token when prompted**

## Option 2: Manual (Fastest - 2 minutes)

**Go to:** https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables

Click **"Add New"** for each:

### 1. NEXT_PUBLIC_SUPABASE_URL
- **Value:** `https://cvsawjrtgmsmadtfwfa.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 3. OPENAI_API_KEY
- **Value:** [Get from `ENV_VARS_LOCAL.txt` in project folder]
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 4. NEXT_PUBLIC_SITE_URL
- **Value:** `https://psrtrain.com`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

## After Adding Variables

**Deploy:**
1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments
2. Click **"Redeploy"** or push a commit:
   ```powershell
   cd C:\Projects\psr-training
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```

## ✅ Done!

Your app will be live at: **https://psrtrain.com**
