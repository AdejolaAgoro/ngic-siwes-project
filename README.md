# NGIC Internship Portal

React internship portal with Supabase authentication, profiles, application uploads, and admin review.

## Configure and run

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the same Supabase project under **Project Settings → API**.
3. Install dependencies with `npm install` and run `npm run dev`.

The browser uses only the Supabase publishable key. Never put a service-role or secret key in a `VITE_` variable.

## Database setup

Install Docker Desktop and the Supabase CLI, then run:

```sh
npx supabase start
npx supabase db reset
```

For a hosted project, link the CLI to that project, review the SQL files in `supabase/migrations`, and apply them with `npx supabase db push`. These migrations create Auth-linked profiles, application records, role-aware row-level security, and the private document bucket.

## User flow

New users sign up, confirm email when confirmation is enabled, complete their profile, and submit one application. Returning users who already have an application go directly to its current status after sign-in. Admin access requires a trusted database role change; for example, run the following in the Supabase SQL Editor after confirming the email:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

Applicants can read only their own application and documents. Admins can review all applications and open private documents through short-lived signed links.
