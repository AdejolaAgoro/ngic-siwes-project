-- admission enum type
create type public.admission_status as enum (
    "completed", 
    "approved",
    "pending",
    "rejected"
)

-- gender enum type
create type public.user_role as enum(
    "intern",
    "admin",
    "super_admin"
)

-- user_status enum type
create type public.user_status as enum(
    "suspended",
    "active",
    "deactivated"
)



