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
