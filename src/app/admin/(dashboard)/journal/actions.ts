"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createArticle, deleteArticle, isSlugTaken, updateArticle } from "@/lib/data/articles";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";
import { slugify } from "@/lib/slug";

async function uniqueSlug(title: string, requestedSlug: string, excludeId?: string): Promise<string> {
  const base = slugify(requestedSlug || title) || "article";
  let candidate = base;
  let i = 2;
  while (await isSlugTaken(candidate, excludeId)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

async function fields(formData: FormData, existingCover: string | null, excludeId?: string) {
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");
  const cover = file instanceof File && file.size > 0 ? await saveUploadedFile(file, "journal") : existingCover;

  const seoTitle = String(formData.get("seo_title") ?? "").trim() || title;
  const seoDescription = String(formData.get("seo_description") ?? "").trim();

  return {
    title,
    categoryId: String(formData.get("category_id") ?? "").trim() || null,
    slug: await uniqueSlug(title, String(formData.get("slug") ?? ""), excludeId),
    cover: cover ?? "",
    body: String(formData.get("body") ?? ""),
    seoTitle,
    seoDescription,
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createArticleAction(formData: FormData) {
  await requireAdmin();
  const data = await fields(formData, null);
  if (!data.title || !data.cover) return;
  await createArticle(data);
  revalidatePath("/admin/journal");
  revalidatePath("/");
}

export async function updateArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const existingCover = String(formData.get("existing_cover") ?? "") || null;
  const data = await fields(formData, existingCover, id);
  if (!data.title || !data.cover) return;
  await updateArticle(id, data);
  revalidatePath("/admin/journal");
  revalidatePath(`/journal/${data.slug}`);
  revalidatePath("/");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const article = await deleteArticle(id);
  if (article?.cover) await deleteUploadedFile(article.cover);
  revalidatePath("/admin/journal");
  revalidatePath("/");
}
