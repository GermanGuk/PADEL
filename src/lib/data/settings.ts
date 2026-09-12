import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbSettings } from "@/lib/db-types";

const FALLBACK: DbSettings = {
  seoTitle: "Top Padel Alicante",
  seoDescription: "Падел-клуб в Аликанте: тренировки, турниры, сообщество игроков.",
  faviconUrl: null,
  telegramUrl: "#",
  instagramUrl: "#",
  whatsappUrl: "#",
};

type Row = {
  seo_title: string;
  seo_description: string;
  favicon_url: string | null;
  telegram_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
};

function fromRow(row: Row): DbSettings {
  return {
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    faviconUrl: row.favicon_url,
    telegramUrl: row.telegram_url ?? FALLBACK.telegramUrl,
    instagramUrl: row.instagram_url ?? FALLBACK.instagramUrl,
    whatsappUrl: row.whatsapp_url ?? FALLBACK.whatsappUrl,
  };
}

export async function getSettings(): Promise<DbSettings> {
  const { data, error } = await supabasePublic.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return FALLBACK;
  return fromRow(data as Row);
}

export async function updateSettings(data: DbSettings): Promise<void> {
  const { error } = await supabaseAdmin.from("site_settings").upsert({
    id: 1,
    seo_title: data.seoTitle,
    seo_description: data.seoDescription,
    favicon_url: data.faviconUrl,
    telegram_url: data.telegramUrl,
    instagram_url: data.instagramUrl,
    whatsapp_url: data.whatsappUrl,
  });
  if (error) throw new Error(`Failed to update settings: ${error.message}`);
}
