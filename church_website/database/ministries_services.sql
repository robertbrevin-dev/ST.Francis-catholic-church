-- Ministries and parish services (sacraments) for public site + admin CMS
-- Run in Supabase SQL editor after admin_profiles exists.

CREATE TABLE IF NOT EXISTS ministries (
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
  updated_by UUID,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  note TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#7c4c2e',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ministries_select_public_or_admin" ON ministries FOR SELECT USING (
  is_active = true
  OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
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
  is_active = true
  OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.auth_user_id = auth.uid())
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
