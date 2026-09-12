import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbHeroCard } from "@/lib/db-types";
import { heroCards as fallbackCards, type HeroCard } from "@/lib/content";

type Row = {
  id: string;
  tag: string;
  title: string;
  meta: string | null;
  image: string;
  href: string;
  featured: boolean;
  sort_order: number;
};

function fromRow(row: Row): DbHeroCard {
  return {
    id: row.id,
    tag: row.tag,
    title: row.title,
    meta: row.meta,
    image: row.image,
    href: row.href,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
}

function toHeroCard(row: DbHeroCard): HeroCard {
  return {
    tag: row.tag,
    title: row.title,
    image: row.image,
    href: row.href,
    featured: row.featured || undefined,
    meta: row.meta ?? undefined,
  };
}

export async function getHeroCards(): Promise<HeroCard[]> {
  const { data, error } = await supabasePublic.from("hero_cards").select("*").order("sort_order");
  if (error || !data || data.length === 0) return fallbackCards;
  return (data as Row[]).map(fromRow).map(toHeroCard);
}

export async function getHeroCardsForAdmin(): Promise<DbHeroCard[]> {
  const { data, error } = await supabaseAdmin.from("hero_cards").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}

export async function createHeroCard(data: Omit<DbHeroCard, "id">): Promise<void> {
  const { error } = await supabaseAdmin.from("hero_cards").insert({
    tag: data.tag,
    title: data.title,
    meta: data.meta,
    image: data.image,
    href: data.href,
    featured: data.featured,
    sort_order: data.sortOrder,
  });
  if (error) throw new Error(`Failed to create hero card: ${error.message}`);
}

export async function updateHeroCard(id: string, data: Omit<DbHeroCard, "id">): Promise<void> {
  const { error } = await supabaseAdmin
    .from("hero_cards")
    .update({
      tag: data.tag,
      title: data.title,
      meta: data.meta,
      image: data.image,
      href: data.href,
      featured: data.featured,
      sort_order: data.sortOrder,
    })
    .eq("id", id);
  if (error) throw new Error(`Failed to update hero card: ${error.message}`);
}

export async function deleteHeroCard(id: string): Promise<DbHeroCard | undefined> {
  const { data } = await supabaseAdmin.from("hero_cards").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("hero_cards").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete hero card: ${error.message}`);
  return data ? fromRow(data as Row) : undefined;
}
