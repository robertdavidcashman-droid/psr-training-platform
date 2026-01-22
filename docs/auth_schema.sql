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
