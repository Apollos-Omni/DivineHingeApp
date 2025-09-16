-- 0002_storage_avatars.sql
-- Public avatar bucket with user-owned write access.

insert into storage.buckets (id, name, public)
values ('avatars','avatars', true)
on conflict (id) do nothing;

-- Allow public read of files in the avatars bucket
drop policy if exists "Public read access to avatars" on storage.objects;
create policy "Public read access to avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- Allow authenticated users to create files in avatars and mark them as owner
drop policy if exists "Users can upload avatars" on storage.objects;
create policy "Users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and
  (owner = auth.uid() or owner is null)
);

-- Allow owners to update their own avatar files
drop policy if exists "Owners can update their avatars" on storage.objects;
create policy "Owners can update their avatars"
on storage.objects for update
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

-- Allow owners to delete their own avatar files
drop policy if exists "Owners can delete their avatars" on storage.objects;
create policy "Owners can delete their avatars"
on storage.objects for delete
using (bucket_id = 'avatars' and owner = auth.uid());
