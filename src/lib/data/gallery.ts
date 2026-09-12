import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbGalleryImage } from "@/lib/db-types";

export type GalleryImage = { id: string; url: string; categoryId: string | null };

function sorted(images: DbGalleryImage[]): DbGalleryImage[] {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const db = await readDb();
  return sorted(db.galleryImages).map(({ id, url, categoryId }) => ({ id, url, categoryId }));
}

export async function getGalleryImagesForAdmin(): Promise<DbGalleryImage[]> {
  const db = await readDb();
  return sorted(db.galleryImages);
}

export async function createGalleryImage(data: Omit<DbGalleryImage, "id">): Promise<void> {
  const db = await readDb();
  db.galleryImages.push({ ...data, id: randomUUID() });
  await writeDb(db);
}

export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<DbGalleryImage, "id">>
): Promise<void> {
  const db = await readDb();
  const image = db.galleryImages.find((i) => i.id === id);
  if (image) Object.assign(image, data);
  await writeDb(db);
}

export async function deleteGalleryImage(id: string): Promise<DbGalleryImage | undefined> {
  const db = await readDb();
  const image = db.galleryImages.find((i) => i.id === id);
  db.galleryImages = db.galleryImages.filter((i) => i.id !== id);
  await writeDb(db);
  return image;
}
