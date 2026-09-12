import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { articles as fallbackArticles, type Article } from "@/lib/content";

export type DbArticle = Article & { id: string; sort_order: number };

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return fallbackArticles;

  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").order("sort_order");

  if (error || !data || data.length === 0) return fallbackArticles;

  return data.map((row) => ({
    number: row.number,
    tag: row.tag,
    title: row.title,
    image: row.image,
  }));
}

export async function getArticlesForAdmin(): Promise<DbArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").order("sort_order");
  if (error || !data) return [];
  return data as DbArticle[];
}
