"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createGalleryImage, deleteGalleryImage, updateGalleryImage } from "@/lib/data/gallery";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export async function uploadImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedFile(file, "gallery");
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  await createGalleryImage({ url, categoryId, sortOrder });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function updateImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  await updateGalleryImage(id, { categoryId, sortOrder });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const image = await deleteGalleryImage(id);
  if (image) await deleteUploadedFile(image.url);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
