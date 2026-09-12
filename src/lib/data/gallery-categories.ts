import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbGalleryCategory } from "@/lib/db-types";

export async function getGalleryCategories(): Promise<DbGalleryCategory[]> {
  const db = await readDb();
  return db.galleryCategories;
}

export async function createGalleryCategory(name: string): Promise<void> {
  const db = await readDb();
  db.galleryCategories.push({ id: randomUUID(), name });
  await writeDb(db);
}

export async function renameGalleryCategory(id: string, name: string): Promise<void> {
  const db = await readDb();
  const category = db.galleryCategories.find((c) => c.id === id);
  if (category) category.name = name;
  await writeDb(db);
}

export async function deleteGalleryCategory(id: string): Promise<void> {
  const db = await readDb();
  db.galleryCategories = db.galleryCategories.filter((c) => c.id !== id);
  for (const image of db.galleryImages) {
    if (image.categoryId === id) image.categoryId = null;
  }
  await writeDb(db);
}
