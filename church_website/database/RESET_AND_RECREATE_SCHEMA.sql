BEGIN;

DROP POLICY IF EXISTS "about_gallery_public_read" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_delete" ON storage.objects;

DROP TABLE IF EXISTS about_story_photos CASCADE;
DROP TABLE IF EXISTS about_stories CASCADE;
DROP TABLE IF EXISTS giving_purposes CASCADE;
DROP TABLE IF EXISTS parish_settings CASCADE;
DROP TABLE IF EXISTS ministries CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS livestream_config CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

DROP FUNCTION IF EXISTS update_admin_profiles_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'parish_it_officer',
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX admin_profiles_auth_user_id_idx ON admin_profiles(auth_user_id);

CREATE TABLE about_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  occasion_type TEXT NOT NULL DEFAULT 'Other',
  event_date DATE,
  location TEXT NOT NULL DEFAULT '',
  people_present TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  impact TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL DEFAULT '',
  photo_path TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE about_story_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES about_stories(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 1 AND sort_order <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX about_story_photos_story_order_idx ON about_story_photos(story_id, sort_order);
CREATE INDEX about_story_photos_story_id_idx ON about_story_photos(story_id);

CREATE TABLE parish_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  updated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE giving_purposes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  meets TEXT NOT NULL DEFAULT '',
  contact_info TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#7c4c2e',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  note TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#7c4c2e',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE livestream_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  youtube_url TEXT,
  facebook_url TEXT,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  zoom_passcode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_livestream_config_updated_at
  BEFORE UPDATE ON livestream_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_story_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE parish_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestream_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_profiles_select_own" ON admin_profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "admin_profiles_update_own" ON admin_profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "admin_profiles_insert_by_admin" ON admin_profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid() AND ap.is_active = true)
  );

CREATE POLICY "about_stories_select_public_or_admin" ON about_stories FOR SELECT USING (
  is_active = true
  OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_stories_insert_admin" ON about_stories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_stories_update_admin" ON about_stories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_stories_delete_admin" ON about_stories FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_story_photos_select_public_or_admin" ON about_story_photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM about_stories s
    WHERE s.id = about_story_photos.story_id
      AND (s.is_active = true OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid()))
  )
);

CREATE POLICY "about_story_photos_insert_admin" ON about_story_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_story_photos_update_admin" ON about_story_photos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_story_photos_delete_admin" ON about_story_photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "ministries_select_public_or_admin" ON ministries FOR SELECT USING (
  is_active = true OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "ministries_insert_admin" ON ministries FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "ministries_update_admin" ON ministries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "ministries_delete_admin" ON ministries FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "services_select_public_or_admin" ON services FOR SELECT USING (
  is_active = true OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "services_insert_admin" ON services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "services_update_admin" ON services FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "services_delete_admin" ON services FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "parish_settings_admin_select" ON parish_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "parish_settings_admin_update" ON parish_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "giving_purposes_public_select" ON giving_purposes FOR SELECT USING (
  is_active = true OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "giving_purposes_admin_all" ON giving_purposes FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "livestream_select_public" ON livestream_config FOR SELECT USING (true);

CREATE POLICY "livestream_admin_write" ON livestream_config FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('about-gallery', 'about-gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "about_gallery_public_read" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "about_gallery_admin_delete" ON storage.objects;

CREATE POLICY "about_gallery_public_read" ON storage.objects FOR SELECT USING (
  bucket_id = 'about-gallery'
);

CREATE POLICY "about_gallery_admin_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_gallery_admin_update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

CREATE POLICY "about_gallery_admin_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

INSERT INTO livestream_config (id, youtube_url, facebook_url, zoom_meeting_url, zoom_meeting_id, zoom_passcode)
VALUES ('main', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parish_settings (key, value, label) VALUES
  ('mpesa_paybill', '', 'M-PESA Paybill number'),
  ('mpesa_account', '', 'M-PESA Account name'),
  ('church_phone', '', 'Parish phone'),
  ('whatsapp', '', 'WhatsApp number'),
  ('office_hours', '', 'Office hours')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.admin_profiles (auth_user_id, role, display_name, email, phone, is_active)
SELECT
  u.id,
  'parish_it_officer',
  COALESCE(
    NULLIF(btrim(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(btrim(u.raw_user_meta_data->>'name'), ''),
    initcap(replace(split_part(COALESCE(u.email, 'user@local'), '@', 1), '.', ' '))
  ),
  COALESCE(u.email, 'user-' || u.id::text || '@placeholder.local'),
  NULLIF(btrim(COALESCE(u.phone::text, '')), ''),
  true
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.admin_profiles ap WHERE ap.auth_user_id = u.id);

COMMIT;
