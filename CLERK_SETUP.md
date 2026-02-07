# Clerk Authentication Setup Guide

This app uses Clerk for secure, passwordless authentication via magic links.

## Step 1: Configure Clerk Dashboard

### Enable Magic Links (Passwordless)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application (or create a new one)
3. Navigate to **User & Authentication** → **Email, Phone, Username**
4. **Disable** "Password" authentication
5. **Enable** "Magic Link" authentication
6. Configure email settings (SMTP) if needed

### Configure Allowed URLs

1. Go to **Paths** in Clerk Dashboard
2. Set:
   - **Sign-in URL**: `/login`
   - **Sign-up URL**: `/signup`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

### Configure Redirect URLs

1. Go to **Paths** → **Redirect URLs**
2. Add:
   - `https://psrtrain.com/**` (production)
   - `https://*.vercel.app/**` (preview deployments)
   - `http://localhost:3000/**` (local development)

## Step 2: Get API Keys

1. In Clerk Dashboard, go to **API Keys**
2. Copy:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

## Step 3: Set Environment Variables in Vercel

### Via Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/robert-cashmans-projects/pstrain-rebuild
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. Click **Save**

### Via Vercel CLI

```bash
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
npx vercel env add CLERK_SECRET_KEY production
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
npx vercel env add CLERK_SECRET_KEY preview
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
npx vercel env add CLERK_SECRET_KEY development
```

## Step 4: Local Development Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Clerk keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Step 5: Verify Setup

1. Visit `https://psrtrain.com` (or `http://localhost:3000` locally)
2. Click "Sign In" or "Create Account"
3. Enter your email address
4. Check your email for the magic link
5. Click the link to sign in
6. You should be redirected to `/dashboard`

## Troubleshooting

### Magic links not working

- Verify magic links are enabled in Clerk Dashboard
- Check that password authentication is disabled
- Verify email settings in Clerk Dashboard
- Check spam folder for magic link emails

### Redirect issues

- Ensure redirect URLs are configured in Clerk Dashboard
- Verify `afterSignInUrl` and `afterSignUpUrl` match your routes
- Check that middleware is protecting routes correctly

### Environment variables not working

- Ensure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

## Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- Use different Clerk keys for development and production
- Rotate keys if they're accidentally exposed
- Enable MFA in Clerk Dashboard for additional security (optional)
