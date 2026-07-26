-- Demo/seed data only — populates Prestige Manor with placeholder photos
-- (via picsum.photos, a free copyright-safe mock image service) and realistic
-- milestone statuses, so the public page can be reviewed fully populated
-- before any real photos exist. Safe to delete this data later from the
-- Table Editor once real evidence starts coming in.

update public.milestones set status = 'completed'
where project_id = (select id from public.projects where slug = 'prestige-manor')
  and name in ('Foundation', 'Substructure', 'Superstructure / framing');

update public.milestones set status = 'in_progress'
where project_id = (select id from public.projects where slug = 'prestige-manor')
  and name = 'Roofing';

insert into public.evidence (project_id, milestone_id, file_url, file_type, caption, verification_level, created_at)
select p.id, m.id, 'https://picsum.photos/seed/foundation-a/900/600', 'photo',
       'Foundation slab poured, east wing', 3, now() - interval '54 days'
from public.projects p join public.milestones m on m.project_id = p.id
where p.slug = 'prestige-manor' and m.name = 'Foundation';

insert into public.evidence (project_id, milestone_id, file_url, file_type, caption, verification_level, created_at)
select p.id, m.id, 'https://picsum.photos/seed/substructure-a/900/600', 'photo',
       'Substructure walls complete', 2, now() - interval '38 days'
from public.projects p join public.milestones m on m.project_id = p.id
where p.slug = 'prestige-manor' and m.name = 'Substructure';

insert into public.evidence (project_id, milestone_id, file_url, file_type, caption, verification_level, created_at)
select p.id, m.id, 'https://picsum.photos/seed/superstructure-a/900/600', 'photo',
       'Frame and columns, full structure', 3, now() - interval '22 days'
from public.projects p join public.milestones m on m.project_id = p.id
where p.slug = 'prestige-manor' and m.name = 'Superstructure / framing';

insert into public.evidence (project_id, milestone_id, file_url, file_type, caption, verification_level, created_at)
select p.id, m.id, 'https://picsum.photos/seed/roofing-a/900/600', 'photo',
       'Roofing in progress, east section', 1, now() - interval '3 days'
from public.projects p join public.milestones m on m.project_id = p.id
where p.slug = 'prestige-manor' and m.name = 'Roofing';

-- Also used as the page's hero image (the most recent photo overall).
insert into public.evidence (project_id, milestone_id, file_url, file_type, caption, verification_level, created_at)
select p.id, m.id, 'https://picsum.photos/seed/site-hero-a/1600/800', 'photo',
       'Site overview', 2, now() - interval '1 days'
from public.projects p join public.milestones m on m.project_id = p.id
where p.slug = 'prestige-manor' and m.name = 'Roofing';
