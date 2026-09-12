import "server-only";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbSettings } from "@/lib/db-types";

export async function getSettings(): Promise<DbSettings> {
  const db = await readDb();
  return db.settings;
}

export async function updateSettings(data: DbSettings): Promise<void> {
  const db = await readDb();
  db.settings = data;
  await writeDb(db);
}
