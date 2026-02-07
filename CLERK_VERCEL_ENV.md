# Vercel Environment Variables Setup

## Required Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

### Production Environment

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
CLERK_SECRET_KEY=sk_live_... (or sk_test_... for testing)
```

### Preview Environment

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Development Environment

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Quick Setup Steps

1. **Get your Clerk keys:**
   - Go to https://dashboard.clerk.com
   - Select your application
   - Navigate to **API Keys**
   - Copy the **Publishable Key** and **Secret Key**

2. **Add to Vercel:**
   - Go to https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables
   - Click **Add New**
   - Add each variable for all three environments (Production, Preview, Development)
   - Click **Save**

3. **Redeploy:**
   - After adding variables, trigger a new deployment
   - Or push a commit to trigger automatic deployment

## Verification

After deployment, verify:
- Visit https://psrtrain.com
- Click "Sign In"
- Enter an email address
- Check email for magic link
- Click link to sign in
- Should redirect to `/dashboard`

## Troubleshooting

If authentication doesn't work:
1. Verify environment variables are set correctly
2. Check variable names match exactly (case-sensitive)
3. Ensure variables are set for the correct environment
4. Redeploy after adding/changing variables
5. Check Clerk Dashboard → Paths → Redirect URLs includes your domain
