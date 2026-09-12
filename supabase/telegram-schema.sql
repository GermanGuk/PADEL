-- Telegram admin bot — additional tables.
-- Run this once in the Supabase SQL editor, same way as schema.sql.
--
-- The bot runs entirely server-side (Next.js route handler) using the
-- service-role client — same trust model as the web admin. These tables
-- are never read with the anon key, so no public RLS policies are needed.

create table if not exists telegram_admins (
  id bigint primary key,           -- Telegram numeric user id
  name text,
  added_at timestamptz not null default now()
);

create table if not exists telegram_sessions (
  id bigint primary key,           -- Telegram numeric user id (one session per user)
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table telegram_admins enable row level security;
alter table telegram_sessions enable row level security;

grant usage on schema public to service_role;
grant all on telegram_admins, telegram_sessions to service_role;

-- Seed the owner so the bot responds to them immediately.
insert into telegram_admins (id, name)
values (7810796133, 'Owner')
on conflict (id) do nothing;
