do $$ begin
  create type public.admission_status as enum ('completed', 'approved', 'pending', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role as enum ('intern', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_status as enum ('suspended', 'active', 'deactivated');
exception when duplicate_object then null; end $$;
