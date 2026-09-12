"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createJournalCategory,
  deleteJournalCategory,
  renameJournalCategory,
} from "@/lib/data/journal-categories";

export async function addCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await createJournalCategory(name);
  revalidatePath("/admin/journal/categories");
  revalidatePath("/admin/journal");
  revalidatePath("/");
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await renameJournalCategory(id, name);
  revalidatePath("/admin/journal/categories");
  revalidatePath("/admin/journal");
  revalidatePath("/");
}

export async function removeCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteJournalCategory(id);
  revalidatePath("/admin/journal/categories");
  revalidatePath("/admin/journal");
  revalidatePath("/");
}
