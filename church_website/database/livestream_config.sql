-- Livestream Configuration Table
-- This table stores the streaming URLs and meeting details for the church

CREATE TABLE IF NOT EXISTS livestream_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  youtube_url TEXT,
  facebook_url TEXT,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  zoom_passcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE livestream_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read the config
CREATE POLICY "Anyone can view livestream config" ON livestream_config
  FOR SELECT USING (true);

-- Create policy to allow admin users to update the config
CREATE POLICY "Admins can update livestream config" ON livestream_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_livestream_config_updated_at
  BEFORE UPDATE ON livestream_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default configuration if it doesn't exist
INSERT INTO livestream_config (id, youtube_url, facebook_url, zoom_meeting_url, zoom_meeting_id, zoom_passcode)
VALUES (
  'main',
  '#',
  '#',
  '#',
  'xxx xxx xxxx',
  'xxxxxx'
)
ON CONFLICT (id) DO NOTHING;
