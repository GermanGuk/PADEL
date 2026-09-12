import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbGalleryCategory } from "@/lib/db-types";

export async function getGalleryCategories(): Promise<DbGalleryCategory[]> {
  const { data, error } = await supabasePublic.from("gallery_categories").select("id, name").order("created_at");
  if (error || !data) return [];
  return data;
}

export async function createGalleryCategory(name: string): Promise<void> {
  await supabaseAdmin.from("gallery_categories").insert({ name });
}

export async function renameGalleryCategory(id: string, name: string): Promise<void> {
  await supabaseAdmin.from("gallery_categories").update({ name }).eq("id", id);
}

export async function deleteGalleryCategory(id: string): Promise<void> {
  await supabaseAdmin.from("gallery_categories").delete().eq("id", id);
}
