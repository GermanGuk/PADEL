-- Adds editable Telegram/Instagram/WhatsApp links to site_settings.
-- Run this once in the Supabase SQL editor.

alter table site_settings add column if not exists telegram_url text;
alter table site_settings add column if not exists instagram_url text;
alter table site_settings add column if not exists whatsapp_url text;
