-- Add Admin User
-- Run this in Supabase SQL Editor after you have your user UUID

-- Step 1: Find your user UUID by email
-- Run this query first to find your user ID:
SELECT id, email 
FROM auth.users 
WHERE email = 'robertdavidcashman@gmail.com';

-- Step 2: Copy the UUID from the result above, then run this INSERT:
-- (Replace 'YOUR-UUID-HERE' with the actual UUID from Step 1)
INSERT INTO admin_users (user_id, email)
VALUES ('YOUR-UUID-HERE', 'robertdavidcashman@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

-- Alternative: If you want to do it in one step (requires service role or admin access):
-- This will automatically find your user by email and add them as admin
INSERT INTO admin_users (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'robertdavidcashman@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
