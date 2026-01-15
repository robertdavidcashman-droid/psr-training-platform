# Google OAuth Setup Guide

This guide explains how to enable Google OAuth login for PSR Academy.

## Prerequisites

1. A Google Cloud Console account
2. A Supabase project

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add your app name (e.g., "PSR Academy")
7. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`
   - **Important**: Also add your Supabase callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
8. Click **Create** and note your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click to enable it
5. Enter your **Client ID** and **Client Secret** from Step 1
6. Save the configuration

## Step 3: Update Environment Variables

No additional environment variables are needed - the OAuth flow is handled entirely by Supabase.

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's login page
5. After successful login, you'll be redirected back to the dashboard

## Troubleshooting

### "redirect_uri_mismatch" Error
Make sure your redirect URI in Google Cloud Console exactly matches:
- `https://your-project-ref.supabase.co/auth/v1/callback`

### User Not Created in Database
Ensure your Supabase project has the proper trigger to create user records:

```sql
-- Run this in Supabase SQL Editor if users aren't being created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for sensitive data in production
- Regularly rotate your OAuth credentials
