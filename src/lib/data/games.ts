import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { gameCards as fallbackGameCards, type GameCard } from "@/lib/content";

export type DbGame = GameCard & { id: string; sort_order: number };

export async function getGameCards(): Promise<GameCard[]> {
  if (!isSupabaseConfigured) return fallbackGameCards;

  const supabase = await createClient();
  const { data, error } = await supabase.from("games").select("*").order("sort_order");

  if (error || !data || data.length === 0) return fallbackGameCards;

  return data.map((row) => ({
    featured: row.featured ?? undefined,
    badge: row.badge,
    title: row.title,
    meta: row.meta ?? [],
    extra: row.extra ?? undefined,
    price: row.price ?? undefined,
    image: row.image ?? undefined,
  }));
}

export async function getGamesForAdmin(): Promise<DbGame[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").select("*").order("sort_order");
  if (error || !data) return [];
  return data as DbGame[];
}
