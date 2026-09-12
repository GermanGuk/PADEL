"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createGame, deleteGame, updateGame } from "@/lib/data/games";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";
import type { GameMeta } from "@/lib/db-types";

const META_ICONS: GameMeta["icon"][] = ["players", "courts", "clock", "location"];

function buildMeta(formData: FormData): GameMeta[] {
  return META_ICONS.map((icon) => ({ icon, text: String(formData.get(icon) ?? "").trim() })).filter(
    (m) => m.text.length > 0
  );
}

async function fields(formData: FormData, existingImage: string | null) {
  const file = formData.get("file");
  const image = file instanceof File && file.size > 0 ? await saveUploadedFile(file, "games") : existingImage;

  return {
    featured: formData.get("featured") === "on",
    badge: String(formData.get("badge") ?? ""),
    title: String(formData.get("title") ?? ""),
    meta: buildMeta(formData),
    extra: String(formData.get("extra") ?? "").trim() || null,
    price: String(formData.get("price") ?? "").trim() || null,
    image,
    sortOrder: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createGameAction(formData: FormData) {
  await requireAdmin();
  await createGame(await fields(formData, null));
  revalidatePath("/admin/games");
  revalidatePath("/");
}

export async function updateGameAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const existingImage = String(formData.get("existing_image") ?? "") || null;
  await updateGame(id, await fields(formData, existingImage));
  revalidatePath("/admin/games");
  revalidatePath("/");
}

export async function deleteGameAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const game = await deleteGame(id);
  if (game?.image) await deleteUploadedFile(game.image);
  revalidatePath("/admin/games");
  revalidatePath("/");
}
