-- Top Padel Alicante — content schema (Supabase / Postgres).
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
--
-- Auth model: admin login is NOT Supabase Auth — the app gates /admin with its
-- own password + signed cookie (see src/lib/auth.ts, ADMIN_PASSWORD /
-- ADMIN_SESSION_SECRET). Supabase here is only Postgres + Storage:
--   - public (anon key) may SELECT everything, nothing else.
--   - all writes go through the server-role key from server actions, which
--     bypasses RLS entirely — the app's own password gate is the real
--     access control, so no "authenticated" RLS policies are needed.

create extension if not exists pgcrypto;

-- ── Games / tournaments ──────────────────────────────────────────────
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  featured boolean not null default false,
  badge text not null,
  title text not null,
  meta jsonb not null default '[]', -- [{ icon: "players"|"courts"|"clock"|"location", text: string }]
  extra text,
  price text,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Training plans / pricing ─────────────────────────────────────────
create table if not exists training_plans (
  id uuid primary key default gen_random_uuid(),
  dark boolean not null default false,
  number text not null,
  title text not null,
  description text not null,
  price text not null,
  icon text not null default 'solo' check (icon in ('solo', 'group')),
  rows jsonb not null default '[]', -- [{ label, oldPrice, newPrice }]
  sort_order integer not null default 0
);

-- ── Gallery ───────────────────────────────────────────────────────────
create table if not exists gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  category_id uuid references gallery_categories(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Padel Journal ─────────────────────────────────────────────────────
create table if not exists journal_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id uuid references journal_categories(id) on delete set null,
  slug text not null unique,
  cover text not null,
  body text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Site-wide SEO (homepage title/description + favicon) and social links ──
-- Singleton row: always id = 1.
create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  seo_title text not null,
  seo_description text not null,
  favicon_url text,
  telegram_url text,
  instagram_url text,
  whatsapp_url text
);

-- ── Row Level Security: public read, no anon/authenticated writes ───
-- (writes only via the service-role key, which bypasses RLS)
alter table games enable row level security;
alter table training_plans enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_images enable row level security;
alter table journal_categories enable row level security;
alter table articles enable row level security;
alter table site_settings enable row level security;

create policy "public read games" on games for select using (true);
create policy "public read training_plans" on training_plans for select using (true);
create policy "public read gallery_categories" on gallery_categories for select using (true);
create policy "public read gallery_images" on gallery_images for select using (true);
create policy "public read journal_categories" on journal_categories for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read site_settings" on site_settings for select using (true);

-- RLS controls row visibility, but Postgres also needs table-level grants
-- for the anon/authenticated roles to query at all — new projects don't
-- always have these pre-configured for tables created via the SQL editor.
grant usage on schema public to anon, authenticated, service_role;

grant select on
  games, training_plans, gallery_categories, gallery_images,
  journal_categories, articles, site_settings
to anon, authenticated;

grant all on
  games, training_plans, gallery_categories, gallery_images,
  journal_categories, articles, site_settings
to service_role;

-- ── Storage bucket for admin-uploaded photos ─────────────────────────
-- Folders: photos/games, photos/gallery, photos/journal, photos/settings
-- (mirrors the current public/uploads/<folder> layout).
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;
-- No insert/update/delete policies for anon/authenticated: the bucket is
-- public for reads, and all writes go through the service-role key.

-- ── Seed data: mirrors the current mock admin content (data/mock-db.json)
--    so the site looks identical the moment Supabase is wired in. Safe to
--    re-run (idempotent on empty tables only — skip if you already edited
--    content in /admin). Seed photos stay on their current /images/... path;
--    only new uploads through the admin go to Storage.

insert into games (featured, badge, title, meta, extra, price, image, sort_order)
select * from (values
  (true, '19 сентября · Суббота', 'Mexicano El Salt',
    '[{"icon":"players","text":"20 игроков"},{"icon":"courts","text":"4 корта"},{"icon":"clock","text":"19:30–21:30"},{"icon":"location","text":"El Salt"}]'::jsonb,
    null::text, '15 €', '/images/games/featured.png', 0),
  (false, '22 сентября · Вторник', 'Americano Teams-',
    '[{"icon":"players","text":"6 пар"},{"icon":"courts","text":"3 корта"},{"icon":"clock","text":"19:00–22:00"},{"icon":"location","text":"El Salt"}]'::jsonb,
    null, null, null, 1),
  (false, '25 сентября · Пятница', 'Americano 1100+',
    '[{"icon":"players","text":"6 пар"},{"icon":"courts","text":"3 корта"},{"icon":"clock","text":"19:00–22:00"},{"icon":"location","text":"El Salt"}]'::jsonb,
    null, '18 €', null, 2),
  (false, '30 сентября · Среда', 'Микст Ж+М',
    '[{"icon":"players","text":"8 пар"},{"icon":"courts","text":"4 корта"},{"icon":"clock","text":"20:00–22:00"},{"icon":"location","text":"Essence Padel Club"}]'::jsonb,
    null, '15 €', null, 3)
) as v
where not exists (select 1 from games);

