"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/dal";
import type { PricingRow } from "@/lib/content";

const MAX_ROWS = 3;

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
    icon: String(formData.get("icon") ?? "solo"),
    rows: buildRows(formData),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createPlan(formData: FormData) {
  await verifyAdmin();
  const supabase = await createClient();
  await supabase.from("pricing_plans").insert(fields(formData));
  revalidatePath("/admin/training");
  revalidatePath("/");
}

export async function updatePlan(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("pricing_plans").update(fields(formData)).eq("id", id);
  revalidatePath("/admin/training");
  revalidatePath("/");
}

export async function deletePlan(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("pricing_plans").delete().eq("id", id);
  revalidatePath("/admin/training");
  revalidatePath("/");
}
