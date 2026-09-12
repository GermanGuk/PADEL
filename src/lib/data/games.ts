import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbGame } from "@/lib/db-types";
import type { GameCard } from "@/lib/content";

type Row = {
  id: string;
  featured: boolean;
  badge: string;
  title: string;
  meta: DbGame["meta"];
  extra: string | null;
  price: string | null;
  image: string | null;
  sort_order: number;
};

function fromRow(row: Row): DbGame {
  return {
    id: row.id,
    featured: row.featured,
    badge: row.badge,
    title: row.title,
    meta: row.meta,
    extra: row.extra,
    price: row.price,
    image: row.image,
    sortOrder: row.sort_order,
  };
}

function toGameCard(row: DbGame): GameCard {
  return {
    featured: row.featured || undefined,
    badge: row.badge,
    title: row.title,
    meta: row.meta,
    extra: row.extra ?? undefined,
    price: row.price ?? undefined,
    image: row.image ?? undefined,
  };
}

export async function getGameCards(): Promise<GameCard[]> {
  const { data, error } = await supabasePublic.from("games").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow).map(toGameCard);
}

export async function getGamesForAdmin(): Promise<DbGame[]> {
  const { data, error } = await supabaseAdmin.from("games").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}

export async function createGame(data: Omit<DbGame, "id">): Promise<void> {
  await supabaseAdmin.from("games").insert({
    featured: data.featured,
    badge: data.badge,
    title: data.title,
    meta: data.meta,
    extra: data.extra,
    price: data.price,
    image: data.image,
    sort_order: data.sortOrder,
  });
}

export async function updateGame(id: string, data: Omit<DbGame, "id">): Promise<void> {
  await supabaseAdmin
    .from("games")
    .update({
      featured: data.featured,
      badge: data.badge,
      title: data.title,
      meta: data.meta,
      extra: data.extra,
      price: data.price,
      image: data.image,
      sort_order: data.sortOrder,
    })
    .eq("id", id);
}

export async function deleteGame(id: string): Promise<DbGame | undefined> {
  const { data } = await supabaseAdmin.from("games").select("*").eq("id", id).maybeSingle();
  await supabaseAdmin.from("games").delete().eq("id", id);
  return data ? fromRow(data as Row) : undefined;
}