insert into training_plans (dark, number, title, description, price, icon, rows, sort_order)
select * from (values
  (false, '01.', 'Индивидуальные тренировки', 'Персональная работа с тренером только над твоей игрой.', '30 €', 'solo',
    '[{"label":"4 тренировки","oldPrice":"120 €","newPrice":"100 €"},{"label":"8 тренировок","oldPrice":"240 €","newPrice":"180 €"}]'::jsonb, 0),
  (true, '02.', 'Групповая тренировка', 'Тренируйся в команде с игроками своего уровня.', '40 €', 'group',
    '[{"label":"4 тренировки","oldPrice":"160 €","newPrice":"140 €"},{"label":"8 тренировки","oldPrice":"320 €","newPrice":"260 €"}]'::jsonb, 1)
) as v
where not exists (select 1 from training_plans);

with seeded_gallery_categories as (
  insert into gallery_categories (name)
  select name from (values ('Тренировки'), ('Турниры'), ('Top Padel Academy')) as v(name)
  where not exists (select 1 from gallery_categories)
  returning id, name
)
insert into gallery_images (url, category_id, sort_order)
select v.url, c.id, v.sort_order
from (values
  ('/images/gallery/1.png', 'Турниры', 0),
  ('/images/gallery/2.png', 'Тренировки', 1),
  ('/images/gallery/3.png', 'Top Padel Academy', 2),
  ('/images/gallery/4.png', 'Тренировки', 3),
  ('/images/gallery/5.png', 'Турниры', 4),
  ('/images/gallery/6.png', 'Top Padel Academy', 5),
  ('/images/gallery/7.png', 'Тренировки', 6),
  ('/images/gallery/8.png', 'Турниры', 7)
) as v(url, category_name, sort_order)
join seeded_gallery_categories c on c.name = v.category_name
where not exists (select 1 from gallery_images);

with seeded_journal_categories as (
  insert into journal_categories (name)
  select name from (values ('Советы'), ('Тренировки'), ('Турниры')) as v(name)
  where not exists (select 1 from journal_categories)
  returning id, name
)
insert into articles (title, category_id, slug, cover, body, seo_title, seo_description, published, sort_order)
select v.title, c.id, v.slug, v.cover, v.body, v.seo_title, v.seo_description, true, v.sort_order
from (values
  (
    'Как подобрать правильную ракетку для падела', 'Советы',
    'kak-podobrat-pravilnuyu-raketku-dlya-padela', '/images/journal/article-1.png',
    E'Ракетка для падела — это не про "дороже значит лучше". Важнее вес, баланс и форма под твой уровень и стиль игры. Новичкам обычно подходят более лёгкие ракетки круглой формы — они прощают неточное попадание в мяч. Игрокам с опытом — ракетки слезовидной или ромбовидной формы, которые дают больше мощности в удар.\n\nПеред покупкой лучше взять ракетку на пробную тренировку: почувствовать вес в руке и то, как она отзывается на удар, важнее любых характеристик на бумаге.',
    'Как выбрать ракетку для падела — гид для новичков',
    'Разбираем, как выбрать ракетку для падела по форме, весу и балансу — с учётом уровня и стиля игры.',
    0
  ),
  (
    'Где поиграть в падел в Аликанте: площадки и клубы', 'Советы',
    'gde-poigrat-v-padel-v-alikante-ploschadki-i-kluby', '/images/journal/article-2.png',
    E'Аликанте — один из центров падела на побережье Коста Бланка: десятки крытых и открытых кортов в шаговой доступности от центра города. Мы собрали площадки, где регулярно играет наше сообщество, и где проще всего найти партнёра на игру даже если ты приехал в город впервые.\n\nБольшинство клубов принимают гостей без абонемента — можно просто забронировать корт на час. Если хочешь сразу попасть в компанию, лучше приходить на организованные игры из нашего расписания.',
    'Где поиграть в падел в Аликанте — площадки и клубы',
    'Обзор площадок и клубов для падела в Аликанте: где забронировать корт и где проще найти партнёра для игры.',
    1
  )
) as v(title, category_name, slug, cover, body, seo_title, seo_description, sort_order)
join seeded_journal_categories c on c.name = v.category_name
where not exists (select 1 from articles);

insert into site_settings (id, seo_title, seo_description, favicon_url, telegram_url, instagram_url, whatsapp_url)
select 1, 'Top Padel Alicante', 'Падел-клуб в Аликанте: тренировки, турниры, сообщество игроков.', null, '#', '#', '#'
where not exists (select 1 from site_settings);
