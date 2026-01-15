# Environment Variables for Vercel

Copy these into Vercel → Settings → Environment Variables:

## Required Variables

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://cvsawjrtgmsmadtfwfa.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
Get from: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api
- Look for "anon public" key
- Copy the long string starting with `eyJ...`

### 3. OPENAI_API_KEY
Your OpenAI API key (if you have one)
- Format: `sk-proj-...` or `sk-...`

### 4. NEXT_PUBLIC_SITE_URL
```
https://psrtrain.com
```

## How to Add in Vercel

1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables
2. For each variable:
   - Click **"Add New"**
   - Enter **Key** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter **Value** (paste the value)
   - Select **Environment:** Production, Preview, Development (check all)
   - Click **"Save"**

## After Adding Variables

1. Go to **Deployments** tab
2. Click **"Redeploy"** or trigger a new deployment
3. Wait 2-3 minutes for build
4. Your app will be live!
