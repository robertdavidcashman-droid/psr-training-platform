# 🚀 Deploy to Vercel - Step by Step

## Step 1: Add Environment Variables

**Go to:** https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables

Click **"Add New"** for each variable:

### Variable 1
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://cvsawjrtgmsmadtfwfa.supabase.co`
- **Environments:** ✅ All (Production, Preview, Development)

### Variable 2
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** [Get from Supabase - see link below]
- **Environments:** ✅ All

**Get Supabase Key:**
https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
- Copy the **"anon public"** key

### Variable 3
- **Key:** `OPENAI_API_KEY`
- **Value:** [Your OpenAI API key - you have this ready]
- **Environments:** ✅ All

### Variable 4
- **Key:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://psrtrain.com`
- **Environments:** ✅ All

## Step 2: Deploy

**Option A: Trigger from GitHub**
```powershell
cd C:\Projects\psr-training
git commit --allow-empty -m "Deploy to production"
git push
```

**Option B: Manual Deploy**
1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments
2. Click **"Redeploy"** or **"Deploy"**

## Step 3: Update Supabase Redirect URLs

After deployment succeeds:

1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration
2. Under **Redirect URLs**, add: `https://psrtrain.com/**`
3. Under **Site URL**, set: `https://psrtrain.com`
4. Click **Save**

## ✅ Done!

Your app will be live at: **https://psrtrain.com**
