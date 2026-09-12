import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbJournalCategory } from "@/lib/db-types";

export async function getJournalCategories(): Promise<DbJournalCategory[]> {
  const db = await readDb();
  return db.journalCategories;
}

export async function createJournalCategory(name: string): Promise<void> {
  const db = await readDb();
  db.journalCategories.push({ id: randomUUID(), name });
  await writeDb(db);
}

export async function renameJournalCategory(id: string, name: string): Promise<void> {
  const db = await readDb();
  const category = db.journalCategories.find((c) => c.id === id);
  if (category) category.name = name;
  await writeDb(db);
}

export async function deleteJournalCategory(id: string): Promise<void> {
  const db = await readDb();
  db.journalCategories = db.journalCategories.filter((c) => c.id !== id);
  for (const article of db.articles) {
    if (article.categoryId === id) article.categoryId = null;
  }
  await writeDb(db);
}
