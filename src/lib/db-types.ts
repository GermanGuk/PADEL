// Shape of data/mock-db.json — the local, file-based stand-in for a real
// database during this mock-data phase. Mirrors the shape a Supabase schema
// would use (id + sortOrder per row) so swapping in a real DB later only
// touches src/lib/data/*.ts, not the admin UI.

export type GameMeta = { icon: "players" | "courts" | "clock" | "location"; text: string };

export type DbGame = {
  id: string;
  featured: boolean;
  badge: string;
  title: string;
  meta: GameMeta[];
  extra: string | null;
  price: string | null;
  image: string | null;
  sortOrder: number;
};

export type PricingRow = { label: string; oldPrice: string; newPrice: string };

export type DbTrainingPlan = {
  id: string;
  dark: boolean;
  number: string;
  title: string;
  description: string;
  price: string;
  icon: "solo" | "group";
  rows: PricingRow[];
  sortOrder: number;
};

export type DbGalleryCategory = { id: string; name: string };

export type DbGalleryImage = {
  id: string;
  url: string;
  categoryId: string | null;
  sortOrder: number;
};

export type DbJournalCategory = { id: string; name: string };

export type DbArticle = {
  id: string;
  title: string;
  categoryId: string | null;
  slug: string;
  cover: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sortOrder: number;
};

export type DbSettings = {
  seoTitle: string;
  seoDescription: string;
  faviconUrl: string | null;
};

export type MockDb = {
  games: DbGame[];
  trainingPlans: DbTrainingPlan[];
  galleryCategories: DbGalleryCategory[];
  galleryImages: DbGalleryImage[];
  journalCategories: DbJournalCategory[];
  articles: DbArticle[];
  settings: DbSettings;
};
