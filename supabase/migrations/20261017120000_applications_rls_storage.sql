create extension if not exists pgcrypto;
create extension if not exists citext;

do $$ begin
  create type public.admission_status as enum ('completed', 'approved', 'pending', 'rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.user_role as enum ('intern', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.user_status as enum ('suspended', 'active', 'deactivated');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text not null default '',
  phone text,
  date_of_birth date,
  gender text check (gender in ('Male', 'Female', 'Other')),
  residential_address text,
  institution text,
  course text,
  academic_level text,
  matric_number text,
  cgpa numeric(4, 2) check (cgpa is null or (cgpa >= 0 and cgpa <= 5)),
  avatar_path text,
  role public.user_role not null default 'intern',
  status public.user_status not null default 'active',
  admission_status public.admission_status not null default 'pending',
  profile_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));
create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'super_admin')
  );
$$;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles" on public.profiles
for select to authenticated using ((select public.is_portal_admin()));

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  internship_period_months integer not null check (internship_period_months in (1, 2, 3, 6, 12, 18, 24)),
  cv_path text not null,
  student_id_path text not null,
  institution_letter_path text not null,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'rejected')),
  reviewer_id uuid references public.profiles(id),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_applicant_submitted_idx
on public.applications (applicant_id, submitted_at desc);
create unique index if not exists applications_one_per_applicant_uidx
on public.applications (applicant_id);

alter table public.applications enable row level security;
drop policy if exists "Applicants can read their own applications" on public.applications;
create policy "Applicants can read their own applications" on public.applications
for select to authenticated using (applicant_id = (select auth.uid()));
drop policy if exists "Applicants can submit their own applications" on public.applications;
create policy "Applicants can submit their own applications" on public.applications
for insert to authenticated with check (
  applicant_id = (select auth.uid()) and status = 'pending' and reviewer_id is null and
  cv_path like (select auth.uid())::text || '/%' and
  student_id_path like (select auth.uid())::text || '/%' and
  institution_letter_path like (select auth.uid())::text || '/%'
);
drop policy if exists "Admins can read all applications" on public.applications;
create policy "Admins can read all applications" on public.applications
for select to authenticated using ((select public.is_portal_admin()));
drop policy if exists "Admins can review applications" on public.applications;
create policy "Admins can review applications" on public.applications
for update to authenticated using ((select public.is_portal_admin()))
with check ((select public.is_portal_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('internship-documents', 'internship-documents', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = 10485760, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload documents to their own folder" on storage.objects;
create policy "Users can upload documents to their own folder" on storage.objects
for insert to authenticated with check (
  bucket_id = 'internship-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users and admins can read application documents" on storage.objects;
create policy "Users and admins can read application documents" on storage.objects
for select to authenticated using (
  bucket_id = 'internship-documents' and (
    (storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_portal_admin())
  )
);
drop policy if exists "Users can update documents in their own folder" on storage.objects;
create policy "Users can update documents in their own folder" on storage.objects
for update to authenticated using (
  bucket_id = 'internship-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (
  bucket_id = 'internship-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users can delete documents in their own folder" on storage.objects;
create policy "Users can delete documents in their own folder" on storage.objects
for delete to authenticated using (
  bucket_id = 'internship-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();
drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications
for each row execute procedure public.set_updated_at();

create or replace function public.prevent_profile_privilege_changes()
returns trigger language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and (
    new.role is distinct from old.role or
    new.status is distinct from old.status or
    new.admission_status is distinct from old.admission_status
  ) then
    raise exception 'Role and account status can only be changed by a trusted administrator.';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_prevent_privilege_changes on public.profiles;
create trigger profiles_prevent_privilege_changes before update on public.profiles
for each row execute procedure public.prevent_profile_privilege_changes();

create or replace function public.normalize_profile_privileges()
returns trigger language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null then
    new.role = 'intern';
    new.status = 'active';
    new.admission_status = 'pending';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_normalize_privileges on public.profiles;
create trigger profiles_normalize_privileges before insert on public.profiles
for each row execute procedure public.normalize_profile_privileges();
drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));



