# Magic Link Email Setup Guide

If you're not receiving magic link emails, follow these steps to fix the issue:

## Step 1: Configure Supabase Authentication Settings

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration** (or **Settings** → **Auth**)
4. Configure the following:

### Site URL
Set your production URL:
```
https://psrtrain.com
```

### Redirect URLs
Add these redirect URLs (click "Add URL" for each):
```
https://psrtrain.com/auth/callback
https://psrtrain.com/**
```

**Important:** For local development, also add:
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

## Step 2: Check Email Settings

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Verify that email templates are enabled
3. Check the "Magic Link" template exists

## Step 3: Check Email Rate Limits

Supabase free tier has email rate limits:
- **Free tier**: 4 emails per hour per user
- If you've hit the limit, wait 1 hour before trying again

## Step 4: Verify Email Configuration

1. In Supabase Dashboard, go to **Settings** → **Auth**
2. Scroll down to **Email Auth** section
3. Verify:
   - ✅ "Enable email confirmations" - Can be ON or OFF (OFF for faster testing)
   - ✅ "Enable email signups" - Must be ON
   - ✅ Email templates are configured

## Step 5: Check Spam Folder

- Check your spam/junk folder
- Check if emails from `noreply@mail.app.supabase.io` are being blocked
- Add Supabase email domain to your email whitelist if needed

## Step 6: Test with Different Email

Try requesting a magic link with a different email address to see if it's email-specific.

## Step 7: Check Supabase Logs

1. In Supabase Dashboard, go to **Logs** → **Auth Logs**
2. Look for any errors when requesting magic links
3. Check for rate limit errors or email sending failures

## Step 8: Verify Environment Variables (Production)

In your Vercel project settings, ensure these environment variables are set:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 9: Custom SMTP (Optional - Recommended for Production)

For better email deliverability, configure custom SMTP:

1. In Supabase Dashboard, go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your own SMTP server (e.g., SendGrid, Mailgun, AWS SES)
3. This bypasses Supabase email limits and improves deliverability

### Example SMTP Configuration:
- **SMTP Host**: smtp.sendgrid.net
- **SMTP Port**: 587
- **SMTP User**: apikey
- **SMTP Password**: Your SendGrid API key
- **Sender email**: Your verified sender email
- **Sender name**: PSR Training Platform

## Troubleshooting Checklist

- [ ] Site URL is set to `https://psrtrain.com`
- [ ] Redirect URLs include `https://psrtrain.com/auth/callback`
- [ ] Email signups are enabled in Supabase
- [ ] Checked spam folder
- [ ] Not hitting rate limits (wait 1 hour if needed)
- [ ] Environment variables are set in Vercel
- [ ] Checked Supabase Auth Logs for errors

## Still Not Working?

If emails still don't arrive:

1. **Check Supabase Status**: Visit https://status.supabase.com to see if there are any outages
2. **Try Development Mode**: Test with `http://localhost:3000` first to isolate production issues
3. **Contact Support**: Check Supabase support or consider setting up custom SMTP for better reliability

## Quick Test

1. Request a magic link at https://psrtrain.com/signup
2. Check your email (and spam folder) within 1-2 minutes
3. If it arrives, click the link to verify it works
4. If it doesn't arrive, check Supabase Auth Logs for errors


















