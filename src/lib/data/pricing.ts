import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { pricingPlans as fallbackPlans, type PricingPlan } from "@/lib/content";

export type DbPricingPlan = PricingPlan & { id: string; sort_order: number };

export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (!isSupabaseConfigured) return fallbackPlans;

  const supabase = await createClient();
  const { data, error } = await supabase.from("pricing_plans").select("*").order("sort_order");

  if (error || !data || data.length === 0) return fallbackPlans;

  return data.map((row) => ({
    dark: row.dark ?? undefined,
    number: row.number,
    title: row.title,
    description: row.description,
    price: row.price,
    icon: row.icon,
    rows: row.rows ?? [],
  }));
}

export async function getPricingPlansForAdmin(): Promise<DbPricingPlan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pricing_plans").select("*").order("sort_order");
  if (error || !data) return [];
  return data as DbPricingPlan[];
}
