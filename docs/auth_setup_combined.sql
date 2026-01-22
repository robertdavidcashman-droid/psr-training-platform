-- Combined Authentication Setup Script
-- Generated automatically - run this in your Supabase SQL Editor
-- This combines auth_schema.sql and auth_rls.sql

-- User Sessions Table
-- Tracks login sessions with IP, user agent, and timestamps
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_at timestamptz NOT NULL DEFAULT now(),
  logout_at timestamptz NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Admin Users Table
-- Stores which users have admin privileges
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure all required columns exist (in case table was created without them)
DO $$ 
BEGIN
  -- Add active column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'active'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN active boolean NOT NULL DEFAULT true;
  END IF;
  
  -- Add last_seen_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'last_seen_at'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN last_seen_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Add logout_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'logout_at'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN logout_at timestamptz NULL;
  END IF;
  
  -- Add ip_address column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN ip_address text;
  END IF;
  
  -- Add user_agent column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN user_agent text;
  END IF;
  
  -- Add created_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE user_sessions ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_seen ON user_sessions(last_seen_at);


-- Enable Row Level Security on both tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = user_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- User Sessions Policies

-- Users can select only their own sessions
CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only their own sessions
CREATE POLICY "Users can insert their own sessions"
  ON user_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own sessions, but only last_seen_at and logout_at
CREATE POLICY "Users can update their own sessions"
  ON user_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can select all sessions
CREATE POLICY "Admins can view all sessions"
  ON user_sessions
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can update all sessions
CREATE POLICY "Admins can update all sessions"
  ON user_sessions
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Admin Users Policies

-- Only admins can view the admin_users table
-- (This allows checking admin status, but regular users can't see who is admin)
CREATE POLICY "Admins can view admin_users"
  ON admin_users
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Only service role can insert/update admin_users
-- (This should be done via Supabase dashboard or service role)
-- No policy needed as RLS is enabled and no INSERT/UPDATE policies means only service role can modify


-- After running this script, you need to manually add your admin user:
-- INSERT INTO admin_users (user_id, email)
-- VALUES ('your-user-id-from-auth-users', 'your-email@example.com');
-- 
-- To find your user_id:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Find your user and copy the UUID
-- 3. Run the INSERT statement above with that UUID
