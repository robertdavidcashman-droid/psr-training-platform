# Fix "Failed to Fetch" Error - Add Environment Variables to Vercel

## The Problem
The "failed to fetch" error when creating an account means the app can't connect to Supabase because the environment variables are missing or incorrect in Vercel.

## Quick Fix Steps

### Step 1: Go to Vercel Environment Variables
1. Open: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables**
2. Or navigate: Vercel Dashboard → pstrain-rebuild → Settings → Environment Variables

### Step 2: Add Required Variables

Click **"Add New"** for each of these variables:

#### 1. NEXT_PUBLIC_SUPABASE_URL
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://cvsawjrtgmsmadtfwfa.supabase.co`
- **Environment:** Check all (Production, Preview, Development)

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Get from https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
  - Look for "anon public" key
  - Copy the long string starting with `eyJ...`
- **Environment:** Check all (Production, Preview, Development)

#### 3. NEXT_PUBLIC_SITE_URL
- **Key:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://psrtrain.com`
- **Environment:** Check all (Production, Preview, Development)

#### 4. OPENAI_API_KEY (Optional)
- **Key:** `OPENAI_API_KEY`
- **Value:** Your OpenAI API key (if you have one)
- **Environment:** Check all (Production, Preview, Development)

### Step 3: Redeploy

After adding the variables:

1. Go to: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments**
2. Find the latest deployment
3. Click the **"..."** menu → **"Redeploy"**
4. Or push a new commit to trigger auto-deployment

### Step 4: Verify Supabase is Active

1. Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa**
2. Make sure the project is **Active** (not paused)
3. If paused, click **"Restore"** or **"Resume"**

### Step 5: Update Supabase Redirect URLs

1. Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration**
2. Under **Redirect URLs**, add:
   ```
   https://psrtrain.com/**
   ```
3. Under **Site URL**, set:
   ```
   https://psrtrain.com
   ```
4. Click **Save**

## Verify It's Working

1. Wait 2-3 minutes for the redeploy to complete
2. Visit: **https://psrtrain.com/signup**
3. Try creating an account again
4. The error should be fixed!

## Still Having Issues?

If you still get errors:

1. **Check browser console** (F12) for specific error messages
2. **Verify Supabase project is active** (not paused)
3. **Check Vercel deployment logs** for build errors
4. **Make sure all environment variables are saved** in Vercel

## Quick Links

- **Vercel Environment Variables:** https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables
- **Vercel Deployments:** https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments
- **Supabase API Settings:** https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
- **Supabase Auth Settings:** https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
