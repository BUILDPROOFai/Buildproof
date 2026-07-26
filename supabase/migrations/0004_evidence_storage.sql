-- Creates the storage bucket that holds evidence photos/renders/documents,
-- and sets access rules matching the rest of the app: admins can upload,
-- anyone can view (since project pages are public, no login required).

insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

create policy "Anyone can view evidence files"
  on storage.objects for select
  using (bucket_id = 'evidence');

create policy "Admins can upload evidence files"
  on storage.objects for insert
  with check (
    bucket_id = 'evidence'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete evidence files"
  on storage.objects for delete
  using (
    bucket_id = 'evidence'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
