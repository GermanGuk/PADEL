import "server-only";
import { createGame, deleteGame, getGamesForAdmin, updateGame } from "@/lib/data/games";
import {
  createPricingPlan,
  deletePricingPlan,
  getPricingPlansForAdmin,
  updatePricingPlan,
} from "@/lib/data/pricing";
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImagesForAdmin,
  updateGalleryImage,
} from "@/lib/data/gallery";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  getGalleryCategories,
  renameGalleryCategory,
} from "@/lib/data/gallery-categories";
import {
  createArticle,
  deleteArticle,
  getArticlesForAdmin,
  isSlugTaken,
  updateArticle,
} from "@/lib/data/articles";
import {
  createJournalCategory,
  deleteJournalCategory,
  getJournalCategories,
  renameJournalCategory,
} from "@/lib/data/journal-categories";
import { getSettings, updateSettings } from "@/lib/data/settings";
import {
  createHeroCard,
  deleteHeroCard,
  getHeroCardsForAdmin,
  updateHeroCard,
} from "@/lib/data/hero-cards";
import { slugify } from "@/lib/slug";
import type {
  DbArticle,
  DbGame,
  DbGalleryImage,
  DbHeroCard,
  DbTrainingPlan,
  GameMeta,
  PricingRow,
} from "@/lib/db-types";
import type { EntityConfig, EntityItem, EntityValues, FieldSpec } from "./types";

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const orNull = (v: unknown) => (v === "" || v == null ? null : String(v));

// ── Первый экран (карточки на верху сайта) ───────────────────────────
const heroEntity: EntityConfig = {
  key: "h",
  title: "Первый экран",
  fields: [
    { key: "tag", label: "Тег (подпись сверху)", type: "text" },
    { key: "title", label: "Заголовок", type: "text" },
    { key: "meta", label: "Доп. текст", type: "text", optional: true },
    { key: "image", label: "Фото", type: "photo", folder: "hero" },
    { key: "featured", label: "Крупная карточка", type: "boolean" },
  ],
  list: async () => (await getHeroCardsForAdmin()) as unknown as EntityItem[],
  summary: (item) => `${item.featured ? "⭐ " : ""}${str(item.title)}`,
  detail: (item) => {
    const c = item as unknown as DbHeroCard;
    return [c.tag, c.title, c.meta ?? ""].filter(Boolean).join("\n");
  },
  photoOf: (item) => (item as unknown as DbHeroCard).image,
  valuesOf: (item) => {
    const c = item as unknown as DbHeroCard;
    return { tag: c.tag, title: c.title, meta: c.meta, image: c.image, featured: c.featured };
  },
  create: async (values) => {
    const list = await getHeroCardsForAdmin();
    await createHeroCard(buildHeroPayload(values, "#top", list.length));
  },
  update: async (id, values) => {
    const list = await getHeroCardsForAdmin();
    const current = list.find((c) => c.id === id);
    await updateHeroCard(id, buildHeroPayload(values, current?.href ?? "#top", current?.sortOrder ?? 0));
  },
  remove: (id) => deleteHeroCard(id).then(() => undefined),
};

function buildHeroPayload(values: EntityValues, href: string, sortOrder: number): Omit<DbHeroCard, "id"> {
  return {
    tag: str(values.tag),
    title: str(values.title),
    meta: orNull(values.meta),
    image: str(values.image),
    href,
    featured: Boolean(values.featured),
    sortOrder,
  };
}

