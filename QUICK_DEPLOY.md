# Quick Deployment Steps

## Fastest Way: Vercel CLI

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
vercel
```

### 4. Add Environment Variables in Vercel Dashboard
Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these:
```
NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 5. Update Supabase Redirect URLs
1. Go to Supabase → Authentication → Settings
2. Add your Vercel URL: `https://your-app.vercel.app/**`

### 6. Redeploy
```bash
vercel --prod
```

Done! ✅

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

























