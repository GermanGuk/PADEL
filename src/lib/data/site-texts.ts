import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { siteTexts as fallback, type SiteTexts, type SiteTextKey } from "@/lib/content";

export async function getSiteTexts(): Promise<SiteTexts> {
  if (!isSupabaseConfigured) return fallback;

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_texts").select("key, value");

  if (error || !data) return fallback;

  const merged: SiteTexts = { ...fallback };
  for (const row of data) {
    if (row.key in merged) {
      merged[row.key as SiteTextKey] = row.value;
    }
  }
  return merged;
}
