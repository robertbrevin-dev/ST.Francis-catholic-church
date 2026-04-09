CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  display_date text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  color text NOT NULL DEFAULT '#7c4c2e',
  pinned boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  poster_url text,
  author_id uuid REFERENCES public.admin_profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS poster_url text;

CREATE INDEX IF NOT EXISTS announcements_public_list_idx
  ON public.announcements (is_active, expires_at DESC, pinned DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS public.announcement_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS announcement_likes_announcement_id_idx
  ON public.announcement_likes (announcement_id);

CREATE TABLE IF NOT EXISTS public.parish_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  message text NOT NULL,
  avatar text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS parish_messages_created_at_idx
  ON public.parish_messages (created_at ASC);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_select_public_or_admin" ON public.announcements;
CREATE POLICY "announcements_select_public_or_admin"
  ON public.announcements
  FOR SELECT
  USING (
    (
      is_active = true
      AND expires_at > now()
    )
    OR EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "announcements_insert_admin" ON public.announcements;
CREATE POLICY "announcements_insert_admin"
  ON public.announcements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "announcements_update_admin" ON public.announcements;
CREATE POLICY "announcements_update_admin"
  ON public.announcements
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "announcements_delete_admin" ON public.announcements;
CREATE POLICY "announcements_delete_admin"
  ON public.announcements
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

ALTER TABLE public.announcement_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcement_likes_select_public" ON public.announcement_likes;
CREATE POLICY "announcement_likes_select_public"
  ON public.announcement_likes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "announcement_likes_insert_public" ON public.announcement_likes;
CREATE POLICY "announcement_likes_insert_public"
  ON public.announcement_likes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.announcements a
      WHERE a.id = announcement_id
        AND a.is_active = true
        AND a.expires_at > now()
    )
  );

ALTER TABLE public.parish_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "parish_messages_select_public_or_admin" ON public.parish_messages;
CREATE POLICY "parish_messages_select_public_or_admin"
  ON public.parish_messages
  FOR SELECT
  USING (
    is_visible = true
    OR EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "parish_messages_insert_public" ON public.parish_messages;
CREATE POLICY "parish_messages_insert_public"
  ON public.parish_messages
  FOR INSERT
  WITH CHECK (
    length(trim(sender_name)) > 0
    AND length(trim(message)) > 0
  );

DROP POLICY IF EXISTS "parish_messages_update_admin" ON public.parish_messages;
CREATE POLICY "parish_messages_update_admin"
  ON public.parish_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "parish_messages_delete_admin" ON public.parish_messages;
CREATE POLICY "parish_messages_delete_admin"
  ON public.parish_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'announcement-posters',
  'announcement-posters',
  true,
  6291456,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "announcement_posters_public_read" ON storage.objects;
CREATE POLICY "announcement_posters_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'announcement-posters');

DROP POLICY IF EXISTS "announcement_posters_admin_insert" ON storage.objects;
CREATE POLICY "announcement_posters_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'announcement-posters'
    AND EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "announcement_posters_admin_update" ON storage.objects;
CREATE POLICY "announcement_posters_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'announcement-posters'
    AND EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (bucket_id = 'announcement-posters');

DROP POLICY IF EXISTS "announcement_posters_admin_delete" ON storage.objects;
CREATE POLICY "announcement_posters_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'announcement-posters'
    AND EXISTS (
      SELECT 1
      FROM public.admin_profiles ap
      WHERE ap.auth_user_id = auth.uid()
    )
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parish_messages;
