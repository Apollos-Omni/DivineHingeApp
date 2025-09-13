-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_id UUID,
  karma_level INT DEFAULT 0,
  resilience_level INT DEFAULT 0,
  aura_level INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Create hinge_events table
CREATE TABLE IF NOT EXISTS hinge_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  door_id TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT now(),
  action TEXT CHECK (action IN ('open', 'close')),
  status TEXT CHECK (status IN ('locked', 'unlocked'))
);

-- Create karma_records table
CREATE TABLE IF NOT EXISTS karma_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  value INT,
  reason TEXT,
  timestamp TIMESTAMP DEFAULT now()
);

-- Create avatars table
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  level INT DEFAULT 1,
  experience INT DEFAULT 0,
  unlocked_upgrades TEXT[]
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  body TEXT,
  created_at TIMESTAMP DEFAULT now(),
  read BOOLEAN DEFAULT FALSE
);
