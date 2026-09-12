-- Top Padel Alicante — content schema.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
--
-- Auth model: single owner account, created manually in
-- Authentication → Users → Add user (email + password) after running this file.
-- Any authenticated user may write; the app never exposes signup, so the
-- only authenticated user is the owner.

create extension if not exists pgcrypto;

-- ── Games / schedule ────────────────────────────────────────────────
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

-- ── Training / pricing plans ────────────────────────────────────────
create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  dark boolean not null default false,
  number text not null,
  title text not null,
  description text not null,
  price text not null,
  icon text not null default 'solo', -- "solo" | "group"
  rows jsonb not null default '[]', -- [{ label, oldPrice, newPrice }]
  sort_order integer not null default 0
);

-- ── Gallery photos ───────────────────────────────────────────────────
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Journal articles ─────────────────────────────────────────────────
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  tag text not null,
  title text not null,
  image text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Editable site texts (key/value) ─────────────────────────────────
create table if not exists site_texts (
  key text primary key,
  value text not null
);

-- ── Row Level Security: public read, authenticated write ────────────
alter table games enable row level security;
alter table pricing_plans enable row level security;
alter table gallery_images enable row level security;
alter table articles enable row level security;
alter table site_texts enable row level security;

create policy "public read games" on games for select using (true);
create policy "admin write games" on games for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read pricing_plans" on pricing_plans for select using (true);
create policy "admin write pricing_plans" on pricing_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read gallery_images" on gallery_images for select using (true);
create policy "admin write gallery_images" on gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read articles" on articles for select using (true);
create policy "admin write articles" on articles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read site_texts" on site_texts for select using (true);
create policy "admin write site_texts" on site_texts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Storage bucket for uploaded photos ───────────────────────────────
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "public read photos bucket" on storage.objects for select using (bucket_id = 'photos');
create policy "admin write photos bucket" on storage.objects for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "admin update photos bucket" on storage.objects for update using (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "admin delete photos bucket" on storage.objects for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');

-- ── Seed data: mirrors the current hardcoded content so the site looks
--    identical the moment Supabase is wired in. Safe to re-run (idempotent
--    on empty tables only — skip if you already edited content in /admin).
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

insert into pricing_plans (dark, number, title, description, price, icon, rows, sort_order)
select * from (values
  (false, '01.', 'Индивидуальные тренировки', 'Персональная работа с тренером только над твоей игрой.', '30 €', 'solo',
    '[{"label":"4 тренировки","oldPrice":"120 €","newPrice":"100 €"},{"label":"8 тренировок","oldPrice":"240 €","newPrice":"180 €"}]'::jsonb, 0),
  (true, '02.', 'Групповая тренировка', 'Тренируйся в команде с игроками своего уровня.', '40 €', 'group',
    '[{"label":"4 тренировки","oldPrice":"160 €","newPrice":"140 €"},{"label":"8 тренировки","oldPrice":"320 €","newPrice":"260 €"}]'::jsonb, 1)
) as v
where not exists (select 1 from pricing_plans);

insert into gallery_images (url, sort_order)
select * from (values
  ('/images/gallery/1.png', 0), ('/images/gallery/2.png', 1), ('/images/gallery/3.png', 2), ('/images/gallery/4.png', 3),
  ('/images/gallery/5.png', 4), ('/images/gallery/6.png', 5), ('/images/gallery/7.png', 6), ('/images/gallery/8.png', 7)
) as v
where not exists (select 1 from gallery_images);

insert into articles (number, tag, title, image, sort_order)
select * from (values
  ('01', 'СОВЕТЫ', 'Как подобрать правильную ракетку для падела', '/images/journal/article-1.png', 0),
  ('02', 'СОВЕТЫ', 'Где поиграть в падел в Аликанте: площадки и клубы', '/images/journal/article-2.png', 1)
) as v
where not exists (select 1 from articles);

insert into site_texts (key, value)
select * from (values
  ('hero.title.line1', 'Падел объединяет людей'),
  ('hero.title.line2', 'и превращает обычную игру'),
  ('hero.title.line3', 'в часть твоей жизни'),
  ('hero.subtitle.left', E'Тренировки для любого уровня.\nУчись, играй и становись сильнее.'),
  ('hero.subtitle.right', E'Турниры и игровые встречи\nкаждую неделю в Аликанте.'),
  ('training.heading.line1', 'Играй лучше.'),
  ('training.heading.line2', 'Получай больше'),
  ('training.heading.line2Highlight', 'удовольствие'),
  ('training.description', E'Подбираем тренировки под твой уровень\nи цели. Индивидуально или в группе.'),
  ('community.heading', 'Ищешь напарника?'),
  ('community.headingHighlight', 'Найдём.'),
  ('community.description', 'В Telegram каждый день ищут игроков, собирают пары, договариваются об играх и турнирах.')
) as v
where not exists (select 1 from site_texts);
