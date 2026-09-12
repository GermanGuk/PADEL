import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbJournalCategory } from "@/lib/db-types";

export async function getJournalCategories(): Promise<DbJournalCategory[]> {
  const { data, error } = await supabasePublic.from("journal_categories").select("id, name").order("created_at");
  if (error || !data) return [];
  return data;
}

export async function createJournalCategory(name: string): Promise<void> {
  const { error } = await supabaseAdmin.from("journal_categories").insert({ name });
  if (error) throw new Error(`Failed to create journal category: ${error.message}`);
}

export async function renameJournalCategory(id: string, name: string): Promise<void> {
  const { error } = await supabaseAdmin.from("journal_categories").update({ name }).eq("id", id);
  if (error) throw new Error(`Failed to rename journal category: ${error.message}`);
}

export async function deleteJournalCategory(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("journal_categories").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete journal category: ${error.message}`);
}
