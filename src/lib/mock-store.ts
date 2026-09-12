import "server-only";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { MockDb } from "./db-types";

const DB_PATH = path.join(process.cwd(), "data", "mock-db.json");

export async function readDb(): Promise<MockDb> {
  const raw = await readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as MockDb;
}

export async function writeDb(db: MockDb): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2) + "\n", "utf-8");
}
