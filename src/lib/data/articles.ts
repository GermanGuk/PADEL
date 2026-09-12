import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbArticle } from "@/lib/db-types";

export type ArticleCard = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  categoryId: string | null;
};

function sorted(articles: DbArticle[]): DbArticle[] {
  return [...articles].sort((a, b) => a.sortOrder - b.sortOrder);
}

// Published articles only, for the homepage teaser grid.
export async function getArticles(): Promise<ArticleCard[]> {
  const db = await readDb();
  return sorted(db.articles)
    .filter((a) => a.published)
    .map(({ id, title, slug, cover, categoryId }) => ({ id, title, slug, cover, categoryId }));
}

export async function getArticleBySlug(slug: string): Promise<DbArticle | undefined> {
  const db = await readDb();
  return db.articles.find((a) => a.slug === slug && a.published);
}

export async function getArticlesForAdmin(): Promise<DbArticle[]> {
  const db = await readDb();
  return sorted(db.articles);
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const db = await readDb();
  return db.articles.some((a) => a.slug === slug && a.id !== excludeId);
}

export async function createArticle(data: Omit<DbArticle, "id">): Promise<void> {
  const db = await readDb();
  db.articles.push({ ...data, id: randomUUID() });
  await writeDb(db);
}

export async function updateArticle(id: string, data: Omit<DbArticle, "id">): Promise<void> {
  const db = await readDb();
  const idx = db.articles.findIndex((a) => a.id === id);
  if (idx !== -1) db.articles[idx] = { ...data, id };
  await writeDb(db);
}

export async function deleteArticle(id: string): Promise<DbArticle | undefined> {
  const db = await readDb();
  const article = db.articles.find((a) => a.id === id);
  db.articles = db.articles.filter((a) => a.id !== id);
  await writeDb(db);
  return article;
}
