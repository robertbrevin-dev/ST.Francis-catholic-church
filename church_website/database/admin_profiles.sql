-- Admin Profiles Table
-- This table stores admin user profiles and links them to auth users

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin profiles
CREATE POLICY "Anyone can view admin profiles" ON admin_profiles
  FOR SELECT USING (true);

-- Create policy to allow admins to create admin profiles
CREATE POLICY "Admins can create admin profiles" ON admin_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles ap 
      WHERE ap.auth_user_id = auth.uid() 
      AND ap.is_active = true
    )
  );

-- Create policy to allow admins to update admin profiles
CREATE POLICY "Admins can update admin profiles" ON admin_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap 
      WHERE ap.auth_user_id = auth.uid() 
      AND ap.is_active = true
    )
  );

-- Create policy to allow admins to delete admin profiles
CREATE POLICY "Admins can delete admin profiles" ON admin_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap 
      WHERE ap.auth_user_id = auth.uid() 
      AND ap.is_active = true
    )
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_profiles_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_profiles_updated_at_column();

-- Create unique index on auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS admin_profiles_auth_user_id_idx ON admin_profiles (auth_user_id);
