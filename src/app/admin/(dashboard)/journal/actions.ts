"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/dal";

async function uploadIfProvided(formData: FormData): Promise<string | null> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return null;

  const supabase = await createClient();
  const path = `journal/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("photos").upload(path, file);
  if (error) return null;

  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function createArticle(formData: FormData) {
  await verifyAdmin();
  const uploadedUrl = await uploadIfProvided(formData);
  const image = uploadedUrl ?? String(formData.get("image") ?? "").trim();
  if (!image) return;

  const supabase = await createClient();
  await supabase.from("articles").insert({
    number: String(formData.get("number") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    title: String(formData.get("title") ?? ""),
    image,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/admin/journal");
  revalidatePath("/");
}

export async function updateArticle(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const uploadedUrl = await uploadIfProvided(formData);

  const supabase = await createClient();
  const update: Record<string, string | number> = {
    number: String(formData.get("number") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    title: String(formData.get("title") ?? ""),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
  if (uploadedUrl) update.image = uploadedUrl;

  await supabase.from("articles").update(update).eq("id", id);
  revalidatePath("/admin/journal");
  revalidatePath("/");
}

export async function deleteArticle(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/admin/journal");
  revalidatePath("/");
}
