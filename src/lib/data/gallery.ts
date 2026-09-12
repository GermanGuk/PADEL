import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbGalleryImage } from "@/lib/db-types";

export type GalleryImage = { id: string; url: string; categoryId: string | null };

type Row = { id: string; url: string; category_id: string | null; sort_order: number };

function fromRow(row: Row): DbGalleryImage {
  return { id: row.id, url: row.url, categoryId: row.category_id, sortOrder: row.sort_order };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabasePublic.from("gallery_images").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow).map(({ id, url, categoryId }) => ({ id, url, categoryId }));
}

export async function getGalleryImagesForAdmin(): Promise<DbGalleryImage[]> {
  const { data, error } = await supabaseAdmin.from("gallery_images").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}

export async function createGalleryImage(data: Omit<DbGalleryImage, "id">): Promise<void> {
  await supabaseAdmin.from("gallery_images").insert({
    url: data.url,
    category_id: data.categoryId,
    sort_order: data.sortOrder,
  });
}

export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<DbGalleryImage, "id">>
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (data.url !== undefined) update.url = data.url;
  if (data.categoryId !== undefined) update.category_id = data.categoryId;
  if (data.sortOrder !== undefined) update.sort_order = data.sortOrder;

  await supabaseAdmin.from("gallery_images").update(update).eq("id", id);
}

export async function deleteGalleryImage(id: string): Promise<DbGalleryImage | undefined> {
  const { data } = await supabaseAdmin.from("gallery_images").select("*").eq("id", id).maybeSingle();
  await supabaseAdmin.from("gallery_images").delete().eq("id", id);
  return data ? fromRow(data as Row) : undefined;
}
