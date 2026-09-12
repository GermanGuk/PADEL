import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbTrainingPlan } from "@/lib/db-types";
import type { PricingPlan } from "@/lib/content";

type Row = {
  id: string;
  dark: boolean;
  number: string;
  title: string;
  description: string;
  price: string;
  icon: DbTrainingPlan["icon"];
  rows: DbTrainingPlan["rows"];
  sort_order: number;
};

function fromRow(row: Row): DbTrainingPlan {
  return {
    id: row.id,
    dark: row.dark,
    number: row.number,
    title: row.title,
    description: row.description,
    price: row.price,
    icon: row.icon,
    rows: row.rows,
    sortOrder: row.sort_order,
  };
}

function toPricingPlan(row: DbTrainingPlan): PricingPlan {
  return {
    dark: row.dark || undefined,
    number: row.number,
    title: row.title,
    description: row.description,
    price: row.price,
    icon: row.icon,
    rows: row.rows,
  };
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const { data, error } = await supabasePublic.from("training_plans").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow).map(toPricingPlan);
}

export async function getPricingPlansForAdmin(): Promise<DbTrainingPlan[]> {
  const { data, error } = await supabaseAdmin.from("training_plans").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}

export async function createPricingPlan(data: Omit<DbTrainingPlan, "id">): Promise<void> {
  await supabaseAdmin.from("training_plans").insert({
    dark: data.dark,
    number: data.number,
    title: data.title,
    description: data.description,
    price: data.price,
    icon: data.icon,
    rows: data.rows,
    sort_order: data.sortOrder,
  });
}

export async function updatePricingPlan(id: string, data: Omit<DbTrainingPlan, "id">): Promise<void> {
  await supabaseAdmin
    .from("training_plans")
    .update({
      dark: data.dark,
      number: data.number,
      title: data.title,
      description: data.description,
      price: data.price,
      icon: data.icon,
      rows: data.rows,
      sort_order: data.sortOrder,
    })
    .eq("id", id);
}

export async function deletePricingPlan(id: string): Promise<void> {
  await supabaseAdmin.from("training_plans").delete().eq("id", id);
}
