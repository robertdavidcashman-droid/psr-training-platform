# 🔐 Authentication System - Setup Checklist

## ✅ PASS/FAIL Checklist

### Step 1: Environment Setup
- [ ] Create `.env.local` file in project root
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`
- [ ] Run `npm run auth:verify` - Should show ✅ All checks passed

**Get credentials from:** Supabase Dashboard → Project Settings → API

---

### Step 2: Clean Install Test
- [ ] Run `rm -rf .next node_modules`
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Page loads without errors ✅

---

### Step 3: Signup Test
- [ ] Navigate to `/signup`
- [ ] Fill in email, password (min 6 chars), confirm password
- [ ] Click "Create Account"
- [ ] **Expected Result:**
  - ✅ If email confirmation disabled: Redirected to `/dashboard`
  - ✅ If email confirmation enabled: See "check your email" message

**PASS** if either result occurs | **FAIL** if error occurs

---

### Step 4: Login Test
- [ ] Navigate to `/login`
- [ ] Fill in email and password (use account from Step 3)
- [ ] Click "Sign In"
- [ ] **Expected Result:** Redirected to `/dashboard`

**PASS** if redirected to dashboard | **FAIL** if error or stays on login page

---

### Step 5: Session Persistence Test
- [ ] After logging in (Step 4), refresh the page (F5)
- [ ] **Expected Result:** Still on `/dashboard`, still logged in

**PASS** if session persists | **FAIL** if redirected to login

---

### Step 6: Protected Route Test (Logged Out)
- [ ] Logout (click logout button in header)
- [ ] Try to access `/dashboard`
- [ ] **Expected Result:** Redirected to `/login?redirect=/dashboard`

**PASS** if redirected to login | **FAIL** if can access dashboard

---

### Step 7: Protected Route Test (Logged In)
- [ ] Login again (Step 4)
- [ ] Navigate to `/practice` (protected route)
- [ ] **Expected Result:** Can access `/practice` page

**PASS** if can access protected route | **FAIL** if redirected to login

---

### Step 8: Logout Test
- [ ] While logged in, click logout button in header
- [ ] **Expected Result:** Redirected to home page `/`
- [ ] Try to access `/dashboard`
- [ ] **Expected Result:** Redirected to `/login`

**PASS** if logout works and protected routes blocked | **FAIL** if logout doesn't work

---

### Step 9: Auth Page Redirects Test
- [ ] Login (Step 4)
- [ ] Navigate to `/login` while logged in
- [ ] **Expected Result:** Redirected to `/dashboard`
- [ ] Navigate to `/signup` while logged in
- [ ] **Expected Result:** Redirected to `/dashboard`

**PASS** if redirected away from auth pages | **FAIL** if can access auth pages while logged in

---

### Step 10: E2E Tests
- [ ] Run `npm run test:e2e` (or `npm run e2e:auth`)
- [ ] **Expected Result:** All tests pass

**PASS** if all tests pass | **FAIL** if any test fails

---

## 🎯 Expected Results Summary

After completing all steps:
- ✅ Signup works
- ✅ Login works
- ✅ Session persists after refresh
- ✅ Protected routes block when logged out
- ✅ Protected routes work when logged in
- ✅ Logout works
- ✅ Auth pages redirect logged-in users
- ✅ E2E tests pass

---

## 🔧 Commands to Run

```bash
# 1. Clean install
rm -rf .next node_modules
npm install

# 2. Verify setup
npm run auth:verify

# 3. Start dev server
npm run dev

# 4. Run E2E tests
npm run test:e2e
# Or specifically auth tests:
npm run e2e:auth
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Missing Supabase environment variables"
**Fix:** Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: "Invalid login credentials" after signup
**Fix:** Email confirmation is enabled. Either:
- Check email and confirm account, OR
- Disable email confirmation in Supabase Dashboard → Authentication → Settings

### Issue: Session doesn't persist after refresh
**Fix:** Check that middleware is running. Verify `middleware.ts` exists and is properly configured.

### Issue: Infinite redirect loops
**Fix:** Check Supabase site URL configuration. Ensure `http://localhost:3000` is added to allowed URLs.

---

## 📋 Supabase Dashboard Configuration

### Required Settings:

1. **Site URL** (Authentication → URL Configuration):
   - Site URL: `http://localhost:3000` (dev) or your production URL
   - Redirect URLs: `http://localhost:3000/**` and `https://yourdomain.com/**`

2. **Email Confirmation** (Authentication → Settings):
   - **For Development:** Toggle OFF "Enable email confirmations"
   - **For Production:** Toggle ON "Enable email confirmations"

3. **CORS** (Settings → API):
   - Add: `http://localhost:3000`
   - Add: `https://yourdomain.com`
   - Add: `https://*.vercel.app` (for Vercel previews)

---

## ✅ Final Verification

If all checklist items pass:
- ✅ Authentication system is working correctly
- ✅ Ready for development/production use
- ✅ All tests passing

If any item fails:
- Check the error message
- Refer to troubleshooting section in `AUTH_REBUILD_SUMMARY.md`
- Verify Supabase dashboard configuration
- Run `npm run auth:verify` for diagnostics
