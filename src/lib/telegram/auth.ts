import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function isAdmin(telegramId: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("telegram_admins")
    .select("id")
    .eq("id", telegramId)
    .maybeSingle();
  return Boolean(data);
}

export async function addAdmin(telegramId: number, name: string | undefined): Promise<void> {
  await supabaseAdmin.from("telegram_admins").upsert({ id: telegramId, name: name ?? null });
}

export async function listAdmins(): Promise<{ id: number; name: string | null }[]> {
  const { data } = await supabaseAdmin.from("telegram_admins").select("id, name").order("added_at");
  return data ?? [];
}

export async function removeAdmin(telegramId: number): Promise<void> {
  await supabaseAdmin.from("telegram_admins").delete().eq("id", telegramId);
}
