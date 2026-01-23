# 🚀 Auth System Deployment Checklist

## ✅ Pre-Deployment Status

- ✅ Code rebuilt and tested
- ✅ Build passes (`npm run build` ✅)
- ✅ Environment variables verified (`npm run auth:verify` ✅)
- ✅ All TypeScript/ESLint errors fixed
- ✅ Ready for deployment

---

## 📋 Deployment Steps

### Step 1: Commit & Push Changes

```bash
git add .
git commit -m "Rebuild authentication system with clean Supabase integration"
git push origin main
```

---

### Step 2: Configure Vercel Environment Variables

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

**Optional (for admin features):**
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

**Via Vercel Dashboard:**
1. Go to your Vercel project → Settings → Environment Variables
2. Add each variable for **Production**, **Preview**, and **Development**
3. Make sure to add them to all environments

**Via CLI:**
```bash
# Login to Vercel
npx vercel login

# Add environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Or use the setup script if available
npm run setup:vercel-env --use-local
```

---

### Step 3: Configure Supabase Dashboard

**Critical Settings:**

1. **Site URL** (Authentication → URL Configuration):
   - Add your production domain: `https://yourdomain.com`
   - Add Vercel preview URLs: `https://*.vercel.app`
   - Add redirect URLs: `https://yourdomain.com/**` and `https://*.vercel.app/**`

2. **Email Confirmation** (Authentication → Settings):
   - **For Production:** Keep enabled (recommended for security)
   - Users will need to confirm email before login
   - Or disable for immediate access (less secure)

3. **CORS** (Settings → API):
   - Add: `https://yourdomain.com`
   - Add: `https://*.vercel.app`

---

### Step 4: Deploy

**Option A: Automatic (via Git push)**
- If Vercel is connected to your GitHub repo, it will auto-deploy on push
- Just push your changes (Step 1)

**Option B: Manual Deploy via CLI**
```bash
# Preview deployment (test first)
npx vercel

# Production deployment
npx vercel --prod
```

**Option C: Manual Deploy via Dashboard**
- Go to Vercel dashboard → Your Project → Deployments
- Click "Redeploy" or trigger a new deployment

---

### Step 5: Verify Deployment

After deployment, test these critical paths:

1. **Homepage**
   - ✅ Loads without errors
   - URL: `https://yourdomain.com`

2. **Login Page**
   - ✅ Loads correctly
   - ✅ Form works
   - URL: `https://yourdomain.com/login`

3. **Signup Page**
   - ✅ Loads correctly
   - ✅ Form works
   - URL: `https://yourdomain.com/signup`

4. **Protected Routes**
   - ✅ Redirect to login when not authenticated
   - ✅ Accessible after login
   - Test: `https://yourdomain.com/dashboard`

5. **Auth Flow**
   - ✅ Signup works
   - ✅ Login works
   - ✅ Session persists after refresh
   - ✅ Logout works

6. **Health Check**
   - ✅ Returns healthy status
   - URL: `https://yourdomain.com/api/auth/health`

---

## 🔍 Post-Deployment Verification

### Quick Test Script

```bash
# Test health endpoint
curl https://yourdomain.com/api/auth/health

# Should return:
# {
#   "healthy": true,
#   "checks": { ... },
#   "timestamp": "..."
# }
```

### Manual Testing Checklist

- [ ] Homepage loads
- [ ] Login page loads (`/login`)
- [ ] Signup page loads (`/signup`)
- [ ] Can create account (or see email confirmation message)
- [ ] Can login (after email confirmation if enabled)
- [ ] Dashboard accessible after login (`/dashboard`)
- [ ] Protected routes redirect when logged out
- [ ] Logout works
- [ ] Session persists after page refresh
- [ ] Auth pages redirect logged-in users

---

## ⚠️ Common Deployment Issues

### Issue: Build Fails

**Symptoms:** Deployment fails during build step

**Fix:**
1. Check build logs in Vercel dashboard
2. Test build locally: `npm run build`
3. Verify all dependencies are in `package.json`
4. Check for TypeScript errors: `npm run typecheck`

---

### Issue: Environment Variables Not Working

**Symptoms:** Auth doesn't work, "Missing Supabase environment variables" error

**Fix:**
1. Verify variables are set in Vercel:
   ```bash
   npx vercel env ls
   ```
2. Make sure variables are added to **Production** environment
3. Redeploy after adding variables:
   ```bash
   npx vercel --prod
   ```
4. Check variable names (case-sensitive, exact match)

---

### Issue: CORS Errors

**Symptoms:** Auth requests fail with CORS errors in browser console

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Add your production domain to CORS settings:
   - `https://yourdomain.com`
   - `https://*.vercel.app` (for preview deployments)
3. Wait 1-2 minutes for changes to propagate

---

### Issue: Session Doesn't Persist

**Symptoms:** Users logged out after refresh

**Fix:**
1. Verify middleware is deployed (check build logs)
2. Check Supabase site URL is configured correctly
3. Verify cookies are being set (check browser DevTools → Application → Cookies)
4. Check domain configuration in Vercel (should match Supabase site URL)

---

### Issue: Email Confirmation Required

**Symptoms:** Users can't login after signup

**Fix:**
- **Option 1:** Disable email confirmation in Supabase Dashboard → Authentication → Settings
- **Option 2:** Users must check email and confirm account before login
- **Option 3:** Use magic link flow instead (requires code changes)

---

## 📝 Deployment Commands Reference

```bash
# Verify setup before deployment
npm run auth:verify

# Build locally to test
npm run build

# Deploy preview
npx vercel

# Deploy production
npx vercel --prod

# Check environment variables
npx vercel env ls

# View deployments
npx vercel ls

# View logs
npx vercel logs
```

---

## ✅ Success Criteria

Deployment is successful when:

- ✅ Build completes without errors
- ✅ All environment variables are set
- ✅ Homepage loads
- ✅ Login/signup pages work
- ✅ Auth flow works end-to-end
- ✅ Protected routes are protected
- ✅ Health check endpoint returns healthy

---

## 🎯 Next Steps After Deployment

1. **Test all auth flows** (signup, login, logout, session persistence)
2. **Monitor Vercel logs** for any errors
3. **Monitor Supabase dashboard** for API usage
4. **Set up error tracking** (optional, e.g., Sentry)
5. **Configure custom domain** (if not already done)
6. **Set up monitoring/alerts** for production issues

---

## 📞 Support

If deployment fails:
1. Check Vercel build logs
2. Check Supabase dashboard for errors
3. Verify environment variables are correct
4. Test locally first: `npm run build && npm run dev`
5. Review `AUTH_REBUILD_SUMMARY.md` for architecture details
