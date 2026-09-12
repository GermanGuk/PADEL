-- Adds an editable "Сообщество" (Community) block: heading, description,
-- button link and photo. Run this once in the Supabase SQL editor.

create table if not exists community_content (
  id smallint primary key default 1 check (id = 1),
  heading text not null,
  heading_highlight text not null,
  description text not null,
  button_link text not null,
  image text not null
);

alter table community_content enable row level security;
create policy "public read community_content" on community_content for select using (true);

grant select on community_content to anon, authenticated;
grant all on community_content to service_role;

-- Seed with the current hardcoded copy/photo so nothing changes on the
-- site until this is edited.
insert into community_content (id, heading, heading_highlight, description, button_link, image)
select
  1,
  'Ищешь напарника?',
  'Найдём.',
  'В Telegram каждый день ищут игроков, собирают пары, договариваются об играх и турнирах.',
  '#',
  '/images/community/photo.png'
where not exists (select 1 from community_content);