// ── Игры и турниры ───────────────────────────────────────────────────
const gamesEntity: EntityConfig = {
  key: "g",
  title: "Игры и турниры",
  fields: [
    { key: "badge", label: "Дата/бейдж", type: "text" },
    { key: "title", label: "Название", type: "text" },
    { key: "players", label: "Игроки", type: "text", optional: true },
    { key: "courts", label: "Корты", type: "text", optional: true },
    { key: "clock", label: "Время", type: "text", optional: true },
    { key: "location", label: "Место", type: "text", optional: true },
    { key: "price", label: "Цена", type: "text", optional: true },
    { key: "extra", label: "Доп. текст", type: "text", optional: true },
    { key: "image", label: "Фото", type: "photo", optional: true, folder: "games" },
    { key: "featured", label: "Главная карточка (на первом экране)", type: "boolean" },
  ],
  list: async () => (await getGamesForAdmin()) as unknown as EntityItem[],
  summary: (item) => `${item.featured ? "⭐ " : ""}${str(item.title)} — ${str(item.badge)}`,
  detail: (item) => {
    const g = item as unknown as DbGame;
    const meta = g.meta.map((m) => m.text).join(" · ");
    return [
      `${g.featured ? "⭐ " : ""}${g.title}`,
      g.badge,
      meta,
      g.price ? `Цена: ${g.price}` : "Цена не указана",
      g.extra ?? "",
    ]
      .filter(Boolean)
      .join("\n");
  },
  photoOf: (item) => (item as unknown as DbGame).image,
  valuesOf: (item) => {
    const g = item as unknown as DbGame;
    const byIcon = Object.fromEntries(g.meta.map((m) => [m.icon, m.text]));
    return {
      badge: g.badge,
      title: g.title,
      players: byIcon.players ?? null,
      courts: byIcon.courts ?? null,
      clock: byIcon.clock ?? null,
      location: byIcon.location ?? null,
      price: g.price,
      extra: g.extra,
      image: g.image,
      featured: g.featured,
    };
  },
  create: async (values) => {
    const list = await getGamesForAdmin();
    await createGame(buildGamePayload(values, list.length));
  },
  update: async (id, values) => {
    const list = await getGamesForAdmin();
    const current = list.find((g) => g.id === id);
    await updateGame(id, buildGamePayload(values, current?.sortOrder ?? 0));
  },
  remove: (id) => deleteGame(id).then(() => undefined),
};

function buildGamePayload(values: EntityValues, sortOrder: number): Omit<DbGame, "id"> {
  const meta: GameMeta[] = [];
  if (values.players) meta.push({ icon: "players", text: str(values.players) });
  if (values.courts) meta.push({ icon: "courts", text: str(values.courts) });
  if (values.clock) meta.push({ icon: "clock", text: str(values.clock) });
  if (values.location) meta.push({ icon: "location", text: str(values.location) });
  return {
    featured: Boolean(values.featured),
    badge: str(values.badge),
    title: str(values.title),
    meta,
    extra: orNull(values.extra),
    price: orNull(values.price),
    image: orNull(values.image),
    sortOrder,
  };
}

// ── Тренировки ────────────────────────────────────────────────────────
const ROW_SLOTS = 3;
const trainingFields: FieldSpec[] = [
  { key: "number", label: "Номер", type: "text" },
  { key: "title", label: "Название", type: "text" },
  { key: "description", label: "Описание", type: "text" },
  { key: "price", label: "Цена / тренировка", type: "text" },
  {
    key: "icon",
    label: "Иконка",
    type: "select",
    options: async () => [
      { value: "solo", label: "Один человек" },
      { value: "group", label: "Группа" },
    ],
  },
  { key: "dark", label: "Тёмная карточка", type: "boolean" },
];
for (let i = 1; i <= ROW_SLOTS; i++) {
  trainingFields.push(
    { key: `row${i}_label`, label: `Пакет ${i} — название (напр. «4 тренировки»)`, type: "text", optional: true },
    { key: `row${i}_old`, label: `Пакет ${i} — старая цена`, type: "text", optional: true },
    { key: `row${i}_new`, label: `Пакет ${i} — новая цена`, type: "text", optional: true }
  );
}

const trainingEntity: EntityConfig = {
  key: "t",
  title: "Тренировки",
  fields: trainingFields,
  list: async () => (await getPricingPlansForAdmin()) as unknown as EntityItem[],
  summary: (item) => `${str(item.title)} — ${str(item.price)}`,
  detail: (item) => {
    const p = item as unknown as DbTrainingPlan;
    const rows = p.rows.map((r) => `${r.label}: ${r.oldPrice} → ${r.newPrice}`).join("\n");
    return [p.title, p.description, `Цена: ${p.price}`, rows].filter(Boolean).join("\n");
  },
  valuesOf: (item) => {
    const p = item as unknown as DbTrainingPlan;
    const values: EntityValues = {
      number: p.number,
      title: p.title,
      description: p.description,
      price: p.price,
      icon: p.icon,
      dark: p.dark,
    };
    for (let i = 1; i <= ROW_SLOTS; i++) {
      const row = p.rows[i - 1];
      values[`row${i}_label`] = row?.label ?? null;
      values[`row${i}_old`] = row?.oldPrice ?? null;
      values[`row${i}_new`] = row?.newPrice ?? null;
    }
    return values;
  },
  create: async (values) => {
    const list = await getPricingPlansForAdmin();
    await createPricingPlan(buildTrainingPayload(values, list.length));
  },
  update: async (id, values) => {
    const list = await getPricingPlansForAdmin();
    const current = list.find((p) => p.id === id);
    await updatePricingPlan(id, buildTrainingPayload(values, current?.sortOrder ?? 0));
  },
  remove: (id) => deletePricingPlan(id),
};

