-- BuildProof initial schema
-- Run automatically when this repo is linked to a Supabase project, or manually via:
--   npx supabase db push

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles: one row per user, extends Supabase's built-in auth.users
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'buyer' check (role in ('admin', 'developer', 'buyer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- projects: the core unit everything else hangs off
-- ============================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text,
  developer_id uuid not null references public.profiles(id),
  description text,
  delivery_timeline date,
  status text not null default 'active' check (status in ('active', 'delayed', 'completed', 'on_hold')),
  risk_level text not null default 'on_track' check (risk_level in ('on_track', 'delayed', 'insufficient_evidence')),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Anyone can view projects"
  on public.projects for select
  using (true);

create policy "Developers manage their own projects"
  on public.projects for all
  using (auth.uid() = developer_id);

create policy "Admins manage all projects"
  on public.projects for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- milestones: planned construction stages per project
-- ============================================================
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  planned_date date,
  actual_date date,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'delayed')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.milestones enable row level security;

create policy "Anyone can view milestones"
  on public.milestones for select
  using (true);

create policy "Developers manage milestones on their own projects"
  on public.milestones for all
  using (exists (
    select 1 from public.projects p where p.id = project_id and p.developer_id = auth.uid()
  ));

-- ============================================================
-- evidence: dated photos/videos/documents tied to a milestone
-- ============================================================
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  file_url text not null,
  file_type text not null check (file_type in ('photo', 'video', 'document')),
  caption text,
  uploaded_by uuid references public.profiles(id),
  verification_level int not null default 1 check (verification_level between 1 and 5),
  hash text, -- populated later by the blockchain audit-trail layer
  created_at timestamptz not null default now()
);

alter table public.evidence enable row level security;

create policy "Anyone can view evidence"
  on public.evidence for select
  using (true);

create policy "Developers manage evidence on their own projects"
  on public.evidence for all
  using (exists (
    select 1 from public.projects p where p.id = project_id and p.developer_id = auth.uid()
  ));

-- ============================================================
-- reports: generated monthly progress reports
-- ============================================================
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  summary text,
  ai_draft text, -- populated later by the AI-assisted report drafting feature
  pdf_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Anyone can view published reports"
  on public.reports for select
  using (published = true);

create policy "Developers manage reports on their own projects"
  on public.reports for all
  using (exists (
    select 1 from public.projects p where p.id = project_id and p.developer_id = auth.uid()
  ));

create policy "Admins manage all reports"
  on public.reports for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- indexes worth having from day one
-- ============================================================
create index milestones_project_id_idx on public.milestones(project_id);
create index evidence_project_id_idx on public.evidence(project_id);
create index evidence_milestone_id_idx on public.evidence(milestone_id);
create index reports_project_id_idx on public.reports(project_id);
