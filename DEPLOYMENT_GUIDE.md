# 🚀 Deployment Guide

This guide will help you deploy the PSR Training Academy to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up at [supabase.com](https://supabase.com)
3. **Vercel CLI**: Install globally with `npm i -g vercel`

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for admin features)
   ```

4. **Deploy**
   - Vercel will automatically deploy on push to main
   - Or click "Deploy" in the dashboard

### Option 2: Deploy via CLI

1. **Login to Vercel**
   ```bash
   npx vercel login
   ```

2. **Set Environment Variables**
   
   If you have `.env.local`:
   ```bash
   npm run setup:vercel-env --use-local
   ```
   
   Or set manually:
   ```bash
   npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
   npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```

3. **Deploy to Production**
   ```bash
   npx vercel --prod
   ```

## Required Environment Variables

### Required for All Environments

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API |

### Required for Admin Features

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Supabase Dashboard → Settings → API |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` (auto-set by Vercel) |
| `PORT` | Server port | `3000` (auto-set by Vercel) |

## Pre-Deployment Checklist

- [ ] **Build passes locally**
  ```bash
  npm run build
  ```

- [ ] **Tests pass**
  ```bash
  npm run test:all
  ```

- [ ] **Supabase database is set up**
  - Run SQL from `docs/auth_setup_combined.sql`
  - Create admin user in `admin_users` table

- [ ] **Environment variables are configured**
  - In Vercel dashboard or via CLI

- [ ] **Domain is configured** (optional)
  - Add custom domain in Vercel project settings

## Deployment Steps

### 1. Build Verification

```bash
# Run full check
npm run check

# Run tests
npm run test:all
```

### 2. Environment Setup

```bash
# Auto-setup from .env.local
npm run setup:vercel-env --use-local

# Or verify manually
npx vercel env ls
```

### 3. Deploy

```bash
# Preview deployment (for testing)
npx vercel

# Production deployment
npx vercel --prod
```

### 4. Verify Deployment

After deployment, verify:
- ✅ Homepage loads
- ✅ Login page works
- ✅ Authentication flows work
- ✅ Protected pages redirect to login
- ✅ Admin routes are protected

## Post-Deployment

### 1. Test Critical Paths

- [ ] Public pages load
- [ ] User can register/login
- [ ] Protected pages require auth
- [ ] Admin routes are restricted
- [ ] Coverage matrix displays correctly
- [ ] Questions load properly

### 2. Monitor

- Check Vercel dashboard for build logs
- Monitor Supabase dashboard for API usage
- Set up error tracking (optional)

### 3. Set Up CI/CD (Optional)

The project includes `.github/workflows/ci.yml` for automated testing on push.

## Troubleshooting

### Build Fails

1. **Check build logs in Vercel dashboard**
2. **Test build locally**: `npm run build`
3. **Check for TypeScript errors**: `npm run typecheck`
4. **Check for lint errors**: `npm run lint`

### Environment Variables Not Working

1. **Verify variables are set**: `npx vercel env ls`
2. **Redeploy after adding variables**: `npx vercel --prod`
3. **Check variable names** (case-sensitive, no typos)

### Supabase Connection Errors

1. **Verify Supabase URL and keys are correct**
2. **Check Supabase project is active**
3. **Verify RLS policies are set up** (run `docs/auth_setup_combined.sql`)

### Authentication Not Working

1. **Check Supabase auth is enabled**
2. **Verify database tables exist** (`user_sessions`, `admin_users`)
3. **Check middleware is configured correctly**

## Production Best Practices

1. **Enable Vercel Analytics** (optional)
   - Project Settings → Analytics

2. **Set up Error Monitoring**
   - Consider Sentry or similar

3. **Configure Custom Domain**
   - Project Settings → Domains

4. **Set Up Preview Deployments**
   - Automatically created for PRs

5. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Supabase usage

## Rollback

If something goes wrong:

```bash
# List deployments
npx vercel ls

# Promote a previous deployment
npx vercel promote <deployment-url>
```

Or use Vercel dashboard → Deployments → Promote to Production

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
