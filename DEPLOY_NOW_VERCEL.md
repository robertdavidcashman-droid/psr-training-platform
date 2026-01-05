# 🚀 Deploy Your App Now - Vercel Already Connected!

## ✅ Good News!
Your project **pstrain-rebuild** is already connected to Vercel!
- **Domain:** psrtrain.com
- **GitHub:** Connected ✅
- **Status:** No Production Deployment (needs first deploy)

## Quick Deploy Steps

### Step 1: Add Environment Variables
1. Go to: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables**
2. Click **"Add New"**
3. Add these 4 variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://cvsawjrtgmsmadtfwfa.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Get from Supabase dashboard]

OPENAI_API_KEY
Value: [Your OpenAI key]

NEXT_PUBLIC_SITE_URL
Value: https://psrtrain.com
```

**Get Supabase keys from:**
https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api

### Step 2: Deploy
**Option A: Trigger from GitHub (Recommended)**
```powershell
cd C:\Projects\psr-training
git commit --allow-empty -m "Trigger deployment"
git push
```

**Option B: Manual Deploy**
1. Go to: **https://vercel.com/robert-cashmans-projects/pstrain-rebuild**
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Or click **"Deploy"** button

### Step 3: Update Supabase Redirect URLs
After deployment succeeds:

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Add Redirect URL: `https://psrtrain.com/**`
3. Set Site URL: `https://psrtrain.com`
4. Click **Save**

## ✅ That's It!

Once deployed, your app will be live at: **https://psrtrain.com**

Future updates: Just `git push` and Vercel auto-deploys! 🎉
