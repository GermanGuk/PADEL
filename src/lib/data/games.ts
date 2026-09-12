import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbGame } from "@/lib/db-types";
import type { GameCard } from "@/lib/content";

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

function sorted(games: DbGame[]): DbGame[] {
  return [...games].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getGameCards(): Promise<GameCard[]> {
  const db = await readDb();
  return sorted(db.games).map(toGameCard);
}

export async function getGamesForAdmin(): Promise<DbGame[]> {
  const db = await readDb();
  return sorted(db.games);
}

export async function createGame(data: Omit<DbGame, "id">): Promise<void> {
  const db = await readDb();
  db.games.push({ ...data, id: randomUUID() });
  await writeDb(db);
}

export async function updateGame(id: string, data: Omit<DbGame, "id">): Promise<void> {
  const db = await readDb();
  const idx = db.games.findIndex((g) => g.id === id);
  if (idx !== -1) db.games[idx] = { ...data, id };
  await writeDb(db);
}

export async function deleteGame(id: string): Promise<DbGame | undefined> {
  const db = await readDb();
  const game = db.games.find((g) => g.id === id);
  db.games = db.games.filter((g) => g.id !== id);
  await writeDb(db);
  return game;
}
