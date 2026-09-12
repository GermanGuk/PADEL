import "server-only";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/mock-store";
import type { DbTrainingPlan } from "@/lib/db-types";
import type { PricingPlan } from "@/lib/content";

function toPricingPlan(row: DbTrainingPlan): PricingPlan {
  return {
    dark: row.dark || undefined,
    number: row.number,
    title: row.title,
    description: row.description,
    price: row.price,
    icon: row.icon,
    rows: row.rows,
  };
}

function sorted(plans: DbTrainingPlan[]): DbTrainingPlan[] {
  return [...plans].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const db = await readDb();
  return sorted(db.trainingPlans).map(toPricingPlan);
}

export async function getPricingPlansForAdmin(): Promise<DbTrainingPlan[]> {
  const db = await readDb();
  return sorted(db.trainingPlans);
}

export async function createPricingPlan(data: Omit<DbTrainingPlan, "id">): Promise<void> {
  const db = await readDb();
  db.trainingPlans.push({ ...data, id: randomUUID() });
  await writeDb(db);
}

export async function updatePricingPlan(id: string, data: Omit<DbTrainingPlan, "id">): Promise<void> {
  const db = await readDb();
  const idx = db.trainingPlans.findIndex((p) => p.id === id);
  if (idx !== -1) db.trainingPlans[idx] = { ...data, id };
  await writeDb(db);
}

export async function deletePricingPlan(id: string): Promise<void> {
  const db = await readDb();
  db.trainingPlans = db.trainingPlans.filter((p) => p.id !== id);
  await writeDb(db);
}
