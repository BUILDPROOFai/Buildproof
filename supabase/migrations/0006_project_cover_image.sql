-- Renders (the "what we intend to build" marketing image) are conceptually
-- different from evidence (dated proof of actual progress). Renders live
-- directly on the project and are always public; evidence stays gated.

alter table public.projects
  add column if not exists cover_image_url text;
