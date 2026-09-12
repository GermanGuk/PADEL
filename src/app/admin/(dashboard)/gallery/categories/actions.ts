"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  renameGalleryCategory,
} from "@/lib/data/gallery-categories";

export async function addCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await createGalleryCategory(name);
  revalidatePath("/admin/gallery/categories");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await renameGalleryCategory(id, name);
  revalidatePath("/admin/gallery/categories");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function removeCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteGalleryCategory(id);
  revalidatePath("/admin/gallery/categories");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
