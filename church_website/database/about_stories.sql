CREATE TABLE IF NOT EXISTS about_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  occasion_type TEXT NOT NULL DEFAULT 'Other',
  event_date DATE,
  location TEXT NOT NULL DEFAULT '',
  people_present TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  impact TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  updated_by UUID,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_story_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES about_stories(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 1 AND sort_order <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE about_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_story_photos ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS about_story_photos_story_order_idx ON about_story_photos (story_id, sort_order);
CREATE INDEX IF NOT EXISTS about_story_photos_story_id_idx ON about_story_photos (story_id);

INSERT INTO about_story_photos (story_id, photo_url, photo_path, sort_order)
SELECT id, photo_url, photo_path, 1
FROM about_stories
WHERE photo_url <> ''
  AND photo_path <> ''
ON CONFLICT (story_id, sort_order) DO NOTHING;

DROP POLICY IF EXISTS "about_stories_select_public_or_admin" ON about_stories;
CREATE POLICY "about_stories_select_public_or_admin" ON about_stories FOR SELECT USING (
  is_active = true
  OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_stories_insert_admin" ON about_stories;
CREATE POLICY "about_stories_insert_admin" ON about_stories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_stories_update_admin" ON about_stories;
CREATE POLICY "about_stories_update_admin" ON about_stories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_stories_delete_admin" ON about_stories;
CREATE POLICY "about_stories_delete_admin" ON about_stories FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_story_photos_select_public_or_admin" ON about_story_photos;
CREATE POLICY "about_story_photos_select_public_or_admin" ON about_story_photos FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM about_stories s
    WHERE s.id = about_story_photos.story_id
      AND (
        s.is_active = true
        OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "about_story_photos_insert_admin" ON about_story_photos;
CREATE POLICY "about_story_photos_insert_admin" ON about_story_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_story_photos_update_admin" ON about_story_photos;
CREATE POLICY "about_story_photos_update_admin" ON about_story_photos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_story_photos_delete_admin" ON about_story_photos;
CREATE POLICY "about_story_photos_delete_admin" ON about_story_photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('about-gallery', 'about-gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "about_gallery_public_read" ON storage.objects;
CREATE POLICY "about_gallery_public_read" ON storage.objects FOR SELECT USING (
  bucket_id = 'about-gallery'
);

DROP POLICY IF EXISTS "about_gallery_admin_insert" ON storage.objects;
CREATE POLICY "about_gallery_admin_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_gallery_admin_update" ON storage.objects;
CREATE POLICY "about_gallery_admin_update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "about_gallery_admin_delete" ON storage.objects;
CREATE POLICY "about_gallery_admin_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'about-gallery'
  AND EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
);
