# Supabase CORS Configuration Fix

## Issue
Getting "Network error: Unable to reach the authentication server" when trying to sign up or log in on production.

## Root Cause
Supabase requires your production domain to be added to the allowed origins list in the project settings.

## Solution

### Step 1: Add Production Domain to Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `cvsawjrtgmsmadtrfwfa`
3. Navigate to: **Settings** → **API**
4. Scroll down to **CORS Configuration** or **Site URL**
5. Add the following URLs to the allowed origins:
   - `https://psrtrain.com`
   - `https://pstrain-rebuild-*.vercel.app` (or the specific Vercel URL)
   - `https://*.vercel.app` (to allow all preview deployments)

### Step 2: Verify Environment Variables in Vercel

Make sure these are set in Vercel Production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Alternative - Check Supabase Auth Settings

1. Go to: **Authentication** → **URL Configuration**
2. Add your site URL: `https://psrtrain.com`
3. Add redirect URLs:
   - `https://psrtrain.com/dashboard`
   - `https://psrtrain.com/**`

### Step 4: Redeploy

After making changes in Supabase, you may need to:
1. Clear browser cache
2. Try again

## Quick Test

After configuration, test by:
1. Opening browser console (F12)
2. Going to https://psrtrain.com/login
3. Checking for any CORS errors in console
4. Trying to sign up or log in

## If Still Not Working

Check browser console for specific error messages:
- CORS errors will show "Access-Control-Allow-Origin" errors
- Network errors will show "Failed to fetch" or "ERR_NETWORK"
- Configuration errors will show "Missing Supabase environment variables"
