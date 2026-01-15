# Fix: "Failed to fetch" Error on Login

## The Problem

The error "Failed to fetch" occurs when the app tries to connect to Supabase for authentication but can't reach it.

## Possible Causes

1. **Supabase Project is Paused** - Free tier projects pause after inactivity
2. **Network/CORS Issue** - Connection blocked
3. **Incorrect Supabase URL** - Environment variable not set correctly
4. **Supabase Project Deleted or Suspended**

## Solutions

### Step 1: Check if Supabase Project is Active

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa
2. Check if the project is active (not paused)
3. If paused, click "Restore" or "Resume"

### Step 2: Verify Environment Variables

Check that `.env.local` has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

Make sure:
- No quotes around values
- No spaces around `=` sign
- URL starts with `https://`

### Step 3: Restart the Server

After checking/updating `.env.local`:

1. Stop the server (Ctrl+C in terminal)
2. Start again: `npm run dev`

### Step 4: Check Browser Console

Open browser console (F12) and check for:
- CORS errors
- Network errors
- Any other error messages

### Step 5: Verify Supabase Project Settings

1. Go to Supabase Dashboard → Settings → API
2. Verify the URL matches what's in `.env.local`
3. Verify the anon key is correct
4. Check if there are any restrictions on the project

## Quick Test

Try accessing the Supabase REST API directly in browser:
https://cvsawjrtgmsmadtfwfa.supabase.co/rest/v1/

If this fails, the project is likely paused or unavailable.

























