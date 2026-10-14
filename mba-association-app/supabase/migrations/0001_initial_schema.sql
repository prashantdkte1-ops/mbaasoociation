-- DKTE MBA Professional Clubs Association schema
create extension if not exists pgcrypto;

create table if not exists public.clubs (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 short_name text,
 discipline text not null,
 description text not null default '',
 objectives text[] not null default '{}',
 cover_image_path text,
 display_order integer not null default 0,
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.academic_years (
 id uuid primary key default gen_random_uuid(),
 label text not null unique,
 start_date date not null,
 end_date date not null,
 is_current boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint academic_year_dates check (end_date >= start_date)
);
create unique index if not exists one_current_academic_year on public.academic_years (is_current) where is_current = true;

create table if not exists public.admin_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('admin','editor')),
 created_at timestamptz not null default now(),
 created_by uuid references auth.users(id)
);

create or replace function public.has_admin_role(allowed text[] default array['admin','editor'])
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_roles ar where ar.user_id=auth.uid() and ar.role=any(allowed)); $$;
revoke all on function public.has_admin_role(text[]) from public;
grant execute on function public.has_admin_role(text[]) to authenticated;

create table if not exists public.members (
 id uuid primary key default gen_random_uuid(),
 full_name text not null,
 slug text not null unique,
 designation text not null,
 member_type text not null default 'club' check (member_type in ('association','club','committee','faculty')),
 club_id uuid references public.clubs(id) on delete set null,
 academic_year_id uuid references public.academic_years(id) on delete set null,
 class_year text,
 division text,
 bio text not null default '',
 specialisations text[] not null default '{}',
 linkedin_url text,
 photo_path text,
 display_order integer not null default 0,
 show_email boolean not null default false,
 public_email text,
 show_phone boolean not null default false,
 public_phone text,
 is_published boolean not null default false,
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 created_by uuid references auth.users(id),
 updated_by uuid references auth.users(id),
 constraint linkedin_https check (linkedin_url is null or linkedin_url ~ '^https://(www\.)?linkedin\.com/')
);
create index if not exists members_public_listing on public.members(is_published,is_active,academic_year_id,display_order);
create index if not exists members_club_idx on public.members(club_id);

create table if not exists public.events (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text not null unique,
 club_id uuid references public.clubs(id) on delete set null,
 category text not null default 'Activity',
 description text not null default '',
 event_date date not null,
 start_time time,
 end_time time,
 venue text,
 cover_image_path text,
 registration_url text,
 status text not null default 'draft' check (status in ('draft','upcoming','completed','cancelled')),
 is_published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 created_by uuid references auth.users(id),
 updated_by uuid references auth.users(id),
 constraint event_registration_https check (registration_url is null or registration_url ~ '^https://')
);
create index if not exists events_public_listing on public.events(is_published,event_date,status);

create table if not exists public.event_gallery (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.events(id) on delete cascade,
 image_path text not null,
 caption text not null default '',
 alt_text text not null default '',
 display_order integer not null default 0,
 is_published boolean not null default false,
 created_at timestamptz not null default now(),
 created_by uuid references auth.users(id)
);
create table if not exists public.announcements (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text not null unique,
 body text not null default '',
 publish_at timestamptz,
 expires_at timestamptz,
 is_published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 created_by uuid references auth.users(id),
 constraint announcement_dates check (expires_at is null or publish_at is null or expires_at >= publish_at)
);
create table if not exists public.site_content (
 id uuid primary key default gen_random_uuid(),
 content_key text not null unique check (content_key in ('hero_heading','hero_description','association_intro','contact_details','membership_info','selection_process','rules','governance','footer_text','official_email','logo_path','social_links')),
 content_value jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users(id)
);
create table if not exists public.audit_logs (
 id uuid primary key default gen_random_uuid(),
 actor_user_id uuid references auth.users(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id uuid,
 summary text not null default '',
 created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- Public users only read explicitly published, active data.
alter table public.clubs enable row level security;
alter table public.academic_years enable row level security;
alter table public.admin_roles enable row level security;
alter table public.members enable row level security;
alter table public.events enable row level security;
alter table public.event_gallery enable row level security;
alter table public.announcements enable row level security;
alter table public.site_content enable row level security;
alter table public.audit_logs enable row level security;

create policy "public read active clubs" on public.clubs for select to anon,authenticated using (is_active or public.has_admin_role());
create policy "admins manage clubs" on public.clubs for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "public read academic years" on public.academic_years for select to anon,authenticated using (is_current or public.has_admin_role());
create policy "admins manage academic years" on public.academic_years for all to authenticated using (public.has_admin_role(array['admin'])) with check (public.has_admin_role(array['admin']));
create policy "users read own role admins read roles" on public.admin_roles for select to authenticated using (user_id=auth.uid() or public.has_admin_role(array['admin']));
create policy "only admins manage roles" on public.admin_roles for all to authenticated using (public.has_admin_role(array['admin'])) with check (public.has_admin_role(array['admin']));
create policy "public read published members" on public.members for select to anon,authenticated using ((is_published and is_active) or public.has_admin_role());
create policy "admins manage members" on public.members for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "public read published events" on public.events for select to anon,authenticated using ((is_published and status <> 'draft') or public.has_admin_role());
create policy "admins manage events" on public.events for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "public read published gallery" on public.event_gallery for select to anon,authenticated using (is_published or public.has_admin_role());
create policy "admins manage gallery" on public.event_gallery for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "public read active announcements" on public.announcements for select to anon,authenticated using ((is_published and (publish_at is null or publish_at <= now()) and (expires_at is null or expires_at >= now())) or public.has_admin_role());
create policy "admins manage announcements" on public.announcements for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "public read site content" on public.site_content for select to anon,authenticated using (true);
create policy "admins manage site content" on public.site_content for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "admins read audit logs" on public.audit_logs for select to authenticated using (public.has_admin_role(array['admin']));
create policy "admins write audit logs" on public.audit_logs for insert to authenticated with check (public.has_admin_role() and actor_user_id=auth.uid());

grant select on public.clubs,public.academic_years,public.members,public.events,public.event_gallery,public.announcements,public.site_content to anon,authenticated;
grant insert,update,delete on public.clubs,public.academic_years,public.members,public.events,public.event_gallery,public.announcements,public.site_content to authenticated;
grant select,insert on public.audit_logs to authenticated;
grant select on public.admin_roles to authenticated;
