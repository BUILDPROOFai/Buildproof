-- The original schema gave admins full access to `projects`, but not to
-- `milestones`, `evidence`, or `reports` — those only had policies for
-- developers managing their own rows. Since your team (not developers)
-- is the one entering this data, admins need the same full access here.

create policy "Admins manage all milestones"
  on public.milestones for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins manage all evidence"
  on public.evidence for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
