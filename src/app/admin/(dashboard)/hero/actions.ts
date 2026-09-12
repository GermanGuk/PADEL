"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createHeroCard, deleteHeroCard, updateHeroCard } from "@/lib/data/hero-cards";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

async function fields(formData: FormData, existingImage: string, existingHref: string) {
  const file = formData.get("file");
  const image = file instanceof File && file.size > 0 ? await saveUploadedFile(file, "hero") : existingImage;

  return {
    tag: String(formData.get("tag") ?? ""),
    title: String(formData.get("title") ?? ""),
    meta: String(formData.get("meta") ?? "").trim() || null,
    image,
    href: existingHref,
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createHeroCardAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const image = await saveUploadedFile(file, "hero");
  await createHeroCard({
    tag: String(formData.get("tag") ?? ""),
    title: String(formData.get("title") ?? ""),
    meta: String(formData.get("meta") ?? "").trim() || null,
    image,
    href: String(formData.get("href") ?? "").trim() || "#top",
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateHeroCardAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const existingImage = String(formData.get("existing_image") ?? "");
  const existingHref = String(formData.get("existing_href") ?? "");
  await updateHeroCard(id, await fields(formData, existingImage, existingHref));
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteHeroCardAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const card = await deleteHeroCard(id);
  if (card?.image) await deleteUploadedFile(card.image);
  revalidatePath("/admin/hero");
  revalidatePath("/");
}
