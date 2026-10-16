-- UUID Generation
create extension if not exists "pgcrypto";
-- To ignore case insensitivity text
create extension if not exists "citext"