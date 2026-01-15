# 🚀 Deployment Commands

## Run These Commands in Order:

### 1. Navigate to Project
```powershell
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
```

### 2. Deploy to Vercel
```powershell
vercel
```

**Follow the prompts:**
- Set up and deploy? → Type `Y` and press Enter
- Which scope? → Select your account
- Link to existing project? → Type `N` (first time) or `Y` (if you have one)
- Project name? → Press Enter (or type custom name)
- Directory? → Press Enter
- Override settings? → Type `N`

### 3. After First Deploy - Add Environment Variables

Go to: **https://vercel.com/dashboard** → Your Project → Settings → Environment Variables

Add these (get values from `.env.local` or Supabase dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 4. Update Supabase Redirect URLs

Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration**

Add your Vercel URL to Redirect URLs:
```
https://your-app-name.vercel.app/**
```

### 5. Deploy to Production
```powershell
vercel --prod
```

---

## Quick One-Liner (After Setup)

For future deployments:
```powershell
vercel --prod
```