function buildTrainingPayload(values: EntityValues, sortOrder: number): Omit<DbTrainingPlan, "id"> {
  const rows: PricingRow[] = [];
  for (let i = 1; i <= ROW_SLOTS; i++) {
    const label = values[`row${i}_label`];
    const oldPrice = values[`row${i}_old`];
    const newPrice = values[`row${i}_new`];
    if (label && oldPrice && newPrice) {
      rows.push({ label: str(label), oldPrice: str(oldPrice), newPrice: str(newPrice) });
    }
  }
  return {
    dark: Boolean(values.dark),
    number: str(values.number),
    title: str(values.title),
    description: str(values.description),
    price: str(values.price),
    icon: (values.icon === "group" ? "group" : "solo") as "solo" | "group",
    rows,
    sortOrder,
  };
}

// ── Галерея ───────────────────────────────────────────────────────────
const galleryEntity: EntityConfig = {
  key: "gi",
  title: "Галерея",
  fields: [
    { key: "image", label: "Фото", type: "photo", folder: "gallery" },
    {
      key: "category",
      label: "Категория",
      type: "select",
      optional: true,
      options: async () => (await getGalleryCategories()).map((c) => ({ value: c.id, label: c.name })),
    },
  ],
  list: async () => (await getGalleryImagesForAdmin()) as unknown as EntityItem[],
  summary: (item) => `Фото #${str(item.id).slice(0, 8)}`,
  detail: () => "",
  photoOf: (item) => (item as unknown as DbGalleryImage).url,
  valuesOf: (item) => {
    const img = item as unknown as DbGalleryImage;
    return { image: img.url, category: img.categoryId };
  },
  create: async (values) => {
    const list = await getGalleryImagesForAdmin();
    await createGalleryImage({
      url: str(values.image),
      categoryId: orNull(values.category),
      sortOrder: list.length,
    });
  },
  update: async (id, values) => {
    await updateGalleryImage(id, { url: str(values.image), categoryId: orNull(values.category) });
  },
  remove: (id) => deleteGalleryImage(id).then(() => undefined),
};

const galleryCategoriesEntity = simpleCategoryEntity(
  "gc",
  "Категории галереи",
  getGalleryCategories,
  createGalleryCategory,
  renameGalleryCategory,
  deleteGalleryCategory
);

