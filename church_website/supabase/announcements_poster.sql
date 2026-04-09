-- Full schema + RLS + Storage policies: use instead:
--   church_website/database/announcements_complete.sql
--
-- This file only adds poster_url if you already ran the rest elsewhere:

alter table public.announcements
  add column if not exists poster_url text;
