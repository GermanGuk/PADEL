// App-side shape of each Supabase table (camelCase; src/lib/data/*.ts maps
// to/from the snake_case DB columns — see supabase/schema.sql).

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
  telegramUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
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
