"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/dal";
import type { GameCardMeta } from "@/lib/content";

const META_ICONS: GameCardMeta["icon"][] = ["players", "courts", "clock", "location"];

function buildMeta(formData: FormData): GameCardMeta[] {
  return META_ICONS.map((icon) => ({ icon, text: String(formData.get(icon) ?? "").trim() })).filter(
    (m) => m.text.length > 0
  );
}

function fields(formData: FormData) {
  return {
    featured: formData.get("featured") === "on",
    badge: String(formData.get("badge") ?? ""),
    title: String(formData.get("title") ?? ""),
    meta: buildMeta(formData),
    extra: String(formData.get("extra") ?? "").trim() || null,
    price: String(formData.get("price") ?? "").trim() || null,
    image: String(formData.get("image") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createGame(formData: FormData) {
  await verifyAdmin();
  const supabase = await createClient();
  await supabase.from("games").insert(fields(formData));
  revalidatePath("/admin/games");
  revalidatePath("/");
}

export async function updateGame(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("games").update(fields(formData)).eq("id", id);
  revalidatePath("/admin/games");
  revalidatePath("/");
}

export async function deleteGame(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("games").delete().eq("id", id);
  revalidatePath("/admin/games");
  revalidatePath("/");
}
