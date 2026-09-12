"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createPricingPlan, deletePricingPlan, updatePricingPlan } from "@/lib/data/pricing";
import type { PricingRow } from "@/lib/db-types";

const MAX_ROWS = 5;

function buildRows(formData: FormData): PricingRow[] {
  const rows: PricingRow[] = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    const label = String(formData.get(`row_label_${i}`) ?? "").trim();
    const oldPrice = String(formData.get(`row_old_${i}`) ?? "").trim();
    const newPrice = String(formData.get(`row_new_${i}`) ?? "").trim();
    if (label && oldPrice && newPrice) rows.push({ label, oldPrice, newPrice });
  }
  return rows;
}

function fields(formData: FormData) {
  return {
    dark: formData.get("dark") === "on",
    number: String(formData.get("number") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    icon: (String(formData.get("icon") ?? "solo") as "solo" | "group"),
    rows: buildRows(formData),
    sortOrder: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createPlan(formData: FormData) {
  await requireAdmin();
  await createPricingPlan(fields(formData));
  revalidatePath("/admin/training");
  revalidatePath("/");
}

export async function updatePlan(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await updatePricingPlan(id, fields(formData));
  revalidatePath("/admin/training");
  revalidatePath("/");
}

export async function deletePlan(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deletePricingPlan(id);
  revalidatePath("/admin/training");
  revalidatePath("/");
}
