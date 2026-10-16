create table if not exists public.users (
    id uuid primary key references auth.user(id) on delete cascade,
    fullname text,
    email citext not null unique,
    role public.user_role not null default "intern",
    status public.user_status not null default "active",
    admission_status public.admission_status not null default "pending",
    email_verified boolean not null default 0,
    updated_at timestamptz not null default timezone("utc", now())
    created_at timestamptz not null default timezone("utc", now())
)

comment on table public.user is 'App-level profile data one-on-one with auth users'