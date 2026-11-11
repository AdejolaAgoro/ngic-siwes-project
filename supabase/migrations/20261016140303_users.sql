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
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
