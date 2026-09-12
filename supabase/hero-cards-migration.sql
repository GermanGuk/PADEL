-- Adds an editable "hero_cards" table for the 6 tiles on the homepage's
-- first screen (Турниры / Тренировки / Ближайшая игра / Найти партнёра /
-- Новости / Галерея). Run this once in the Supabase SQL editor.

create table if not exists hero_cards (
  id uuid primary key default gen_random_uuid(),
  tag text not null,
  title text not null,
  meta text,
  image text not null,
  href text not null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table hero_cards enable row level security;
create policy "public read hero_cards" on hero_cards for select using (true);

grant select on hero_cards to anon, authenticated;
grant all on hero_cards to service_role;

-- Seed with the current hardcoded cards so the site looks identical the
-- moment this is wired in.
insert into hero_cards (tag, title, meta, image, href, featured, sort_order)
select * from (values
  ('ТУРНИРЫ', 'Турниры', null::text, '/images/hero/card-tournaments.png', '#games', false, 0),
  ('ТРЕНИРОВКИ', 'Тренировки', null::text, '/images/hero/card-training.png', '#training', false, 1),
  ('БЛИЖАЙШАЯ ИГРА', 'Mexicano El Salt', 'Среда · 19:30 – 21:30', '/images/hero/card-next-game.png', '#games', true, 2),
  ('НАЙТИ ПАРТНЁРА', 'Найти партнёра', null::text, '/images/hero/card-find-partner.png', '#community', false, 3),
  ('НОВОСТИ', 'Новости', null::text, '/images/hero/card-news.png', '#journal', false, 4),
  ('ГАЛЕРЕЯ', 'Галерея', null::text, '/images/hero/card-gallery.png', '#gallery', false, 5)
) as v(tag, title, meta, image, href, featured, sort_order)
where not exists (select 1 from hero_cards);
