# How to Get an OpenAI API Key

## Step-by-Step Guide

### Step 1: Create an OpenAI Account
1. Go to **https://platform.openai.com/**
2. Click **"Sign up"** (or **"Log in"** if you already have an account)
3. Complete the registration process:
   - Enter your email address
   - Create a password
   - Verify your email address
   - Complete any additional verification steps

### Step 2: Add Payment Method (Required)
1. Once logged in, you'll need to add a payment method
2. Click on your profile/account icon (usually top-right)
3. Go to **"Billing"** or **"Settings" → "Billing"**
4. Click **"Add payment method"**
5. Enter your credit card details
   - Note: OpenAI charges based on usage (pay-as-you-go)
   - You can set spending limits to control costs
   - There's usually a small free tier or credits when you first sign up

### Step 3: Create an API Key
1. Go to **https://platform.openai.com/api-keys**
   - Or navigate: Click your profile → **"API Keys"**
2. Click **"Create new secret key"** button
3. Give your key a name (e.g., "PSR Training Platform")
4. Click **"Create secret key"**
5. **IMPORTANT**: Copy the key immediately! 
   - You'll only see it once
   - It will look like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - If you lose it, you'll need to create a new one

### Step 4: Add to Your .env.local File
1. Open your `.env.local` file in the project
2. Find the line: `OPENAI_API_KEY=your_openai_api_key_here`
3. Replace `your_openai_api_key_here` with your actual API key
4. Save the file

**Example:**
```env
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

### Step 5: Set Usage Limits (Recommended)
1. Go to **"Usage"** or **"Billing" → "Usage limits"**
2. Set a monthly spending limit (e.g., $10, $20, or whatever you're comfortable with)
3. This prevents unexpected charges

---

## Important Notes

### ⚠️ Security
- **Never commit your API key to Git/GitHub**
- The `.env.local` file is already in `.gitignore` (it won't be committed)
- Don't share your API key publicly
- If you accidentally expose it, revoke it and create a new one

### 💰 Pricing
- OpenAI charges based on usage (per request)
- Check current pricing at: https://openai.com/pricing
- GPT-4 models cost more than GPT-3.5
- You can start with GPT-3.5 (cheaper) and upgrade later

### 🔄 Optional vs Required
- **Optional**: The app will work without an OpenAI key
- **Required for**: 
  - AI question generation from sources
  - AI scenario simulation
  - Duplicate question detection
- **Without it**: You can still use all other features (practice, modules, etc.)

### 🧪 Testing
- You can test your API key works by running a simple API call
- Or just try using the AI features in the app
- If there's an error, check the console/logs

---

## Alternative: Skip OpenAI for Now

If you want to test the app without AI features first:

1. You can leave `OPENAI_API_KEY=your_openai_api_key_here` as-is
2. The app will work fine - just AI features won't be available
3. You can add the key later when you're ready

---

## Quick Checklist

- [ ] Create OpenAI account at platform.openai.com
- [ ] Add payment method
- [ ] Create API key from https://platform.openai.com/api-keys
- [ ] Copy the key (save it securely)
- [ ] Add to `.env.local` file
- [ ] Set usage limits (recommended)
- [ ] Restart dev server (`npm run dev`)

---

## Need Help?

- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Support: https://help.openai.com/
- API Reference: https://platform.openai.com/docs/api-reference

Once you have your API key, update the `.env.local` file and restart your development server!

