// ── Padel Journal ─────────────────────────────────────────────────────
const articlesEntity: EntityConfig = {
  key: "a",
  title: "Padel Journal",
  fields: [
    { key: "title", label: "Заголовок", type: "text" },
    {
      key: "category",
      label: "Категория",
      type: "select",
      optional: true,
      options: async () => (await getJournalCategories()).map((c) => ({ value: c.id, label: c.name })),
    },
    { key: "cover", label: "Обложка", type: "photo", folder: "journal" },
    { key: "body", label: "Текст статьи", type: "text" },
    { key: "seoTitle", label: "SEO Title", type: "text", optional: true },
    { key: "seoDescription", label: "SEO Description", type: "text", optional: true },
    { key: "published", label: "Опубликовано", type: "boolean" },
  ],
  list: async () => (await getArticlesForAdmin()) as unknown as EntityItem[],
  summary: (item) => `${item.published ? "" : "📝 "}${str(item.title)}`,
  detail: (item) => {
    const a = item as unknown as DbArticle;
    return [
      a.published ? a.title : `[черновик] ${a.title}`,
      `/journal/${a.slug}`,
      a.seoTitle ? `SEO: ${a.seoTitle}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
  photoOf: (item) => (item as unknown as DbArticle).cover,
  valuesOf: (item) => {
    const a = item as unknown as DbArticle;
    return {
      title: a.title,
      category: a.categoryId,
      cover: a.cover,
      body: a.body,
      seoTitle: a.seoTitle,
      seoDescription: a.seoDescription,
      published: a.published,
    };
  },
  create: async (values) => {
    const list = await getArticlesForAdmin();
    await createArticle(await buildArticlePayload(values, list.length));
  },
  update: async (id, values) => {
    const list = await getArticlesForAdmin();
    const current = list.find((a) => a.id === id);
    await updateArticle(id, await buildArticlePayload(values, current?.sortOrder ?? 0, id, current?.slug));
  },
  remove: (id) => deleteArticle(id).then(() => undefined),
};

async function buildArticlePayload(
  values: EntityValues,
  sortOrder: number,
  excludeId?: string,
  existingSlug?: string
): Promise<Omit<DbArticle, "id">> {
  const title = str(values.title);
  let slug = existingSlug ?? "";
  if (!slug) {
    const base = slugify(title) || "article";
    slug = base;
    let i = 2;
    while (await isSlugTaken(slug, excludeId)) {
      slug = `${base}-${i}`;
      i += 1;
    }
  }
  return {
    title,
    categoryId: orNull(values.category),
    slug,
    cover: str(values.cover),
    body: str(values.body),
    seoTitle: str(values.seoTitle) || title,
    seoDescription: str(values.seoDescription),
    published: Boolean(values.published),
    sortOrder,
  };
}

const journalCategoriesEntity = simpleCategoryEntity(
  "jc",
  "Категории Padel Journal",
  getJournalCategories,
  createJournalCategory,
  renameJournalCategory,
  deleteJournalCategory
);

function simpleCategoryEntity(
  key: string,
  title: string,
  list: () => Promise<{ id: string; name: string }[]>,
  create: (name: string) => Promise<void>,
  rename: (id: string, name: string) => Promise<void>,
  remove: (id: string) => Promise<void>
): EntityConfig {
  return {
    key,
    title,
    fields: [{ key: "name", label: "Название", type: "text" }],
    list: async () => (await list()) as unknown as EntityItem[],
    summary: (item) => str(item.name),
    detail: (item) => str(item.name),
    valuesOf: (item) => ({ name: str(item.name) }),
    create: (values) => create(str(values.name)),
    update: (id, values) => rename(id, str(values.name)),
    remove,
  };
}

// ── SEO / настройки сайта (singleton, без списка) ───────────────────
export const settingsFields: FieldSpec[] = [
  { key: "seoTitle", label: "SEO Title (главная)", type: "text" },
  { key: "seoDescription", label: "SEO Description (главная)", type: "text", optional: true },
  { key: "faviconUrl", label: "Favicon", type: "photo", optional: true, folder: "settings" },
  { key: "telegramUrl", label: "Ссылка Telegram", type: "text", optional: true },
  { key: "instagramUrl", label: "Ссылка Instagram", type: "text", optional: true },
  { key: "whatsappUrl", label: "Ссылка WhatsApp", type: "text", optional: true },
];

export async function getSettingsValues(): Promise<EntityValues> {
  const s = await getSettings();
  return {
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    faviconUrl: s.faviconUrl,
    telegramUrl: s.telegramUrl,
    instagramUrl: s.instagramUrl,
    whatsappUrl: s.whatsappUrl,
  };
}

export async function saveSettingsValue(field: string, value: string | boolean | null): Promise<void> {
  const current = await getSettings();
  const next = { ...current };
  if (field === "seoTitle") next.seoTitle = str(value) || current.seoTitle;
  if (field === "seoDescription") next.seoDescription = str(value);
  if (field === "faviconUrl") next.faviconUrl = orNull(value);
  if (field === "telegramUrl") next.telegramUrl = orNull(value) ?? current.telegramUrl;
  if (field === "instagramUrl") next.instagramUrl = orNull(value) ?? current.instagramUrl;
  if (field === "whatsappUrl") next.whatsappUrl = orNull(value) ?? current.whatsappUrl;
  await updateSettings(next);
}

// ── Registry ──────────────────────────────────────────────────────────
export const entities: Record<string, EntityConfig> = {
  h: heroEntity,
  g: gamesEntity,
  t: trainingEntity,
  gi: galleryEntity,
  gc: galleryCategoriesEntity,
  a: articlesEntity,
  jc: journalCategoriesEntity,
};

// Which categories-entity each main entity's photo/list items link to.
export const categoryLinks: Record<string, string> = { gi: "gc", a: "jc" };

export const mainMenu: { key: string; label: string }[] = [
  { key: "h", label: "🏠 Первый экран" },
  { key: "g", label: "🎾 Игры и турниры" },
  { key: "t", label: "💪 Тренировки" },
  { key: "gi", label: "🖼 Галерея" },
  { key: "a", label: "📰 Padel Journal" },
  { key: "seo", label: "⚙️ SEO" },
];
