# 🔧 Fix: "Unable to connect to the authentication service"

## The Problem
The Supabase URL in Vercel environment variables is incorrect or missing.

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Correct Supabase URL
1. Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/settings/api**
2. Copy the **Project URL** - it should be: `https://cvsawjrtgmsmadtrfwfa.supabase.co`
   - ⚠️ **IMPORTANT:** Make sure it has the 'r' before 'fwfa' (not `cvsawjrtgmsmadtfwfa`)

### Step 2: Update Vercel Environment Variables
1. Go to: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables**
2. **Delete** the existing `NEXT_PUBLIC_SUPABASE_URL` if it's wrong
3. Click **"Add New"** and add:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://cvsawjrtgmsmadtrfwfa.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: [Copy from Supabase dashboard - the "anon public" key]
   - Environments: ✅ All

   **Variable 3:**
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://psrtrain.com`
   - Environments: ✅ All

4. Click **"Save"** for each variable

### Step 3: Configure Supabase Redirect URLs
1. Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/auth/url-configuration**
2. Under **"Redirect URLs"**, add:
   ```
   https://psrtrain.com/**
   ```
3. Under **"Site URL"**, set:
   ```
   https://psrtrain.com
   ```
4. Click **"Save"**

### Step 4: Redeploy
1. Go to: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments**
2. Click **"Redeploy"** on the latest deployment
3. Or trigger a new deployment:
   ```powershell
   git commit --allow-empty -m "Redeploy after env fix"
   git push
   ```

## ✅ Verify It's Fixed
After redeployment, test:
- Go to: https://psrtrain.com/signup
- Try creating an account
- Should work without "Unable to connect" error

## Common Mistakes
- ❌ Wrong URL: `https://cvsawjrtgmsmadtfwfa.supabase.co` (missing 'r')
- ✅ Correct URL: `https://cvsawjrtgmsmadtrfwfa.supabase.co` (has 'r')

- ❌ Forgetting to redeploy after changing env vars
- ✅ Always redeploy after changing environment variables
