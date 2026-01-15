# Deployment Guide - Production

This guide will help you deploy your PSR Training Platform to production.

## Recommended: Deploy to Vercel

Vercel is the recommended platform for Next.js applications as it's made by the Next.js team and has excellent support.

## Pre-Deployment Checklist

- [ ] All code is tested and working locally
- [ ] Environment variables are ready for production
- [ ] Database migrations are run on production Supabase
- [ ] Production Supabase project is set up
- [ ] Authentication redirect URLs are configured

---

## Step 1: Prepare Production Supabase Project

### Option A: Use Existing Supabase Project (Development)
If you want to use your existing Supabase project:
1. Go to your Supabase dashboard
2. Your project is already set up with all tables

### Option B: Create New Production Supabase Project (Recommended)
For better separation:
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Create a new project (e.g., "PSR Training Platform - Production")
4. Run the database migrations:
   - Go to SQL Editor
   - Run `scripts/setup.sql` (same migration file)

---

## Step 2: Set Up Environment Variables for Production

You'll need these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
OPENAI_API_KEY=your-openai-api-key (optional, for AI features)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Get your Supabase credentials:**
1. Go to Supabase Dashboard → Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 3: Configure Supabase Authentication for Production

1. Go to Supabase Dashboard → Authentication → Settings
2. Under **Site URL**, enter your production URL:
   ```
   https://your-domain.vercel.app
   ```
3. Under **Redirect URLs**, add:
   ```
   https://your-domain.vercel.app/**
   ```
4. Click **Save**

---

## Step 4: Deploy to Vercel

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Choose your account)
   - Link to existing project? **No** (or Yes if you have one)
   - Project name? (Press Enter for default or enter custom name)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

5. **Set Environment Variables:**
   After first deploy, Vercel will ask if you want to add environment variables, or:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables (see Step 2)

6. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel Dashboard (Git Integration)

1. **Push your code to GitHub:**
   - Create a GitHub repository
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/psr-training-platform.git
     git push -u origin main
     ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Next.js** (auto-detected)
     - Root Directory: `./` (default)
     - Build Command: `npm run build` (default)
     - Output Directory: `.next` (default)

3. **Add Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add all variables from Step 2

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

---

## Step 5: Post-Deployment

### Update Environment Variables if Needed

After deployment, if your site URL changes:

1. **Update `NEXT_PUBLIC_SITE_URL` in Vercel:**
   - Go to Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL

2. **Update Supabase Redirect URLs:**
   - Go to Supabase → Authentication → Settings
   - Update Site URL and Redirect URLs to match your Vercel URL

### Test Production Deployment

1. Visit your Vercel URL
2. Test login/signup
3. Test all features
4. Check browser console for errors

---

## Step 6: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs to include your custom domain

---

## Troubleshooting

### Build Errors

**Error: Missing environment variables**
- Make sure all `NEXT_PUBLIC_*` variables are set in Vercel
- Redeploy after adding variables

**Error: Supabase connection failed**
- Verify Supabase URL and keys are correct
- Check Supabase project is active (not paused)

### Runtime Errors

**Authentication not working**
- Check Supabase redirect URLs include your production domain
- Verify Site URL is set correctly in Supabase

**Database errors**
- Verify migrations are run on production Supabase
- Check RLS policies are set correctly

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `OPENAI_API_KEY` | No | OpenAI API key (for AI features) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your production site URL |

---

## Quick Deploy Command

For quick deployment after initial setup:

```bash
vercel --prod
```

This will deploy your latest code to production.

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Check Supabase project is active

Happy deploying! 🚀

























