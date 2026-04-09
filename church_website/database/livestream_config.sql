-- Livestream Configuration Table
-- This table stores the streaming URLs and meeting details for the church

CREATE TABLE IF NOT EXISTS livestream_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  youtube_url TEXT,
  youtube_title TEXT,
  youtube_description TEXT,
  youtube_poster_url TEXT,
  facebook_url TEXT,
  facebook_title TEXT,
  facebook_description TEXT,
  facebook_poster_url TEXT,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  zoom_passcode TEXT,
  zoom_title TEXT,
  zoom_description TEXT,
  zoom_poster_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keep schema aligned with frontend save payload for existing databases.
ALTER TABLE livestream_config ADD COLUMN IF NOT EXISTS youtube_poster_url TEXT;
ALTER TABLE livestream_config ADD COLUMN IF NOT EXISTS facebook_poster_url TEXT;
ALTER TABLE livestream_config ADD COLUMN IF NOT EXISTS zoom_poster_url TEXT;

-- Enable RLS (Row Level Security)
ALTER TABLE livestream_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read the config
CREATE POLICY "Anyone can view livestream config" ON livestream_config
  FOR SELECT USING (true);

-- Create policy to allow admin users to update the config
DROP POLICY IF EXISTS "Admins can update livestream config" ON livestream_config;

CREATE POLICY "livestream_admin_write" ON livestream_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
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
INSERT INTO livestream_config (
  id, 
  youtube_url, youtube_title, youtube_description, youtube_poster_url,
  facebook_url, facebook_title, facebook_description, facebook_poster_url,
  zoom_meeting_url, zoom_meeting_id, zoom_passcode, zoom_title, zoom_description, zoom_poster_url
)
VALUES (
  'main',
  '#', 'YouTube Live', 'Watch our live Masses and recorded services on YouTube.', NULL,
  '#', 'Facebook Live', 'Join us on Facebook Live for Sunday Masses and parish celebrations.', NULL,
  '#', 'xxx xxx xxxx', 'xxxxxx', 'Zoom Meeting', 'Join meetings, catechism, and prayer gatherings on Zoom.', NULL
)
ON CONFLICT (id) DO NOTHING;
