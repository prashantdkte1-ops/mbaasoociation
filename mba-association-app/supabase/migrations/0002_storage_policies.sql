-- Run after 0001. Public read is intentional for approved photos; writes require admin/editor role.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values
 ('member-photos','member-photos',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('event-media','event-media',true,10485760,array['image/jpeg','image/png','image/webp']),
 ('club-images','club-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "public read approved image buckets" on storage.objects for select to anon,authenticated using (bucket_id in ('member-photos','event-media','club-images'));
create policy "admins upload association images" on storage.objects for insert to authenticated with check (bucket_id in ('member-photos','event-media','club-images') and public.has_admin_role());
create policy "admins update association images" on storage.objects for update to authenticated using (bucket_id in ('member-photos','event-media','club-images') and public.has_admin_role()) with check (bucket_id in ('member-photos','event-media','club-images') and public.has_admin_role());
create policy "admins delete association images" on storage.objects for delete to authenticated using (bucket_id in ('member-photos','event-media','club-images') and public.has_admin_role());
