import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbArticle } from "@/lib/db-types";

export type ArticleCard = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  categoryId: string | null;
};

type Row = {
  id: string;
  title: string;
  category_id: string | null;
  slug: string;
  cover: string;
  body: string;
  seo_title: string;
  seo_description: string;
  published: boolean;
  sort_order: number;
};

function fromRow(row: Row): DbArticle {
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id,
    slug: row.slug,
    cover: row.cover,
    body: row.body,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

// Published articles only, for the homepage teaser grid.
export async function getArticles(): Promise<ArticleCard[]> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select("id, title, slug, cover, category_id")
    .eq("published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    cover: row.cover,
    categoryId: row.category_id,
  }));
}

export async function getArticleBySlug(slug: string): Promise<DbArticle | undefined> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return undefined;
  return fromRow(data as Row);
}

export async function getArticlesForAdmin(): Promise<DbArticle[]> {
  const { data, error } = await supabaseAdmin.from("articles").select("*").order("sort_order");
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabaseAdmin.from("articles").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return Boolean(data && data.length > 0);
}

export async function createArticle(data: Omit<DbArticle, "id">): Promise<void> {
  const { error } = await supabaseAdmin.from("articles").insert({
    title: data.title,
    category_id: data.categoryId,
    slug: data.slug,
    cover: data.cover,
    body: data.body,
    seo_title: data.seoTitle,
    seo_description: data.seoDescription,
    published: data.published,
    sort_order: data.sortOrder,
  });
  if (error) throw new Error(`Failed to create article: ${error.message}`);
}

export async function updateArticle(id: string, data: Omit<DbArticle, "id">): Promise<void> {
  const { error } = await supabaseAdmin
    .from("articles")
    .update({
      title: data.title,
      category_id: data.categoryId,
      slug: data.slug,
      cover: data.cover,
      body: data.body,
      seo_title: data.seoTitle,
      seo_description: data.seoDescription,
      published: data.published,
      sort_order: data.sortOrder,
    })
    .eq("id", id);
  if (error) throw new Error(`Failed to update article: ${error.message}`);
}

export async function deleteArticle(id: string): Promise<DbArticle | undefined> {
  const { data } = await supabaseAdmin.from("articles").select("*").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete article: ${error.message}`);
  return data ? fromRow(data as Row) : undefined;
}
