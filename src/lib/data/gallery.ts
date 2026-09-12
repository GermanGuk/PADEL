import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { galleryImages as fallbackImages } from "@/lib/content";

export type DbGalleryImage = { id: string; url: string; sort_order: number };

export async function getGalleryImages(): Promise<string[]> {
  if (!isSupabaseConfigured) return fallbackImages;

  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");

  if (error || !data || data.length === 0) return fallbackImages;

  return data.map((row) => row.url);
}

export async function getGalleryImagesForAdmin(): Promise<DbGalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
  if (error || !data) return [];
  return data as DbGalleryImage[];
}
