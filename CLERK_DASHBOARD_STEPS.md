# Clerk Dashboard Configuration - Step by Step

Follow these exact steps to configure magic links and redirect URLs.

## Part 1: Enable Magic Links & Disable Password

### Step 1: Open Clerk Dashboard
1. Go to: **https://dashboard.clerk.com**
2. Sign in with your Clerk account
3. Select your application (or create a new one if needed)

### Step 2: Navigate to Authentication Settings
1. In the left sidebar, click: **"User & Authentication"**
2. Then click: **"Email, Phone, Username"**

### Step 3: Disable Password Authentication
1. Scroll down to find the **"Password"** section
2. You'll see a toggle switch next to "Password"
3. **Click the toggle to turn it OFF** (it should be gray/unchecked)
4. This disables password-based sign-in

### Step 4: Enable Magic Link Authentication
1. Scroll down to find the **"Magic Link"** section
2. You'll see a toggle switch next to "Magic Link"
3. **Click the toggle to turn it ON** (it should be blue/checked)
4. This enables passwordless email magic links

### Step 5: Save Changes
1. Click the **"Save"** button at the top or bottom of the page
2. Wait for confirmation that settings are saved

---

## Part 2: Configure Paths & Redirect URLs

### Step 1: Navigate to Paths Settings
1. In the left sidebar, click: **"Paths"**

### Step 2: Set Application Paths
You'll see several input fields. Set these values:

1. **Sign-in URL**:
   - Field: `Sign-in URL`
   - Value: `/login`
   - (This tells Clerk where your sign-in page is)

2. **Sign-up URL**:
   - Field: `Sign-up URL`
   - Value: `/signup`
   - (This tells Clerk where your sign-up page is)

3. **After sign-in URL**:
   - Field: `After sign-in URL`
   - Value: `/dashboard`
   - (Where users go after clicking magic link)

4. **After sign-up URL**:
   - Field: `After sign-up URL`
   - Value: `/dashboard`
   - (Where users go after creating account)

### Step 3: Set Redirect URLs
1. Scroll down to the **"Redirect URLs"** section
2. You'll see a list (might be empty) and an **"Add URL"** button

3. Click **"Add URL"** and add these URLs **one at a time**:

   **First URL:**
   - Click "Add URL"
   - Enter: `https://psrtrain.com/**`
   - Click "Save" or "Add"

   **Second URL:**
   - Click "Add URL" again
   - Enter: `https://*.vercel.app/**`
   - Click "Save" or "Add"

   **Third URL (for local development):**
   - Click "Add URL" again
   - Enter: `http://localhost:3000/**`
   - Click "Save" or "Add"

### Step 4: Save All Path Settings
1. Click **"Save"** button
2. Wait for confirmation

---

## Verification Checklist

After completing both parts, verify:

- [ ] Password authentication is **OFF** (gray/unchecked)
- [ ] Magic Link authentication is **ON** (blue/checked)
- [ ] Sign-in URL is set to `/login`
- [ ] Sign-up URL is set to `/signup`
- [ ] After sign-in URL is set to `/dashboard`
- [ ] After sign-up URL is set to `/dashboard`
- [ ] Redirect URLs include:
  - [ ] `https://psrtrain.com/**`
  - [ ] `https://*.vercel.app/**`
  - [ ] `http://localhost:3000/**`

---

## Quick Reference: Exact Menu Paths

**To disable password / enable magic link:**
```
Dashboard → User & Authentication → Email, Phone, Username
```

**To set paths and redirect URLs:**
```
Dashboard → Paths
```

---

## Troubleshooting

### Can't find "Magic Link" option?
- Make sure you're in **"User & Authentication"** → **"Email, Phone, Username"**
- Some Clerk plans might have it under a different name - look for "Email Link" or "Passwordless"

### Redirect URLs won't save?
- Make sure you include the `/**` at the end (wildcard for all paths)
- Check for typos in the URLs
- Try saving one at a time

### Still seeing password fields?
- Clear your browser cache
- Make sure you clicked "Save" after disabling password
- Check that you're looking at the right application in Clerk Dashboard

---

## Next Steps

After completing these steps:
1. Get your API keys (see Step 2 in QUICK_START_CLERK.md)
2. Set environment variables in Vercel (see Step 3 in QUICK_START_CLERK.md)
3. Test the authentication flow
