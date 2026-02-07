# Quick Start: Clerk Magic Link Setup

Follow these steps to complete the authentication setup. Takes about 10 minutes.

## Step 1: Configure Clerk Dashboard (5 minutes)

### 1.1 Go to Clerk Dashboard
- Visit: https://dashboard.clerk.com
- Sign in or create a free account

### 1.2 Create/Select Application
- If new: Click "Create Application"
- If existing: Select your application
- Name it: "PSR Training Academy" (or any name)

### 1.3 Enable Magic Links (Passwordless)
1. Click **"User & Authentication"** in the left sidebar
2. Click **"Email, Phone, Username"**
3. Find **"Password"** section
   - Toggle **OFF** (disable password authentication)
4. Find **"Magic Link"** section
   - Toggle **ON** (enable magic link authentication)
5. Click **"Save"**

### 1.4 Configure Paths
1. Click **"Paths"** in the left sidebar
2. Set these values:
   - **Sign-in URL**: `/login`
   - **Sign-up URL**: `/signup`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`
3. Click **"Save"**

### 1.5 Configure Redirect URLs
1. Still in **"Paths"**, scroll to **"Redirect URLs"**
2. Click **"Add URL"**
3. Add these URLs (one at a time):
   - `https://psrtrain.com/**`
   - `https://*.vercel.app/**`
   - `http://localhost:3000/**` (for local development)
4. Click **"Save"** after each

## Step 2: Get Your Clerk API Keys (1 minute)

1. In Clerk Dashboard, click **"API Keys"** in the left sidebar
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. **Copy both keys** - you'll need them in the next step

## Step 3: Set Vercel Environment Variables (2 minutes)

### Option A: Using the Automation Script (Easiest)

1. Open terminal in your project folder
2. Make sure you're logged into Vercel:
   ```bash
   npx vercel login
   ```
3. Run the setup script:
   ```bash
   npm run clerk:setup:vercel
   ```
4. When prompted, paste your Clerk keys:
   - Paste Publishable Key when asked
   - Paste Secret Key when asked
5. The script will set them for Production, Preview, and Development automatically

### Option B: Using Vercel Dashboard (Manual)

1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables
2. Click **"Add New"**
3. Add **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**:
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: Paste your Publishable Key (pk_test_...)
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**
4. Click **"Add New"** again
5. Add **CLERK_SECRET_KEY**:
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: Paste your Secret Key (sk_test_...)
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**

## Step 4: Redeploy (Automatic or Manual)

### Automatic (Recommended)
- Vercel will automatically redeploy when you push code
- Since we already pushed, just wait 1-2 minutes for the deployment to complete

### Manual
1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild
2. Click **"Deployments"** tab
3. Find the latest deployment
4. Click the **"..."** menu → **"Redeploy"**

## Step 5: Test It! (2 minutes)

1. Visit: https://psrtrain.com
2. You should see the homepage with "Sign In to Start" button
3. Click **"Sign In"** or **"Create Account"**
4. Enter your email address (use a real email you can access)
5. Click **"Continue"** or **"Send magic link"**
6. Check your email inbox
7. Click the magic link in the email
8. You should be redirected to `/dashboard`
9. ✅ Success! Authentication is working

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the keys correctly
- Make sure keys are set in Vercel for the correct environment
- Redeploy after adding/changing environment variables

### Magic link email not received
- Check spam folder
- Verify email settings in Clerk Dashboard
- Make sure magic links are enabled (Step 1.3)

### Redirect issues
- Verify redirect URLs are set in Clerk Dashboard (Step 1.5)
- Check that `afterSignInUrl` matches `/dashboard`

### Still seeing password fields
- Make sure password is disabled in Clerk Dashboard (Step 1.3)
- Clear browser cache and try again

## Need Help?

- **Clerk Docs**: https://clerk.com/docs
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Vercel Dashboard**: https://vercel.com/robert-cashmans-projects/pstrain-rebuild
- **Setup Guide**: See `CLERK_SETUP.md` for detailed documentation
