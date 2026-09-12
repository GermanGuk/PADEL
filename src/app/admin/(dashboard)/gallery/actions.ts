"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/dal";

export async function uploadImage(formData: FormData) {
  await verifyAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const supabase = await createClient();
  const path = `gallery/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("photos").upload(path, file);
  if (uploadError) return;

  const { data: publicUrl } = supabase.storage.from("photos").getPublicUrl(path);
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  await supabase.from("gallery_images").insert({ url: publicUrl.publicUrl, sort_order: sortOrder });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function updateSortOrder(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const supabase = await createClient();
  await supabase.from("gallery_images").update({ sort_order: sortOrder }).eq("id", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteImage(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const url = String(formData.get("url"));
  const supabase = await createClient();

  const marker = "/storage/v1/object/public/photos/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("photos").remove([path]);
  }

  await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
